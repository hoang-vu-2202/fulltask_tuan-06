import { useState, useEffect, useCallback } from 'react';
import {
    Input,
    Select,
    Slider,
    Switch,
    Card,
    Row,
    Col,
    Pagination,
    Typography,
    Tag,
    Empty,
    Spin,
    Space,
    Badge,
} from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { searchProductsApi, fetchCategoriesApi } from '../services/productApi';
import './ProductSearch.css';

const { Title, Text } = Typography;

const ProductSearch = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 12,
        total: 0,
    });

    // Search filters
    const [filters, setFilters] = useState({
        keyword: '',
        category: '',
        minPrice: 0,
        maxPrice: 30000000,
        onSale: false,
        sortBy: 'relevance',
    });

    // Debounced search
    const [searchTimeout, setSearchTimeout] = useState(null);

    // Load categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetchCategoriesApi();
                if (response?.success && response?.data) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Search products
    const searchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await searchProductsApi({
                keyword: filters.keyword,
                category: filters.category,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                onSale: filters.onSale,
                sortBy: filters.sortBy,
                page: pagination.current,
                limit: pagination.pageSize,
            });

            if (response?.success) {
                setProducts(response.items || []);
                setPagination((prev) => ({
                    ...prev,
                    total: response.pagination?.total || 0,
                }));
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    }, [filters, pagination.current, pagination.pageSize]);

    // Trigger search when filters or page change
    useEffect(() => {
        searchProducts();
    }, [searchProducts]);

    // Handle keyword change with debounce
    const handleKeywordChange = (e) => {
        const value = e.target.value;
        setFilters((prev) => ({ ...prev, keyword: value }));

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            setPagination((prev) => ({ ...prev, current: 1 }));
        }, 500);

        setSearchTimeout(timeout);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPagination((prev) => ({ ...prev, current: 1 }));
    };

    const handlePageChange = (page) => {
        setPagination((prev) => ({ ...prev, current: page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const calculateDiscountPrice = (price, discount) => {
        return price * (1 - discount / 100);
    };

    const sortOptions = [
        { value: 'relevance', label: 'Liên quan nhất' },
        { value: 'views', label: 'Xem nhiều nhất' },
        { value: 'price_asc', label: 'Giá tăng dần' },
        { value: 'price_desc', label: 'Giá giảm dần' },
        { value: 'newest', label: 'Mới nhất' },
    ];

    return (
        <div className="product-search-page">
            <div className="search-header">
                <Title level={2} className="page-title">
                    Tìm kiếm sản phẩm
                </Title>
            </div>

            {/* Search and Filters Section */}
            <Card className="filter-card" bordered={false}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Search Input */}
                    <div>
                        <Text strong>Từ khóa tìm kiếm</Text>
                        <Input
                            size="large"
                            placeholder="Nhập tên sản phẩm... (vd: laptop, tai nghe)"
                            prefix={<SearchOutlined />}
                            value={filters.keyword}
                            onChange={handleKeywordChange}
                            allowClear
                            className="search-input"
                        />
                    </div>

                    {/* Filters Row */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={6}>
                            <Text strong>Danh mục</Text>
                            <Select
                                size="large"
                                placeholder="Tất cả danh mục"
                                value={filters.category || undefined}
                                onChange={(value) => handleFilterChange('category', value)}
                                allowClear
                                style={{ width: '100%', marginTop: 8 }}
                                options={[
                                    { value: '', label: 'Tất cả' },
                                    ...categories.map((cat) => ({ value: cat, label: cat })),
                                ]}
                            />
                        </Col>

                        <Col xs={24} sm={12} md={6}>
                            <Text strong>Sắp xếp</Text>
                            <Select
                                size="large"
                                value={filters.sortBy}
                                onChange={(value) => handleFilterChange('sortBy', value)}
                                style={{ width: '100%', marginTop: 8 }}
                                options={sortOptions}
                            />
                        </Col>

                        <Col xs={24} sm={12} md={8}>
                            <Text strong>Khoảng giá (VNĐ)</Text>
                            <Slider
                                range
                                min={0}
                                max={30000000}
                                step={100000}
                                value={[filters.minPrice, filters.maxPrice]}
                                onChange={([min, max]) => {
                                    handleFilterChange('minPrice', min);
                                    handleFilterChange('maxPrice', max);
                                }}
                                tooltip={{
                                    formatter: (value) => formatPrice(value),
                                }}
                                style={{ marginTop: 16 }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                <Text type="secondary">{formatPrice(filters.minPrice)}</Text>
                                <Text type="secondary">{formatPrice(filters.maxPrice)}</Text>
                            </div>
                        </Col>

                        <Col xs={24} sm={12} md={4}>
                            <Text strong>Chỉ sản phẩm sale</Text>
                            <div style={{ marginTop: 16 }}>
                                <Switch
                                    checked={filters.onSale}
                                    onChange={(checked) => handleFilterChange('onSale', checked)}
                                    checkedChildren="ON"
                                    unCheckedChildren="OFF"
                                />
                            </div>
                        </Col>
                    </Row>
                </Space>
            </Card>

            {/* Results Section */}
            <div className="results-section">
                <div className="results-header">
                    <Space>
                        <FilterOutlined />
                        <Text strong>
                            {pagination.total} sản phẩm được tìm thấy
                        </Text>
                    </Space>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <Spin size="large" tip="Đang tìm kiếm..." />
                    </div>
                ) : products.length === 0 ? (
                    <Empty
                        description="Không tìm thấy sản phẩm nào"
                        style={{ margin: '60px 0' }}
                    />
                ) : (
                    <>
                        <Row gutter={[16, 16]}>
                            {products.map((product) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={product._id || product.id}>
                                    <Card
                                        hoverable
                                        className="product-card"
                                        cover={
                                            <div className="product-image-wrapper">
                                                <img
                                                    alt={product.name}
                                                    src={product.imageUrl}
                                                    className="product-image"
                                                />
                                                {product.isOnSale && (
                                                    <Badge.Ribbon text={`-${product.discountPercent}%`} color="red">
                                                        <div />
                                                    </Badge.Ribbon>
                                                )}
                                            </div>
                                        }
                                    >
                                        <div className="product-info">
                                            <Tag color="blue" className="category-tag">
                                                {product.category}
                                            </Tag>
                                            <Title level={5} ellipsis={{ rows: 2 }} className="product-name">
                                                {product.name}
                                            </Title>
                                            <Text type="secondary" ellipsis className="product-description">
                                                {product.description}
                                            </Text>

                                            <div className="product-meta">
                                                <Space size="small">
                                                    <Text type="secondary">👁️ {product.views} lượt xem</Text>
                                                </Space>
                                            </div>

                                            <div className="product-price">
                                                {product.isOnSale ? (
                                                    <>
                                                        <Text delete type="secondary" className="original-price">
                                                            {formatPrice(product.price)}
                                                        </Text>
                                                        <Text strong className="sale-price">
                                                            {formatPrice(
                                                                calculateDiscountPrice(product.price, product.discountPercent)
                                                            )}
                                                        </Text>
                                                    </>
                                                ) : (
                                                    <Text strong className="price">
                                                        {formatPrice(product.price)}
                                                    </Text>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <div className="pagination-container">
                            <Pagination
                                current={pagination.current}
                                pageSize={pagination.pageSize}
                                total={pagination.total}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                showTotal={(total) => `Tổng ${total} sản phẩm`}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductSearch;
