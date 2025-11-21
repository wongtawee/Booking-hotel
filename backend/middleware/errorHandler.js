const ERROR_MESSAGES = require('../constants/errorMessages');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    let message = ERROR_MESSAGES.VALIDATION_ERROR;
    
    // Specific message for email duplicates
    if (field === 'email') {
      message = ERROR_MESSAGES.EMAIL_ALREADY_EXISTS;
    } else {
      message = `${field} มีอยู่ในระบบแล้ว`;
    }
    
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message || ERROR_MESSAGES.VALIDATION_ERROR, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError(ERROR_MESSAGES.INVALID_TOKEN, 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError(ERROR_MESSAGES.TOKEN_EXPIRED, 401);
  }

  // Log error for debugging (server-side only)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Send standardized error response
  res.status(error.statusCode).json({
    success: false,
    message: error.message || ERROR_MESSAGES.SERVER_ERROR,
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.message,
      stack: err.stack 
    })
  });
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

module.exports = { AppError, errorHandler, notFound };
