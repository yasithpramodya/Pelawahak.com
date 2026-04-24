import PartnerProfile from '../models/PartnerProfile.js';
import User from '../models/User.js';
import Interaction from '../models/Interaction.js';
import Unlock from '../models/Unlock.js';

// @desc    Create or update partner profile
// @route   POST /api/partner/profile
// @access  Private
export const createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profileData = req.body;

    let profile = await PartnerProfile.findOne({ user: userId });

    if (profile) {
      profile = await PartnerProfile.findOneAndUpdate(
        { user: userId },
        { $set: profileData },
        { new: true }
      );
    } else {
      profile = new PartnerProfile({
        user: userId,
        ...profileData
      });
      await profile.save();
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's own profile
// @route   GET /api/partner/profile/me
// @access  Private
export const getMyProfile = async (req, res) => {
  try {
    const profile = await PartnerProfile.findOne({ user: req.user._id }).populate('user', 'name email phoneNumber profilePicture');
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active partner profiles with basic filters
// @route   GET /api/partner/search
// @access  Public (or Private to see basic info)
export const searchProfiles = async (req, res) => {
  try {
    const { minAge, maxAge, religion, location, education } = req.query;
    let query = { isPublic: true };

    // Exclude own profile
    if (req.user) {
       query.user = { $ne: req.user._id };
    }

    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = Number(minAge);
      if (maxAge) query.age.$lte = Number(maxAge);
    }
    if (religion) query.religion = religion;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (education) query.education = { $regex: education, $options: 'i' };

    const profiles = await PartnerProfile.find(query)
      .populate('user', 'name'); // Only send basic details like name

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single profile by ID (Handling lock logic)
// @route   GET /api/partner/profile/:id
// @access  Private
export const getProfileById = async (req, res) => {
  try {
    const profile = await PartnerProfile.findById(req.params.id)
      .populate('user', 'name phoneNumber profilePicture');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const requestorId = req.user._id;

    // Check if Requestor is the owner
    if (profile.user._id.toString() === requestorId.toString()) {
      return res.json({ profile, contactHidden: false });
    }

    // Check if requesting user has an active subscription
    const requestor = await User.findById(requestorId);
    let hasAccess = false;

    if (requestor.subscriptionStatus === 'active' && new Date() < new Date(requestor.subscriptionEndsAt)) {
      hasAccess = true;
    } else {
      // Check for specific unlocking
      const unlock = await Unlock.findOne({ user: requestorId, profileUnlocked: profile._id });
      if (unlock) hasAccess = true;
    }

    // If no access, hide contact number
    let responseData = { ...profile.toObject() };
    if (!hasAccess && responseData.user && responseData.user.phoneNumber) {
      delete responseData.user.phoneNumber;
      return res.json({ profile: responseData, contactHidden: true });
    }

    res.json({ profile: responseData, contactHidden: false });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
