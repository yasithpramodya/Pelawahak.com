import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'saved'],
    default: 'pending',
  }
}, {
  timestamps: true
});

const Interaction = mongoose.model('Interaction', interactionSchema);
export default Interaction;
