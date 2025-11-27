const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 150,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  views: {
    type: Number,
    default: 0,
    min: 0,
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  isOnSale: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // createdAt, updatedAt
});

// Text index cho fuzzy search
productSchema.index({ name: 'text', description: 'text' });

// Index cho các trường thường xuyên query
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isOnSale: 1 });
productSchema.index({ views: -1 });

const Product = mongoose.model('Product', productSchema);

// Sample products data
const sampleProducts = [
  {
    name: 'Tai nghe Bluetooth Pro',
    category: 'Công nghệ',
    price: 1299000,
    description: 'Tai nghe chống ồn chủ động, thời lượng pin 24h.',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=60',
    stock: 30,
    views: 156,
    discountPercent: 15,
    isOnSale: true,
  },
  {
    name: 'Laptop Ultrabook X12',
    category: 'Công nghệ',
    price: 25990000,
    description: 'Laptop mỏng nhẹ 1.1kg, CPU Gen 13, RAM 16GB.',
    imageUrl: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=60',
    stock: 12,
    views: 245,
    discountPercent: 10,
    isOnSale: true,
  },
  {
    name: 'Bàn phím cơ RGB',
    category: 'Công nghệ',
    price: 1899000,
    description: 'Switch Brown, 87 phím, hỗ trợ NKRO.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60',
    stock: 50,
    views: 189,
    discountPercent: 0,
    isOnSale: false,
  },
  {
    name: 'Áo khoác thể thao',
    category: 'Thời trang',
    price: 799000,
    description: 'Chất liệu chống nước, phù hợp dã ngoại.',
    imageUrl: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=60',
    stock: 40,
    views: 98,
    discountPercent: 20,
    isOnSale: true,
  },
  {
    name: 'Sneaker Street Style',
    category: 'Thời trang',
    price: 1599000,
    description: 'Đệm êm, form chuẩn châu Á.',
    imageUrl: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=800&q=60',
    stock: 60,
    views: 234,
    discountPercent: 25,
    isOnSale: true,
  },
  {
    name: 'Túi đeo chéo Canvas',
    category: 'Thời trang',
    price: 499000,
    description: 'Thiết kế tối giản, nhiều ngăn tiện lợi.',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=60',
    stock: 35,
    views: 67,
    discountPercent: 0,
    isOnSale: false,
  },
  {
    name: 'Sách "Deep Work"',
    category: 'Sách',
    price: 210000,
    description: 'Bí quyết tập trung sâu từ Cal Newport.',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60',
    stock: 80,
    views: 178,
    discountPercent: 5,
    isOnSale: true,
  },
  {
    name: 'Sách "Atomic Habits"',
    category: 'Sách',
    price: 195000,
    description: 'Xây dựng thói quen tốt mỗi ngày.',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=60',
    stock: 90,
    views: 203,
    discountPercent: 0,
    isOnSale: false,
  },
  {
    name: 'Đèn bàn Minimal',
    category: 'Trang trí',
    price: 620000,
    description: 'Ánh sáng vàng dịu, phù hợp phòng ngủ.',
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=60',
    stock: 25,
    views: 112,
    discountPercent: 30,
    isOnSale: true,
  },
  {
    name: 'Tranh canvas Abstract',
    category: 'Trang trí',
    price: 450000,
    description: 'Tạo điểm nhấn nghệ thuật cho phòng khách.',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60',
    stock: 18,
    views: 85,
    discountPercent: 0,
    isOnSale: false,
  },
];

module.exports = { Product, sampleProducts };
