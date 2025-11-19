const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');

const protect = require('../middleware/auth');

router.post('/', protect, createBooking);

router.get('/me', protect, getMyBookings);

router.get('/:id', protect, getBookingById);

router.put('/:id', protect, updateBooking);

router.delete('/:id', protect, deleteBooking);

module.exports = router;
