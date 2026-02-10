/* eslint-disable no-unused-vars */

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Log full error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ error: `${field} already exists` });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : message,
  });
}

module.exports = errorHandler;
