const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  freeAdsRemaining: {
    type: Number,
    default: 3,
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'standard', 'premium'],
    default: 'free',
  },
  subscriptionEndsAt: {
    type: Date,
  },
  paidAdsRemaining: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
