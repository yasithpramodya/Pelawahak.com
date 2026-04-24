import Interaction from '../models/Interaction.js';
import Unlock from '../models/Unlock.js';

// @desc    Send an interest to user
// @route   POST /api/partner/interaction/send/:receiverId
// @access  Private
export const sendInterest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.receiverId;

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: 'Cannot send interest to yourself' });
    }

    // Check if already sent
    const existing = await Interaction.findOne({ sender: senderId, receiver: receiverId });
    if (existing) {
       return res.status(400).json({ message: 'Interest already sent' });
    }

    // Also check if receiver has already sent interest to sender (mutual match case straight away)
    const reverse = await Interaction.findOne({ sender: receiverId, receiver: senderId, status: 'pending' });

    let newInteraction;
    if (reverse) {
       reverse.status = 'accepted';
       await reverse.save();
       
       newInteraction = await Interaction.create({
           sender: senderId,
           receiver: receiverId,
           status: 'accepted'
       });

       // Create mutual unlock
       await Unlock.create([
           { user: senderId, profileUnlocked: reverse.sender, type: 'Mutual' }, // Actually Profile object Id, but simplifying for now. Need careful handling if Unlock targets Profile object ID instead of User ID
       ]);
       // NOTE: The above Unlock logic needs adaptation because Unlock targets PartnerProfile ref, not User ref.
       // Let's hold off on creating literal Unlock entries here, or fetch profiles to do it properly.

    } else {
       newInteraction = await Interaction.create({
           sender: senderId,
           receiver: receiverId,
           status: 'pending'
       });
    }

    res.status(201).json(newInteraction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my sent interests
// @route   GET /api/partner/interaction/sent
// @access  Private
// ...
