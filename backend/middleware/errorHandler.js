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
    const message = 'ไม่พบข้อมูลที่ต้องการ';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} มีอยู่ในระบบแล้ว`;
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่';
    error = new AppError(message, 401);
  }

  // Log error for debugging (server-side only)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Send standardized error response
  res.status(error.statusCode).json({
    success: false,
    message: error.message || 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง',
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
