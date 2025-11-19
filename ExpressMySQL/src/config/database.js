const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fullstack_node',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const testConnection = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    console.log('✅ Connected to MySQL database');
  } finally {
    connection.release();
  }
};

module.exports = {
  pool,
  testConnection,
};
