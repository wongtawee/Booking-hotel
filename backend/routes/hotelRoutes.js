const express = require('express');
const router = express.Router();
const {
  getAllHotels,
  getHotelById,
  searchHotels,
  createHotel,
  updateHotel,
  deleteHotel
} = require('../controllers/hotelController');
const protect = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { validateHotel, validateMongoId } = require('../middleware/validator');

// Public routes
router.get('/', getAllHotels);
router.get('/search', searchHotels);
router.get('/:id', validateMongoId, getHotelById);

// Admin routes
router.post('/', protect, adminMiddleware, validateHotel, createHotel);
router.put('/:id', protect, adminMiddleware, validateMongoId, validateHotel, updateHotel);
router.delete('/:id', protect, adminMiddleware, validateMongoId, deleteHotel);

module.exports = router;
