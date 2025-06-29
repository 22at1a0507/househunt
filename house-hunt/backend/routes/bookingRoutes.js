const express = require('express');
const router = express.Router();

const {
  createBooking,
  getBookingsForUser,
  getBookingsForOwner
} = require('../controllers/bookingController');

const { protect } = require('../middleware/authMiddleware');

// Protected Routes
router.post('/', protect, createBooking);
router.get('/', protect, getBookingsForUser);
router.get('/owner', protect, getBookingsForOwner);

module.exports = router;

const { updateBookingStatus } = require('../controllers/bookingController');
router.put('/:id/status', protect, updateBookingStatus);
