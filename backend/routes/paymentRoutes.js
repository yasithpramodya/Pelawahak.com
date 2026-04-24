import express from 'express';
import { createCheckoutSession, payhereNotify } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/create-checkout-session').post(protect, createCheckoutSession);
router.route('/payhere-notify').post(payhereNotify);

export default router;
