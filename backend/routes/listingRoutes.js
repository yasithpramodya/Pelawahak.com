import express from 'express';
const router = express.Router();
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/listingController.js';
import { protect, vendor, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .get(getListings)
  .post(protect, vendor, createListing);

router.route('/:id')
  .get(getListingById)
  .put(protect, vendor, updateListing)
  .delete(protect, vendor, deleteListing);

export default router;
