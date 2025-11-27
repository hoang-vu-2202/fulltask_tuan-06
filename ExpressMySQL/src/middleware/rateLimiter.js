const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for testing (was 100)
  message: {
    success: false,
    message: 'Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter;
