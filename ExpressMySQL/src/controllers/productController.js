const { getCategories, getProducts } = require('../services/productService');

const getCategoryList = async (req, res) => {
  try {
    const categories = await getCategories();
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error('get categories error:', error);
    return res.status(500).json({ success: false, message: 'Không thể lấy danh mục' });
  }
};

const getProductList = async (req, res) => {
  try {
    const { category = 'all', page = 1, limit = 6 } = req.query;
    const data = await getProducts({ category, page, limit });
    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error('get products error:', error);
    return res.status(500).json({ success: false, message: 'Không thể lấy danh sách sản phẩm' });
  }
};

module.exports = {
  getCategoryList,
  getProductList,
};
