require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
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
    message: 'Backend MongoDB đang chạy. Vui lòng dùng các endpoint dưới /v1/api',
    endpoints: ['/v1/api/register', '/v1/api/login', '/v1/api/search'],
  });
});

(async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Seed sample products if needed
    await ensureProductTable();

    app.listen(PORT, () => {
      console.log(`✅ Backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Cannot start server:', error);
    process.exit(1);
  }
})();
