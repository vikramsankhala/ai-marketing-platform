const logger = require('../utils/logger');
const config = require('../config/environment');

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.logError(err, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Database connection errors
  if (err.code === 'ECONNREFUSED') {
    const message = 'Database connection failed';
    error = { message, statusCode: 503 };
  }

  // Rate limiting errors
  if (err.statusCode === 429) {
    const message = 'Too many requests';
    error = { message, statusCode: 429 };
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large';
    error = { message, statusCode: 413 };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected field';
    error = { message, statusCode: 400 };
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Syntax errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    const message = 'Invalid JSON';
    error = { message, statusCode: 400 };
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Prepare error response
  const errorResponse = {
    success: false,
    message,
    ...(config.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Add request ID if available
  if (req.id) {
    errorResponse.requestId = req.id;
  }

  // Add timestamp
  errorResponse.timestamp = new Date().toISOString();

  // Add path
  errorResponse.path = req.originalUrl;

  // Add method
  errorResponse.method = req.method;

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation error handler
const handleValidationError = (errors) => {
  const formattedErrors = errors.map(error => ({
    field: error.path,
    message: error.msg,
    value: error.value
  }));

  return {
    success: false,
    message: 'Validation failed',
    errors: formattedErrors
  };
};

// Database error handler
const handleDatabaseError = (err) => {
  let message = 'Database error occurred';
  let statusCode = 500;

  switch (err.code) {
    case '23505': // Unique violation
      message = 'Duplicate entry';
      statusCode = 409;
      break;
    case '23503': // Foreign key violation
      message = 'Referenced record not found';
      statusCode = 400;
      break;
    case '23502': // Not null violation
      message = 'Required field missing';
      statusCode = 400;
      break;
    case '23514': // Check violation
      message = 'Invalid data value';
      statusCode = 400;
      break;
    case '42P01': // Undefined table
      message = 'Database table not found';
      statusCode = 500;
      break;
    case '42703': // Undefined column
      message = 'Database column not found';
      statusCode = 500;
      break;
    default:
      message = err.message || 'Database error occurred';
  }

  return {
    success: false,
    message,
    statusCode
  };
};

// External API error handler
const handleExternalApiError = (err) => {
  let message = 'External API error';
  let statusCode = 502;

  if (err.response) {
    statusCode = err.response.status;
    message = err.response.data?.message || err.response.statusText || message;
  } else if (err.request) {
    message = 'External API unavailable';
    statusCode = 503;
  }

  return {
    success: false,
    message,
    statusCode
  };
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
  handleValidationError,
  handleDatabaseError,
  handleExternalApiError
};
