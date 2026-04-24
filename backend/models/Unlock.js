import mongoose from 'mongoose';

const unlockSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  profileUnlocked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PartnerProfile',
    required: true,
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    // Could be optional if unlocked via mutual interest
  },
  unlockedAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ['Paid', 'Mutual'], // Distinguish how it was unlocked
    default: 'Paid'
  }
}, {
  timestamps: true
});

const Unlock = mongoose.model('Unlock', unlockSchema);
export default Unlock;
