/**
 * Custom error class for operational errors in the application
 * Extends the native Error class with additional properties for HTTP status codes
 * 
 * @class AppError
 * @extends Error
 * 
 * @property {number} statusCode - HTTP status code (e.g., 400, 404, 500)
 * @property {string} status - Error status ('fail' for 4xx, 'error' for 5xx)
 * @property {boolean} isOperational - Flag to distinguish operational errors from programming errors
 * 
 * @example
 * // Throw a 404 error
 * throw new AppError('Resource not found', 404);
 * 
 * @example
 * // Throw a 400 validation error
 * throw new AppError('Invalid input data', 400);
 */
class AppError extends Error {
  /**
   * Creates an instance of AppError
   * 
   * @param {string} message - Error message to display
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
