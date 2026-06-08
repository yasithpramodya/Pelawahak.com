const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Ad = require('../models/Ad');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// @desc    Create a new ad
// @route   POST /api/ads
// @access  Private
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role !== 'admin') {
      let isPremium = user.subscriptionPlan === 'premium';
      if (!isPremium && user.subscriptionEndsAt && new Date() > new Date(user.subscriptionEndsAt)) {
        isPremium = false;
      }

      let canPost = false;
      let decrementQuery = null;

      if (isPremium) {
        canPost = true;
      } else if (user.freeAdsRemaining > 0) {
        canPost = true;
        decrementQuery = { $inc: { freeAdsRemaining: -1 } };
      } else if (user.paidAdsRemaining > 0) {
        canPost = true;
        decrementQuery = { $inc: { paidAdsRemaining: -1 } };
      }

      if (!canPost) {
        return res.status(403).json({ 
          message: 'Ad limit reached. Please purchase an ad slot or upgrade your subscription.',
          canBuy: true 
        });
      }

      if (decrementQuery) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: req.user._id },
          decrementQuery,
          { new: true }
        );
        if (!updatedUser) {
          return res.status(500).json({ message: 'Error updating user quotas.' });
        }
      }
    }

    const { title, description, category, district, city, price, phone } = req.body;
    let imagePaths = [];
    
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => file.path || file.location || `/uploads/${file.filename}`);
    } else if (req.body.imageUrls) {
      imagePaths = Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [req.body.imageUrls];
    } else if (req.body.images) {
      imagePaths = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const ad = await Ad.create({
      user: req.user._id,
      title,
      description,
      category,
      district,
      city,
      price,
      phone,
      images: imagePaths,
      status: 'pending' // Default status
    });

    res.status(201).json(ad);
  } catch (error) {
    console.error('Error creating ad:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Fetch approved ads (with optional filtering)
// @route   GET /api/ads
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, district, search } = req.query;
    let query = { status: 'approved' };

    if (category) query.category = category;
    if (district) query.district = district;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const ads = await Ad.find(query).populate('user', 'name').sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Fetch logged in user's ads
// @route   GET /api/ads/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const ads = await Ad.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get single ad by ID
// @route   GET /api/ads/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid listing ID format' });
    }

    const ad = await Ad.findByIdAndUpdate(
      req.params.id, 
      { $inc: { views: 1 } }, 
      { new: true }
    ).populate('user', 'name email');
    
    if (ad) {
      res.json(ad);
    } else {
      res.status(404).json({ message: 'Ad not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
