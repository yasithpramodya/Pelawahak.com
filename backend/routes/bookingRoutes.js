import express from 'express';
const router = express.Router();
import {
  createBooking,
  getMyBookings,
  getVendorBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, vendor } from '../middleware/authMiddleware.js';

router.route('/').post(protect, createBooking);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/vendorbookings').get(protect, vendor, getVendorBookings);
router.route('/:id/status').put(protect, vendor, updateBookingStatus);

export default router;
