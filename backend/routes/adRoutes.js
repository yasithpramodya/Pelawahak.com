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

    if (user.role === 'user' && user.freeAdsRemaining <= 0) {
      return res.status(403).json({ message: 'Free ad limit reached. Please upgrade.' });
    }

    const { title, description, category, district, city, price, phone } = req.body;
    let imagePaths = [];
    
    if (req.files) {
      imagePaths = req.files.map(file => file.location || `/uploads/${file.filename}`);
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

    if (user.role === 'user') {
      user.freeAdsRemaining -= 1;
      await user.save();
    }

    res.status(201).json(ad);
  } catch (error) {
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
