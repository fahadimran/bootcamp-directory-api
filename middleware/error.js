const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  // make cpoy or err using spread
  let error = { ...err };
  error.message = err.message;

  // MongoDB Object ID error
  if (err.name === "CastError") {
    error = new ErrorResponse(`Resource not found`, 404);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error = new ErrorResponse(`Duplicate value entered`, 400);
  }

  // Validation error
  if (err.name === "ValidationError") {
    error = new ErrorResponse(Object.values(err.errors), 400);
  }

  // only send res once
  // error msg set depending on type of error
  res.status(err.statusCode || 500).json({
    success: false,
    error: error.message,
  });
};

module.exports = errorHandler;
