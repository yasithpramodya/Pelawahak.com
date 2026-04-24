import express from 'express';
const router = express.Router();
import upload from '../middleware/uploadMiddleware.js';

// @route   POST /api/upload
// @desc    Upload an image
// @access  Public (or could be restricted to Vendor/Admin)
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Please upload a file' });
  }
  // Return the path starting with /uploads/ so frontend can access via static route
  res.send({
    message: 'Image Uploaded',
    image: `/${req.file.path.replace(/\\/g, '/')}`, 
  });
});

// For multiple images
router.post('/multiple', upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ message: 'Please upload files' });
  }
  const filePaths = req.files.map(file => `/${file.path.replace(/\\/g, '/')}`);
  res.send({
    message: 'Images Uploaded',
    images: filePaths,
  });
});

export default router;
