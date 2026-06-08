const mongoose = require('mongoose');

const partnerUnlockSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true,
  },
  paypalOrderId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  unlockedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Prevent duplicate unlocks for the same user-partner pair
partnerUnlockSchema.index({ user: 1, partner: 1 }, { unique: true });

module.exports = mongoose.model('PartnerUnlock', partnerUnlockSchema);
