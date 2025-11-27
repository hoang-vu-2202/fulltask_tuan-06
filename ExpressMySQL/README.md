## Cài đặt & cấu hình
```bash
cd fulltask_03/ExpressMySQL
npm install
```

**Yêu cầu:**
- Node.js 14+
- MongoDB đang chạy (local hoặc cloud)

Tạo file `.env` (đã có ví dụ sẵn):
```
NODE_ENV=development
PORT=8080

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/fullstack_node

JWT_SECRET=my_jwt_secret
JWT_EXPIRES=1h
RESET_TOKEN_EXPIRES_MINUTES=15
```
> Cập nhật `MONGODB_URI` theo MongoDB server của bạn.
> - Local: `mongodb://localhost:27017/fullstack_node`
> - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/fullstack_node`

## Chạy dự án
```bash
npm run dev   # dùng nodemon
# hoặc
npm start     # chạy node thường
```

**Đảm bảo MongoDB đang chạy:**
- Windows: MongoDB service phải start
- Linux/Mac: `mongod` command hoặc service

Khi khởi động, ứng dụng sẽ:
1. Kết nối MongoDB
2. Tự tạo text index cho fuzzy search
3. Seed 10 sample products nếu database trống
4. Lắng nghe trên cổng 8080

Mở trình duyệt `http://localhost:8080/` để kiểm tra server đang chạy.

## Cấu trúc thư mục chính
```
ExpressMySQL
├── .env
| POST   | `/v1/api/register`      | Tạo tài khoản mới (hash bcrypt) |
| POST   | `/v1/api/login`         | Đăng nhập, trả về `access_token` JWT |
| POST   | `/v1/api/forgot-password` | Sinh token đặt lại mật khẩu (demo trả về token trong response) |
| POST   | `/v1/api/reset-password`  | Đặt lại mật khẩu bằng token hợp lệ |
| GET    | `/v1/api/account`       | Lấy thông tin tài khoản (cần header `Authorization: Bearer <token>`) |
| GET    | `/v1/api/categories`    | Lấy danh sách danh mục sản phẩm |
| GET    | `/v1/api/products`      | Lấy danh sách sản phẩm (có filter category và pagination) |
| **GET**    | **`/v1/api/search`**        | **Tìm kiếm sản phẩm nâng cao (Fuzzy Search)** |

### Ví dụ request body
**Register**
```json
{
  "name": "Nguyen Van A",
  "email": "vana@example.com",
  "password": "123456"
}
```

**Forgot Password**
```json
{
  "email": "vana@example.com"
}
```

**Reset Password**
```json
{
  "email": "vana@example.com",
  "token": "<token từ forgot-password>",
  "newPassword": "newSecret"
}
```

**Fuzzy Search** (Tìm kiếm sản phẩm)
```bash
# Tìm kiếm cơ bản
GET /v1/api/search?keyword=laptop

# Tìm kiếm với bộ lọc đầy đủ
GET /v1/api/search?keyword=tai+nghe&category=Công+nghệ&minPrice=500000&maxPrice=2000000&onSale=true&sortBy=views&page=1&limit=12
```

**Query Parameters cho /search:**
- `keyword`: Từ khóa tìm kiếm (fuzzy matching trên `name` và `description`)
- `category`: Lọc theo danh mục
- `minPrice`: Giá tối thiểu
- `maxPrice`: Giá tối đa
- `onSale`: Chỉ hiển sản phẩm sale (`true`/`false`)
- `sortBy`: Sắp xếp (`relevance`, `views`, `price_asc`, `price_desc`, `newest`)
- `page`: Trang hiện tại (default: 1)
- `limit`: Số item/trang (default: 12)
