import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Listing'
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  eventDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
