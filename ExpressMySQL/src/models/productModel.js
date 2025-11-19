const createProductTableQuery = `
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  category VARCHAR(80) NOT NULL,
  image_url VARCHAR(255),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

const sampleProducts = [
  {
    name: 'Tai nghe Bluetooth Pro',
    category: 'Công nghệ',
    price: 1299000,
    description: 'Tai nghe chống ồn chủ động, thời lượng pin 24h.',
    image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=60',
    stock: 30,
  },
  {
    name: 'Laptop Ultrabook X12',
    category: 'Công nghệ',
    price: 25990000,
    description: 'Laptop mỏng nhẹ 1.1kg, CPU Gen 13, RAM 16GB.',
    image_url: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=60',
    stock: 12,
  },
  {
    name: 'Bàn phím cơ RGB',
    category: 'Công nghệ',
    price: 1899000,
    description: 'Switch Brown, 87 phím, hỗ trợ NKRO.',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60',
    stock: 50,
  },
  {
    name: 'Áo khoác thể thao',
    category: 'Thời trang',
    price: 799000,
    description: 'Chất liệu chống nước, phù hợp dã ngoại.',
    image_url: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=60',
    stock: 40,
  },
  {
    name: 'Sneaker Street Style',
    category: 'Thời trang',
    price: 1599000,
    description: 'Đệm êm, form chuẩn châu Á.',
    image_url: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=800&q=60',
    stock: 60,
  },
  {
    name: 'Túi đeo chéo Canvas',
    category: 'Thời trang',
    price: 499000,
    description: 'Thiết kế tối giản, nhiều ngăn tiện lợi.',
    image_url: 'https://images.unsplash.com/photo-1542296612-61e9b2cf6121?auto=format&fit=crop&w=800&q=60',
    stock: 35,
  },
  {
    name: 'Sách "Deep Work"',
    category: 'Sách',
    price: 210000,
    description: 'Bí quyết tập trung sâu từ Cal Newport.',
    image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60',
    stock: 80,
  },
  {
    name: 'Sách "Atomic Habits"',
    category: 'Sách',
    price: 195000,
    description: 'Xây dựng thói quen tốt mỗi ngày.',
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=60',
    stock: 90,
  },
  {
    name: 'Đèn bàn Minimal',
    category: 'Trang trí',
    price: 620000,
    description: 'Ánh sáng vàng dịu, phù hợp phòng ngủ.',
    image_url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=60',
    stock: 25,
  },
  {
    name: 'Tranh canvas Abstract',
    category: 'Trang trí',
    price: 450000,
    description: 'Tạo điểm nhấn nghệ thuật cho phòng khách.',
    image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60',
    stock: 18,
  },
];

module.exports = {
  createProductTableQuery,
  sampleProducts,
};
