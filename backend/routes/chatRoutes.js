import express from 'express';
import { getChatHistory } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:userId').get(protect, getChatHistory);

export default router;
