const express = require('express');
const router = express.Router();
const { cloudinary, upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// Single image upload
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    res.status(200).json({
      message: 'Image uploaded successfully',
      url: req.file.path,        // Cloudinary URL
      public_id: req.file.filename // Delete කරන්න පාවිච්චි කරන්න
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Image delete කරන්න
router.delete('/:public_id', protect, async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.public_id);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;