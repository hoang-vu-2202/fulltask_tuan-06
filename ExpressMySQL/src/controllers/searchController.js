const { searchProducts } = require('../services/searchService');

/**
 * Search products controller
 * Handles product search requests with fuzzy matching and filters
 */
const searchProductsController = async (req, res) => {
    try {
        const {
            keyword = '',
            category = '',
            minPrice,
            maxPrice,
            onSale,
            sortBy = 'relevance',
            page = 1,
            limit = 12,
        } = req.query;

        // Parse numeric values
        const parsedMinPrice = minPrice ? parseFloat(minPrice) : 0;
        const parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : 999999999;
        const parsedOnSale = onSale === 'true' || onSale === true;

        const result = await searchProducts({
            keyword,
            category,
            minPrice: parsedMinPrice,
            maxPrice: parsedMaxPrice,
            onSale: parsedOnSale,
            sortBy,
            page,
            limit,
        });

        return res.status(200).json(result);
    } catch (error) {
        console.error('Search controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Không thể tìm kiếm sản phẩm. Vui lòng thử lại.',
        });
    }
};

module.exports = {
    searchProductsController,
};
