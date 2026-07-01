const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Partner = require('../models/Partner');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const User = require('../models/User');
const PartnerUnlock = require('../models/PartnerUnlock');
const jwt = require('jsonwebtoken');

// @desc    Create a new partner profile
// @route   POST /api/partners
// @access  Private
router.post('/', protect, upload.array('images', 3), async (req, res) => {
  try {
    const { title, gender, age, religion, profession, district, city, height, education, description, phone } = req.body;
    
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => file.path || file.location || `/uploads/${file.filename}`);
    } else if (req.body.imageUrls) {
      imagePaths = Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [req.body.imageUrls];
    } else if (req.body.images) {
      imagePaths = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const partner = await Partner.create({
      user: req.user._id,
      title,
      gender,
      age,
      religion,
      profession,
      district,
      city,
      height,
      education,
      description,
      phone,
      images: imagePaths,
      status: 'pending'
    });

    res.status(201).json(partner);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Fetch approved partner profiles (with filtering)
// @route   GET /api/partners
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { gender, religion, district, ageMin, ageMax, search } = req.query;
    let query = { status: 'approved' };

    if (gender) query.gender = gender;
    if (religion) query.religion = religion;
    if (district) query.district = district;
    if (ageMin || ageMax) {
      query.age = {};
      if (ageMin) query.age.$gte = Number(ageMin);
      if (ageMax) query.age.$lte = Number(ageMax);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { profession: { $regex: search, $options: 'i' } }
      ];
    }

    // Check optional authentication
    let userId = null;
    let isAdmin = false;
    let unlockedPartnerIds = new Set();

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
        if (userId) {
          const user = await User.findById(userId);
          if (user) {
            if (user.role === 'admin') {
              isAdmin = true;
            } else {
              // Subscription plan unlocks all profiles within its viewing window
              const hasActivePlanView = user.profileViewEndsAt && new Date() < new Date(user.profileViewEndsAt);
              if (hasActivePlanView) {
                isAdmin = true; // treat as fully unlocked
              } else {
                const unlocks = await PartnerUnlock.find({ user: userId, status: 'completed' });
                unlockedPartnerIds = new Set(unlocks.map(u => u.partner.toString()));
              }
            }
          }
        }
      } catch (err) {
        // Ignore invalid token
      }
    }

    const partners = await Partner.find(query).populate('user', 'name').sort({ createdAt: -1 });

    const updatedPartners = partners.map(partner => {
      const isOwner = userId && partner.user && partner.user._id.toString() === userId.toString();
      const isUnlocked = isAdmin || isOwner || unlockedPartnerIds.has(partner._id.toString());
      
      const partnerObj = partner.toObject();
      if (!isUnlocked) {
        partnerObj.phone = ''; // hide phone
      }
      return {
        ...partnerObj,
        unlocked: isUnlocked
      };
    });

    res.json(updatedPartners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get user's own partner profiles
// @route   GET /api/partners/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const partners = await Partner.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get single partner profile by ID
// @route   GET /api/partners/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid profile ID format' });
    }

    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('user', 'name email');

    if (!partner) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Check optional authentication
    let userId = null;
    let unlocked = false;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
        if (userId) {
          const user = await User.findById(userId);
          if (user) {
            const isOwnerOrAdmin = user.role === 'admin' || (partner.user && partner.user._id.toString() === userId.toString());
            if (isOwnerOrAdmin) {
              unlocked = true;
            } else {
              // Subscription plan: check if profile viewing window is active
              const hasActivePlanView = user.profileViewEndsAt && new Date() < new Date(user.profileViewEndsAt);
              if (hasActivePlanView) {
                unlocked = true;
              } else {
                // Fallback: per-profile one-time unlock
                const unlock = await PartnerUnlock.findOne({ user: userId, partner: partner._id, status: 'completed' });
                if (unlock) unlocked = true;
              }
            }
          }
        }
      } catch (err) {
        // Ignore invalid token
      }
    }

    const partnerObj = partner.toObject();
    if (!unlocked) {
      partnerObj.phone = ''; // hide phone
      if (partnerObj.user) {
        partnerObj.user.email = ''; // hide email
      }
    }

    res.json({
      partner: partnerObj,
      unlocked
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
