// Import 2 hàm xử lý logic từ "nhà bếp" (Service)
// Controller chỉ như người bồi bàn: Nhận món -> Gọi bếp -> Bưng ra
const { getCategories, getProducts } = require('../services/productService');

// API 1: Lấy danh sách danh mục (VD: Laptop, Tai nghe...)
const getCategoryList = async (req, res) => {
  try {
    // Gọi Service để lấy dữ liệu (await là đợi trả lời)
    const categories = await getCategories();

    // Thành công: Trả về mã 200 (OK) và cục data
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    // Có lỗi: Ghi log và báo lỗi 500 (Server Error)
    console.error('get categories error:', error);
    return res.status(500).json({ success: false, message: 'Không thể lấy danh mục' });
  }
};

// API 2: Lấy danh sách sản phẩm (có tìm kiếm + phân trang)
const getProductList = async (req, res) => {
  try {
    // req.query: Lấy tham số từ URL (VD: ?page=2&limit=10&category=Laptop)
    // Nếu không có thì lấy mặc định: page 1, 6 món, all category
    const { category = 'all', page = 1, limit = 6 } = req.query;

    // Gửi yêu cầu sang Service để lọc và tìm kiếm
    const data = await getProducts({ category, page, limit });

    // Trả kết quả về cho FE
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
