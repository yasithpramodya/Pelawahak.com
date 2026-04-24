import Review from '../models/Review.js';
import Listing from '../models/Listing.js';

// @desc    Add a review for a listing
// @route   POST /api/reviews
// @access  Private (Customer)
const createReview = async (req, res) => {
  try {
    const { listing: listingId, rating, comment } = req.body;

    const review = new Review({
      user: req.user._id,
      listing: listingId,
      rating: Number(rating),
      comment,
    });

    const createdReview = await review.save();

    // Update listing rating and numReviews
    const reviews = await Review.find({ listing: listingId });
    const listing = await Listing.findById(listingId);

    listing.numReviews = reviews.length;
    listing.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await listing.save();

    res.status(201).json(createdReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a listing
// @route   GET /api/reviews/:listingId
// @access  Public
const getListingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createReview, getListingReviews };
