const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.RATE_LIMIT_MAX || 100),
  message: {
    success: false,
    message: 'Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter;
