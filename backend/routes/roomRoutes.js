const express = require('express');
const router = express.Router();
const {
  getRoomsByHotel,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  checkRoomAvailability
} = require('../controllers/roomController');
const protect = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { validateRoom, validateMongoId } = require('../middleware/validator');

// Public routes
router.get('/hotel/:hotelId', getRoomsByHotel);
router.get('/:id', validateMongoId, getRoomById);
router.post('/check-availability', checkRoomAvailability);

// Admin routes
router.post('/', protect, adminMiddleware, validateRoom, createRoom);
router.put('/:id', protect, adminMiddleware, validateMongoId, validateRoom, updateRoom);
router.delete('/:id', protect, adminMiddleware, validateMongoId, deleteRoom);

module.exports = router;
