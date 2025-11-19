const jwt = require('jsonwebtoken');
require('dotenv').config();

const whiteList = new Set(['/v1/api', '/v1/api/', '/v1/api/register', '/v1/api/login', '/v1/api/forgot-password', '/v1/api/reset-password']);

const authMiddleware = (req, res, next) => {
  if (whiteList.has(req.originalUrl)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Thiếu token xác thực' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token hết hạn hoặc sai' });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập' });
  }
  next();
};

module.exports = {
  authMiddleware,
  authorizeRoles,
};
