/**
 * Middleware kiểm tra quyền admin
 */
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Không được phép truy cập, yêu cầu quyền admin'
      });
    }
  };