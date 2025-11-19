## Cài đặt & cấu hình
```bash
cd fulltask_03/ExpressMySQL
npm install
```
Tạo file `.env` (đã có ví dụ sẵn):
```
NODE_ENV=development
PORT=8080
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fullstack_node
JWT_SECRET=my_jwt_secret
JWT_EXPIRES=1h
RESET_TOKEN_EXPIRES_MINUTES=15
```
> Cập nhật `DB_USER/DB_PASSWORD` theo máy của bạn.

## Chạy dự án
```bash
npm run dev   # dùng nodemon
# hoặc
npm start     # chạy node thường
```
Khi khởi động, ứng dụng sẽ:
1. Kết nối MySQL thông qua `mysql2/promise`
2. Tự tạo bảng `users` nếu chưa có (`src/models/userModel.js`)
3. Lắng nghe trên cổng 8080 (hoặc PORT trong `.env`)

Mở trình duyệt `http://localhost:8080/` để kiểm tra server đang chạy.

## Cấu trúc thư mục chính
```
ExpressMySQL
├── .env
├── README.md
├── package.json
├── src
│   ├── config
│   │   └── database.js        # Tạo pool MySQL + test kết nối
│   ├── controllers
│   │   └── authController.js  # Nhận request, trả response
│   ├── middleware
│   │   └── auth.js            # Kiểm tra JWT (Bearer token)
│   ├── models
│   │   └── userModel.js       # Câu lệnh tạo bảng users
│   ├── routes
│   │   └── api.js             # Định nghĩa các endpoint /v1/api
│   ├── services
│   │   └── authService.js     # Business logic Register/Login/Forgot
│   └── server.js              # Điểm khởi động ứng dụng
```

## API Endpoints
| Method | Endpoint                | Mô tả |
|--------|-------------------------|-------|
| GET    | `/`                     | Kiểm tra server, liệt kê endpoints quan trọng |
| POST   | `/v1/api/register`      | Tạo tài khoản mới (hash bcrypt) |
| POST   | `/v1/api/login`         | Đăng nhập, trả về `access_token` JWT |
| POST   | `/v1/api/forgot-password` | Sinh token đặt lại mật khẩu (demo trả về token trong response) |
| POST   | `/v1/api/reset-password`  | Đặt lại mật khẩu bằng token hợp lệ |
| GET    | `/v1/api/account`       | Lấy thông tin tài khoản (cần header `Authorization: Bearer <token>`) |

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
