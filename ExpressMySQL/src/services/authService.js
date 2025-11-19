const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../config/database');

const SALT_ROUNDS = 10;

const registerUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const connection = await pool.getConnection();

  try {
    const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return { success: false, message: 'Email đã tồn tại' };
    }

    await connection.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'User']
    );

    return { success: true, message: 'Đăng ký thành công' };
  } finally {
    connection.release();
  }
};

const loginUser = async ({ email, password }) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) {
      return { success: false, message: 'Email chưa được đăng ký' };
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: 'Mật khẩu không đúng' };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '1h' }
    );

    return {
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    };
  } finally {
    connection.release();
  }
};

const getAllUsers = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    return rows;
  } finally {
    connection.release();
  }
};

const generateResetToken = async (email) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (!rows.length) {
      return { success: false, message: 'Email không tồn tại' };
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const expiresMinutes = Number(process.env.RESET_TOKEN_EXPIRES_MINUTES || 15);
    const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);

    await connection.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
      [resetToken, expiresAt, email]
    );

    return {
      success: true,
      message: 'Tạo token thành công',
      data: {
        resetToken,
        expiresAt,
      },
    };
  } finally {
    connection.release();
  }
};

const resetPassword = async ({ email, token, newPassword }) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT id, reset_token, reset_token_expires FROM users WHERE email = ?',
      [email]
    );

    if (!rows.length) {
      return { success: false, message: 'Email không tồn tại' };
    }

    const user = rows[0];
    if (!user.reset_token || user.reset_token !== token) {
      return { success: false, message: 'Token không hợp lệ' };
    }

    if (new Date(user.reset_token_expires) < new Date()) {
      return { success: false, message: 'Token đã hết hạn' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await connection.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?',
      [hashedPassword, email]
    );

    return { success: true, message: 'Đặt lại mật khẩu thành công' };
  } finally {
    connection.release();
  }
};

module.exports = {
  registerUser,
  loginUser,
  generateResetToken,
  resetPassword,
  getAllUsers,
};
