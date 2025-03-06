const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log to console for dev
  logger.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Không tìm thấy tài nguyên'
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Giá trị đã tồn tại trong hệ thống'
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Lỗi máy chủ'
  });
};

module.exports = errorHandler;