const {
  registerUser,
  loginUser,
  generateResetToken,
  resetPassword,
  getAllUsers,
} = require('../services/authService');

const registerUserController = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error('register error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const loginUserController = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('login error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const result = await generateResetToken(req.body.email);
    if (!result.success) {
      return res.status(400).json(result);
    }

    // Thực tế sẽ gửi resetToken qua email; tạm thời trả về để demo
    return res.status(200).json({
      success: true,
      message: 'Đã tạo token đặt lại mật khẩu',
      token: result.data.resetToken,
      expiresAt: result.data.expiresAt,
    });
  } catch (error) {
    console.error('forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const result = await resetPassword(req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('reset password error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getAccountController = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Thông tin người dùng',
    data: req.user,
  });
};

const getUsersController = async (req, res) => {
  try {
    const data = await getAllUsers();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('list users error:', error);
    return res.status(500).json({ success: false, message: 'Không thể lấy danh sách user' });
  }
};

module.exports = {
  registerUserController,
  loginUserController,
  forgotPasswordController,
  resetPasswordController,
  getAccountController,
  getUsersController,
};
