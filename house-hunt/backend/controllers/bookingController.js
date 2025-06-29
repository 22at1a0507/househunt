const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { propertyId, ownerId, message } = req.body;

    const booking = new Booking({
      propertyId,
      renterId: req.user._id,  // from authMiddleware
      ownerId,
      message
    });

    await booking.save();
    res.status(201).json({ message: 'Booking request sent', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingsForUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ renterId: req.user._id }).populate('propertyId');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings for owner
exports.getBookingsForOwner = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const bookings = await Booking.find({ ownerId }).populate('propertyId').populate('renterId', 'name email');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept or Reject Booking
exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ message: "Booking status updated", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
