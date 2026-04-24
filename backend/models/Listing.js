import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Wedding Halls', 'Catering', 'Makeup Artists', 'Dress Designers', 'Photography Services', 'Decorators']
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  images: [String], // Array of image URLs
  ratings: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false // Admin must approve
  }
}, {
  timestamps: true
});

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
