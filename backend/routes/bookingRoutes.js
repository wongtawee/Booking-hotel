const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
  cancelBooking,
  getAllBookings
} = require('../controllers/bookingController');

const protect = require('../middleware/auth');
const admin = require('../middleware/admin');

// Admin routes
router.get('/admin/all', protect, admin, getAllBookings);

// User routes
router.post('/', protect, createBooking);
router.get('/me', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

// Status management
router.patch('/:id/status', protect, updateBookingStatus);
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;
