const { Product } = require('../models/productModel');

/**
 * Tìm kiếm sản phẩm nâng cao với khớp mờ (MongoDB text search) và nhiều bộ lọc
 * @param {Object} params - Các tham số tìm kiếm
 * @param {string} params.keyword - Từ khóa tìm kiếm (khớp mờ trên tên và mô tả)
 * @param {string} params.category - Lọc theo danh mục
 * @param {number} params.minPrice - Giá thấp nhất
 * @param {number} params.maxPrice - Giá cao nhất
 * @param {boolean} params.onSale - Chỉ lọc sản phẩm đang giảm giá
 * @param {string} params.sortBy - Sắp xếp theo: 'views', 'price_asc', 'price_desc', 'newest', 'relevance'
 * @param {number} params.page - Số trang (mặc định: 1)
 * @param {number} params.limit - Số lượng mỗi trang (mặc định: 12)
 * @returns {Promise<Object>} Kết quả tìm kiếm kèm phân trang
 */
const searchProducts = async ({
    keyword = '',
    category = '',
    minPrice = 0,
    maxPrice = 999999999,
    onSale = false,
    sortBy = 'relevance',
    page = 1,
    limit = 12,
}) => {
    try {
        // Tính toán số lượng bản ghi cần bỏ qua (để phân trang)
        const skip = (page - 1) * limit;
        let query = {};
        let sort = {};

        // 1. Tìm kiếm văn bản với MongoDB (Dùng Regex để tìm gần đúng - Fuzzy Search)
        if (keyword && keyword.trim()) {
            // Tìm sản phẩm có Tên HOẶC Mô tả chứa từ khóa (không phân biệt hoa thường 'i')
            // Ví dụ: gõ "lap" sẽ tìm thấy "Laptop"
            const regex = new RegExp(keyword.trim(), 'i');
            query.$or = [
                { name: regex },
                { description: regex }
            ];
        }

        // 2. Lọc theo Danh mục
        if (category && category !== 'all' && category.trim()) {
            query.category = category;
        }

        // 3. Lọc theo Khoảng giá
        if (minPrice > 0 || maxPrice < 999999999) {
            query.price = {};
            if (minPrice > 0) query.price.$gte = minPrice; // Lớn hơn hoặc bằng minPrice
            if (maxPrice < 999999999) query.price.$lte = maxPrice; // Nhỏ hơn hoặc bằng maxPrice
        }

        // 4. Lọc sản phẩm đang giảm giá (Flash Sale)
        if (onSale === true || onSale === 'true') {
            query.isOnSale = true;
        }

        // 5. Xác định cách sắp xếp
        switch (sortBy) {
            case 'views':
                sort = { views: -1 }; // Xem nhiều nhất
                break;
            case 'price_asc':
                sort = { price: 1 }; // Giá tăng dần
                break;
            case 'price_desc':
                sort = { price: -1 }; // Giá giảm dần
                break;
            case 'newest':
                sort = { createdAt: -1 }; // Mới nhất
                break;
            case 'relevance':
            default:
                // Vì dùng Regex nên không có "điểm liên quan" (textScore), ta mặc định sort theo view
                sort = { views: -1 };
                break;
        }

        // Tạo câu truy vấn cơ bản
        let itemsQuery = Product.find(query);

        // Nếu có tìm kiếm từ khóa, cần lấy thêm điểm phù hợp (score) để sắp xếp
        // (Đã bỏ vì chuyển sang Regex)

        // Thực thi song song: Lấy dữ liệu sản phẩm VÀ đếm tổng số kết quả
        const [items, total] = await Promise.all([
            itemsQuery.sort(sort).skip(skip).limit(Number(limit)),
            Product.countDocuments(query),
        ]);

        return {
            success: true,
            items,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
                hasMore: skip + items.length < total,
            },
            filters: {
                keyword,
                category,
                minPrice,
                maxPrice,
                onSale,
                sortBy,
            },
        };
    } catch (error) {
        console.error('Lỗi tìm kiếm:', error);
        throw error;
    }
};

module.exports = {
    searchProducts,
};
