const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware bảo vệ các routes yêu cầu xác thực
 */
exports.protect = async (req, res, next) => {
  let token;

  // Kiểm tra header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Fallback to checking cookies if implemented
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Kiểm tra token tồn tại
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Không được phép truy cập, hãy đăng nhập'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lấy thông tin user từ token
    const user = await User.findById(decoded.id);
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại'
      });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

/**
 * Middleware kiểm tra quyền admin
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Không được phép truy cập'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền thực hiện hành động này'
      });
    }
    next();
  };
};