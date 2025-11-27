const { Product } = require('../models/productModel');

/**
 * Advanced product search with fuzzy matching (MongoDB text search) and multiple filters
 * @param {Object} params - Search parameters
 * @param {string} params.keyword - Search keyword (fuzzy match on name and description)
 * @param {string} params.category - Filter by category
 * @param {number} params.minPrice - Minimum price filter
 * @param {number} params.maxPrice - Maximum price filter
 * @param {boolean} params.onSale - Filter only sale items
 * @param {string} params.sortBy - Sort order: 'views', 'price_asc', 'price_desc', 'newest', 'relevance'
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 12)
 * @returns {Promise<Object>} Search results with pagination
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
        const skip = (page - 1) * limit;
        let query = {};
        let sort = {};

        // Text search với MongoDB (fuzzy matching)
        if (keyword && keyword.trim()) {
            query.$text = { $search: keyword.trim() };
            // Thêm relevance score vào kết quả
            query = { ...query };
        }

        // Category filter
        if (category && category !== 'all' && category.trim()) {
            query.category = category;
        }

        // Price range filter
        if (minPrice > 0 || maxPrice < 999999999) {
            query.price = {};
            if (minPrice > 0) query.price.$gte = minPrice;
            if (maxPrice < 999999999) query.price.$lte = maxPrice;
        }

        // On sale filter
        if (onSale === true || onSale === 'true') {
            query.isOnSale = true;
        }

        // Determine sort order
        switch (sortBy) {
            case 'views':
                sort = { views: -1 };
                break;
            case 'price_asc':
                sort = { price: 1 };
                break;
            case 'price_desc':
                sort = { price: -1 };
                break;
            case 'newest':
                sort = { createdAt: -1 };
                break;
            case 'relevance':
            default:
                if (keyword && keyword.trim()) {
                    // Sort by text score (relevance) then views
                    sort = { score: { $meta: 'textScore' }, views: -1 };
                } else {
                    sort = { views: -1 };
                }
                break;
        }

        // Execute query
        let itemsQuery = Product.find(query);

        // Add text score projection if searching by keyword
        if (keyword && keyword.trim()) {
            itemsQuery = itemsQuery.select({ score: { $meta: 'textScore' } });
        }

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
        console.error('Search error:', error);
        throw error;
    }
};

module.exports = {
    searchProducts,
};
