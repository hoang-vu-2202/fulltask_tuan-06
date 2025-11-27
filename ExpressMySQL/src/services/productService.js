const { Product, sampleProducts } = require('../models/productModel');

const ensureProductTable = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(sampleProducts);
      console.log('✅ Seeded sample products');
    }
  } catch (error) {
    console.error('Ensure products error:', error);
    throw error;
  }
};

const getCategories = async () => {
  try {
    const categories = await Product.distinct('category');
    return categories.sort();
  } catch (error) {
    console.error('Get categories error:', error);
    throw error;
  }
};

const getProducts = async ({ category, page = 1, limit = 6 }) => {
  try {
    const skip = (page - 1) * limit;
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    const [items, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    return {
      items,
      total,
      page: Number(page),
      limit: Number(limit),
      hasMore: skip + items.length < total,
    };
  } catch (error) {
    console.error('Get products error:', error);
    throw error;
  }
};

module.exports = {
  ensureProductTable,
  getCategories,
  getProducts,
};
