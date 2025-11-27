const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const registerUser = async ({ name, email, password }) => {
  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: 'Email đã tồn tại' };
    }

    // Create new user (password will be hashed by pre-save middleware)
    const user = await User.create({ name, email, password, role: 'User' });

    return { success: true, message: 'Đăng ký thành công' };
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

const loginUser = async ({ email, password }) => {
  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: 'Email chưa được đăng ký' };
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return { success: false, message: 'Mật khẩu không đúng' };
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '1h' }
    );

    return {
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        access_token: token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.find()
      .select('-password') // Exclude password
      .sort({ createdAt: -1 });
    return users;
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

const generateResetToken = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: 'Email không tồn tại' };
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const expiresMinutes = Number(process.env.RESET_TOKEN_EXPIRES_MINUTES || 15);
    const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);

    user.resetToken = resetToken;
    user.resetTokenExpires = expiresAt;
    await user.save();

    return {
      success: true,
      message: 'Tạo token thành công',
      data: {
        resetToken,
        expiresAt,
      },
    };
  } catch (error) {
    console.error('Generate token error:', error);
    throw error;
  }
};

const resetPassword = async ({ email, token, newPassword }) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return { success: false, message: 'Email không tồn tại' };
    }

    if (!user.resetToken || user.resetToken !== token) {
      return { success: false, message: 'Token không hợp lệ' };
    }

    if (new Date(user.resetTokenExpires) < new Date()) {
      return { success: false, message: 'Token đã hết hạn' };
    }

    user.password = newPassword; // Will be hashed by pre-save hook
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    return { success: true, message: 'Đặt lại mật khẩu thành công' };
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  generateResetToken,
  resetPassword,
  getAllUsers,
};
