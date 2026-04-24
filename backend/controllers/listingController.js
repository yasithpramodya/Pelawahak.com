import Listing from '../models/Listing.js';

// @desc    Fetch all listings
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const location = req.query.location ? { location: { $regex: req.query.location, $options: 'i' } } : {};

    const listings = await Listing.find({ ...keyword, ...category, ...location }).populate('vendor', 'name email profilePicture');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single listing
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('vendor', 'name email profilePicture phoneNumber');
    if (listing) {
      res.json(listing);
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a listing
// @route   POST /api/listings
// @access  Private/Vendor
const createListing = async (req, res) => {
  try {
    const { title, category, description, price, location, images } = req.body;

    const listing = new Listing({
      title,
      category,
      description,
      price,
      location,
      images,
      vendor: req.user._id,
      isApproved: true, // Auto approve for MVP
    });

    const createdListing = await listing.save();
    res.status(201).json(createdListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private/Vendor
const updateListing = async (req, res) => {
  try {
    const { title, category, description, price, location, images } = req.body;

    const listing = await Listing.findById(req.params.id);

    if (listing) {
      // Check if user is the vendor
      if (listing.vendor.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        return res.status(401).json({ message: 'Not authorized to update this listing' });
      }

      listing.title = title || listing.title;
      listing.category = category || listing.category;
      listing.description = description || listing.description;
      listing.price = price || listing.price;
      listing.location = location || listing.location;
      listing.images = images || listing.images;

      const updatedListing = await listing.save();
      res.json(updatedListing);
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private/Vendor
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (listing) {
      // Check if user is the vendor
      if (listing.vendor.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        return res.status(401).json({ message: 'Not authorized to delete this listing' });
      }

      await listing.deleteOne();
      res.json({ message: 'Listing removed' });
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getListings, getListingById, createListing, updateListing, deleteListing };
