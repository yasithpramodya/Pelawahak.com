import express from 'express';
const router = express.Router();
import {
  createReview,
  getListingReviews,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, createReview);
router.route('/:listingId').get(getListingReviews);

export default router;
