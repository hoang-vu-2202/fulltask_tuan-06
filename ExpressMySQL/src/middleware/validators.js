const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errors.array(),
    });
  }
  next();
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Tên không được để trống').isLength({ min: 3 }).withMessage('Tên tối thiểu 3 ký tự'),
  body('email').trim().isEmail().withMessage('Email không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự'),
  handleValidation,
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu'),
  handleValidation,
];

const forgotPasswordValidation = [
  body('email').trim().isEmail().withMessage('Email không hợp lệ'),
  handleValidation,
];

const resetPasswordValidation = [
  body('email').trim().isEmail().withMessage('Email không hợp lệ'),
  body('token').notEmpty().withMessage('Token không được để trống'),
  body('newPassword').isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự'),
  handleValidation,
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
