const express = require('express');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const apiLimiter = require('../middleware/rateLimiter');
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require('../middleware/validators');
const {
  registerUserController,
  loginUserController,
  forgotPasswordController,
  resetPasswordController,
  getAccountController,
  getUsersController,
} = require('../controllers/authController');
const { getCategoryList, getProductList } = require('../controllers/productController');
const { searchProductsController } = require('../controllers/searchController');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello MongoDB API' });
});

router.post('/register', apiLimiter, registerValidation, registerUserController);
router.post('/login', apiLimiter, loginValidation, loginUserController);
router.post('/forgot-password', apiLimiter, forgotPasswordValidation, forgotPasswordController);
router.post('/reset-password', apiLimiter, resetPasswordValidation, resetPasswordController);

router.get('/account', authMiddleware, getAccountController);
router.get('/admin/users', authMiddleware, authorizeRoles('Admin'), getUsersController);
router.get('/categories', getCategoryList);
router.get('/products', getProductList);
router.get('/search', searchProductsController);

module.exports = router;
