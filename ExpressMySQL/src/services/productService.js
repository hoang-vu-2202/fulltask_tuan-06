const { pool } = require('../config/database');
const { createProductTableQuery, sampleProducts } = require('../models/productModel');

const ensureProductTable = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query(createProductTableQuery);
    const [countRows] = await connection.query('SELECT COUNT(*) as total FROM products');
    if (countRows[0].total === 0) {
      const insertPromises = sampleProducts.map((item) =>
        connection.query(
          'INSERT INTO products (name, description, price, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)',
          [item.name, item.description, item.price, item.category, item.image_url, item.stock],
        ),
      );
      await Promise.all(insertPromises);
      console.log('✅ Seeded sample products');
    }
  } finally {
    connection.release();
  }
};

const getCategories = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT DISTINCT category FROM products ORDER BY category');
    return rows.map((row) => row.category);
  } finally {
    connection.release();
  }
};

const getProducts = async ({ category, page = 1, limit = 6 }) => {
  const connection = await pool.getConnection();
  try {
    const offset = (page - 1) * limit;
    let whereClause = '';
    const params = [];
    if (category && category !== 'all') {
      whereClause = 'WHERE category = ?';
      params.push(category);
    }

    const [data] = await connection.query(
      `SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)],
    );

    const [countRows] = await connection.query(
      `SELECT COUNT(*) as total FROM products ${whereClause}`,
      params,
    );

    return {
      items: data,
      total: countRows[0].total,
      page: Number(page),
      limit: Number(limit),
      hasMore: offset + data.length < countRows[0].total,
    };
  } finally {
    connection.release();
  }
};

module.exports = {
  ensureProductTable,
  getCategories,
  getProducts,
};
