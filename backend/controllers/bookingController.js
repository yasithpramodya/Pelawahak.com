import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Customer)
const createBooking = async (req, res) => {
  try {
    const { listing: listingId, eventDate, notes } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const booking = new Booking({
      user: req.user._id,
      listing: listingId,
      vendor: listing.vendor,
      eventDate,
      notes,
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('listing', 'title images');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get vendor's booking requests
// @route   GET /api/bookings/vendorbookings
// @access  Private/Vendor
const getVendorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ vendor: req.user._id })
      .populate('user', 'name email phoneNumber')
      .populate('listing', 'title');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Vendor
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (booking) {
      if (booking.vendor.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this booking' });
      }

      booking.status = status;
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createBooking, getMyBookings, getVendorBookings, updateBookingStatus };
