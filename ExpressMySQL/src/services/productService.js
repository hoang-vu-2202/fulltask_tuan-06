const { Product, sampleProducts } = require('../models/productModel');

// 1. TỰ ĐỘNG TẠO DỮ LIỆU MẪU (SEEDING)
// Hàm này chạy khi server khởi động. Nếu database trống -> Tự thêm sản phẩm mẫu.
const ensureProductTable = async () => {
  try {
    // Đếm xem có bao nhiêu sản phẩm
    const count = await Product.countDocuments();

    if (count === 0) {
      // Nếu chưa có gì (count == 0) -> Thêm một loạt sản phẩm mẫu vào
      await Product.insertMany(sampleProducts);
      console.log('✅ Đã khởi tạo dữ liệu mẫu cho bảng Products');
    }
  } catch (error) {
    console.error('Lỗi khởi tạo sản phẩm:', error);
    throw error;
  }
};

// 2. LẤY DANH SÁCH DANH MỤC
// Dùng để hiển thị dropdown "Chọn danh mục" bên Frontend
const getCategories = async () => {
  try {
    // distinct: Lấy các giá trị KHÁC NHAU của trường 'category'
    // Ví dụ: DB có 10 cái Laptop, 5 cái Điện thoại -> Chỉ trả về ['Laptop', 'Điện thoại']
    const categories = await Product.distinct('category');
    return categories.sort(); // Sắp xếp A-Z
  } catch (error) {
    console.error('Lỗi lấy danh mục:', error);
    throw error;
  }
};

// 3. LẤY SẢN PHẨM & PHÂN TRANG (Quan trọng)
const getProducts = async ({ category, page = 1, limit = 6 }) => {
  try {
    // Công thức tính vị trí bắt đầu (Skip)
    // Trang 1: skip = (1-1)*6 = 0 -> Lấy từ đầu
    // Trang 2: skip = (2-1)*6 = 6 -> Bỏ qua 6 cái đầu, lấy tiếp
    const skip = (page - 1) * limit;

    // Tạo bộ lọc (query filter)
    const query = {};
    if (category && category !== 'all') {
      query.category = category; // Nếu có chọn danh mục thì lọc theo danh mục đó
    }

    // Chạy song song 2 lệnh (Promise.all) cho nhanh:
    // 1. Tìm sản phẩm theo điều kiện (query), sắp xếp mới nhất, cắt bớt (skip/limit)
    // 2. Đếm tổng số sản phẩm tìm được (để tính số trang)
    const [items, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 }) // -1 là giảm dần (mới nhất lên đầu)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    return {
      items,      // Danh sách sản phẩm của trang này
      total,      // Tổng số sản phẩm (dùng để hiển thị "Tìm thấy X kết quả")
      page: Number(page),
      limit: Number(limit),
      hasMore: skip + items.length < total, // Check xem còn trang sau không
    };
  } catch (error) {
    console.error('Lỗi lấy danh sách sản phẩm:', error);
    throw error;
  }
};

module.exports = {
  ensureProductTable,
  getCategories,
  getProducts,
};
