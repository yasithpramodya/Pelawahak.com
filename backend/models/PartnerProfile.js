import mongoose from 'mongoose';

const partnerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  religion: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  job: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  preferences: {
    ageRange: {
      min: Number,
      max: Number,
    },
    religion: String,
    education: String,
  },
  photos: [
    {
      type: String, // Array of image paths/URLs
    }
  ],
  isPublic: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

const PartnerProfile = mongoose.model('PartnerProfile', partnerProfileSchema);
export default PartnerProfile;
