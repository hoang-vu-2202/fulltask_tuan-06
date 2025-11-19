require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool, testConnection } = require('./config/database');
const { createUserTableQuery } = require('./models/userModel');
const { ensureProductTable } = require('./services/productService');
const apiRoutes = require('./routes/api');
const apiLimiter = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/v1/api', apiLimiter, apiRoutes);
app.get('/', (req, res) => {
  res.json({
    message: 'Backend MySQL đang chạy. Vui lòng dùng các endpoint dưới /v1/api',
    endpoints: ['/v1/api/register', '/v1/api/login', '/v1/api/forgot-password'],
  });
});

const initDB = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query(createUserTableQuery);
    console.log('✅ Users table ready');
  } finally {
    connection.release();
  }
  await ensureProductTable();
};

(async () => {
  try {
    await testConnection();
    await initDB();

    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Cannot start server:', error);
    process.exit(1);
  }
})();
