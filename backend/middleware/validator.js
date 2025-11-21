const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validations
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// Hotel validations
const validateHotel = [
  body('name')
    .trim()
    .notEmpty().withMessage('Hotel name is required')
    .isLength({ max: 100 }).withMessage('Hotel name cannot exceed 100 characters'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('images')
    .isArray({ min: 1 }).withMessage('At least one image is required'),
  body('pricePerNight')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 10 }).withMessage('Rating must be between 0 and 10'),
  handleValidationErrors
];

// Room validations
const validateRoom = [
  body('hotelId')
    .notEmpty().withMessage('Hotel ID is required')
    .isMongoId().withMessage('Invalid hotel ID'),
  body('roomType')
    .trim()
    .notEmpty().withMessage('Room type is required')
    .isIn(['Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential'])
    .withMessage('Invalid room type'),
  body('pricePerNight')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('capacity')
    .isInt({ min: 1, max: 10 }).withMessage('Capacity must be between 1 and 10'),
  handleValidationErrors
];

// Booking validations
const validateBooking = [
  body('hotelId')
    .notEmpty().withMessage('Hotel ID is required')
    .isMongoId().withMessage('Invalid hotel ID'),
  body('roomId')
    .notEmpty().withMessage('Room ID is required')
    .isMongoId().withMessage('Invalid room ID'),
  body('name')
    .trim()
    .escape() // XSS protection
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .matches(/^\d{10}$/).withMessage('Phone must be 10 digits'),
  body('checkIn')
    .notEmpty().withMessage('Check-in date is required')
    .isISO8601().withMessage('Invalid check-in date')
    .custom((checkIn) => {
      const date = new Date(checkIn);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('Check-in date cannot be in the past');
      }
      return true;
    }),
  body('checkOut')
    .notEmpty().withMessage('Check-out date is required')
    .isISO8601().withMessage('Invalid check-out date')
    .custom((checkOut, { req }) => {
      const checkOutDate = new Date(checkOut);
      const checkInDate = new Date(req.body.checkIn);
      
      if (checkOutDate <= checkInDate) {
        throw new Error('Check-out date must be after check-in date');
      }
      
      // Validate date range is not too long (e.g., max 30 days)
      const daysDiff = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
      if (daysDiff > 30) {
        throw new Error('Booking period cannot exceed 30 days');
      }
      
      return true;
    }),
  body('guests')
    .isInt({ min: 1, max: 10 }).withMessage('Guests must be between 1 and 10'),
  body('totalPrice')
    .isFloat({ min: 0 }).withMessage('Total price must be a positive number'),
  body('specialRequests')
    .optional()
    .trim()
    .escape() // XSS protection
    .isLength({ max: 500 }).withMessage('Special requests cannot exceed 500 characters'),
  handleValidationErrors
];

// ID parameter validation
const validateMongoId = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateHotel,
  validateRoom,
  validateBooking,
  validateMongoId,
  handleValidationErrors
};
