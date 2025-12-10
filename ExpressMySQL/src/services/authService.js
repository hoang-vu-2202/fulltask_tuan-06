const User = require('../models/userModel');
const jwt = require('jsonwebtoken'); // Thư viện tạo và xác thực token
const crypto = require('crypto'); // Thư viện mã hóa có sẵn của Node.js (dùng để tạo token ngẫu nhiên)

// ĐĂNG KÝ NGƯỜI DÙNG MỚI
const registerUser = async ({ name, email, password }) => {
  try {
    // Kiểm tra xem email đã có trong database chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: 'Email đã tồn tại' };
    }

    // Tạo user mới
    // Lưu ý: Password sẽ tự động được mã hóa (hash) bởi "pre-save middleware" bên trong User Model
    // mình không cần hash thủ công ở đây.
    const user = await User.create({ name, email, password, role: 'User' });

    return { success: true, message: 'Đăng ký thành công' };
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    throw error;
  }
};

// ĐĂNG NHẬP
const loginUser = async ({ email, password }) => {
  try {
    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: 'Email chưa được đăng ký' };
    }

    // Kiểm tra mật khẩu
    // Hàm comparePassword được định nghĩa trong User Model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return { success: false, message: 'Mật khẩu không đúng' };
    }

    // Tạo JWT Token (Đây là "vé vào cổng" cho user)
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role }, // Payload: thông tin gói trong token
      process.env.JWT_SECRET, // Khóa bí mật (chỉ server biết)
      { expiresIn: process.env.JWT_EXPIRES || '1h' } // Thời hạn token
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
    console.error('Lỗi đăng nhập:', error);
    throw error;
  }
};

// LẤY DANH SÁCH USER (Cho Admin)
const getAllUsers = async () => {
  try {
    const users = await User.find()
      .select('-password') // Quan trọng: Không trả về trường password
      .sort({ createdAt: -1 }); // Sắp xếp user mới nhất lên đầu
    return users;
  } catch (error) {
    console.error('Lỗi lấy danh sách user:', error);
    throw error;
  }
};

// QUÊN MẬT KHẨU
const generateResetToken = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: 'Email không tồn tại' };
    }

    // Tạo một chuỗi ngẫu nhiên làm token (không phải JWT, chỉ là token dùng 1 lần)
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set thời hạn (ví dụ 15 phút)
    const expiresMinutes = Number(process.env.RESET_TOKEN_EXPIRES_MINUTES || 15);
    const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);

    // Lưu token và thời hạn vào database của user đó
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
    console.error('Lỗi tạo token:', error);
    throw error;
  }
};

// ĐẶT LẠI MẬT KHẨU
const resetPassword = async ({ email, token, newPassword }) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return { success: false, message: 'Email không tồn tại' };
    }

    // Kiểm tra token có khớp không và còn hạn không
    if (!user.resetToken || user.resetToken !== token) {
      return { success: false, message: 'Token không hợp lệ' };
    }

    if (new Date(user.resetTokenExpires) < new Date()) {
      return { success: false, message: 'Token đã hết hạn' };
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword;

    // Xóa token reset đi để không dùng lại được nữa
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    return { success: true, message: 'Đặt lại mật khẩu thành công' };
  } catch (error) {
    console.error('Lỗi đặt lại mật khẩu:', error);
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
