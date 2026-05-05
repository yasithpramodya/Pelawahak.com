const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Partner = require('../models/Partner');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// @desc    Create a new partner profile
// @route   POST /api/partners
// @access  Private
router.post('/', protect, upload.array('images', 3), async (req, res) => {
  try {
    const { title, gender, age, religion, profession, district, city, height, education, description, phone } = req.body;
    
    let imagePaths = [];
    if (req.files) {
      imagePaths = req.files.map(file => file.location || `/uploads/${file.filename}`);
    }

    const partner = await Partner.create({
      user: req.user._id,
      title,
      gender,
      age,
      religion,
      profession,
      district,
      city,
      height,
      education,
      description,
      phone,
      images: imagePaths,
      status: 'pending'
    });

    res.status(201).json(partner);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Fetch approved partner profiles (with filtering)
// @route   GET /api/partners
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { gender, religion, district, ageMin, ageMax, search } = req.query;
    let query = { status: 'approved' };

    if (gender) query.gender = gender;
    if (religion) query.religion = religion;
    if (district) query.district = district;
    if (ageMin || ageMax) {
      query.age = {};
      if (ageMin) query.age.$gte = Number(ageMin);
      if (ageMax) query.age.$lte = Number(ageMax);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { profession: { $regex: search, $options: 'i' } }
      ];
    }

    const partners = await Partner.find(query).populate('user', 'name').sort({ createdAt: -1 });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get user's own partner profiles
// @route   GET /api/partners/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const partners = await Partner.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get single partner profile by ID
// @route   GET /api/partners/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid profile ID format' });
    }

    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('user', 'name email');

    if (partner) {
      res.json(partner);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
