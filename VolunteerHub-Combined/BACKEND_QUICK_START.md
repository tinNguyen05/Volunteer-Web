# 🚀 Backend Quick Start Guide

## Bắt Đầu Nhanh

### 1. Cài Đặt Dependencies

```bash
cd backend
npm install
```

### 2. Cấu Hình MongoDB

**Trên Windows**:
```bash
# Tải MongoDB từ: https://www.mongodb.com/try/download/community
# Cài đặt và chạy MongoDB Service
mongod
```

**Trên Mac**:
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Trên Linux**:
```bash
sudo apt-get install mongodb
sudo systemctl start mongod
```

### 3. Tạo File .env

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/volunteer_hub
JWT_SECRET=your_secret_key_at_least_32_characters_long_123456789
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 4. Khởi Động Server

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Server sẽ chạy trên: `http://localhost:5000`

---

## 📋 Cấu Trúc Backend

```
backend/
├── index.js                 # Main entry point
├── package.json
├── .env                     # Configuration
└── src/
    ├── api/                 # Routes
    │   ├── authRoutes.js
    │   ├── eventRoutes.js
    │   ├── bloodDonationRoutes.js
    │   └── membershipRoutes.js
    ├── config/              # Configurations
    │   └── db.js
    ├── controllers/         # Business logic
    │   ├── authController.js
    │   ├── eventController.js
    │   ├── bloodDonationController.js
    │   └── membershipController.js
    ├── middlewares/         # Express middlewares
    │   ├── auth.js
    │   └── validation.js
    ├── models/              # Mongoose schemas
    │   ├── User.js
    │   ├── Event.js
    │   ├── Registration.js
    │   ├── BloodDonation.js
    │   └── Membership.js
    ├── services/            # Business services
    └── utils/               # Helper functions
        ├── jwt.js
        └── response.js
```

---

## 🔌 API Endpoints Chính

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user
- `PUT /api/auth/profile` - Cập nhật hồ sơ

### Events
- `GET /api/events/all` - Danh sách sự kiện
- `GET /api/events/:id` - Chi tiết sự kiện
- `POST /api/events/create` - Tạo sự kiện (Manager/Admin)
- `POST /api/events/register` - Đăng ký sự kiện (Volunteer)
- `POST /api/events/:id/approve` - Phê duyệt (Manager/Admin)

### Blood Donation
- `POST /api/blood-donation/register` - Đăng ký hiến máu
- `GET /api/blood-donation/statistics` - Thống kê
- `GET /api/blood-donation/all` - Danh sách (Admin/Manager)
- `PUT /api/blood-donation/:id/status` - Cập nhật trạng thái

### Membership
- `POST /api/membership/register` - Đăng ký thành viên
- `GET /api/membership/statistics` - Thống kê
- `GET /api/membership/all` - Danh sách (Admin)
- `PUT /api/membership/:id/approve` - Phê duyệt

---

## 📊 Database Schemas

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  bloodType: Enum,
  role: Enum (volunteer, manager, admin),
  avatar: String,
  bio: String,
  isActive: Boolean,
  verified: Boolean,
  eventsCompleted: Number,
  hoursContributed: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Event Schema
```javascript
{
  title: String,
  description: String,
  category: Enum,
  date: Date,
  startTime: String,
  endTime: String,
  location: String,
  image: String,
  capacity: Number,
  registeredVolunteers: [ObjectId],
  createdBy: ObjectId (ref: User),
  status: Enum,
  isApproved: Boolean,
  skills: [String],
  requirements: [String],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Authentication

### JWT Token Structure
```
Header: { alg: "HS256", typ: "JWT" }
Payload: { id: "user_id", iat: timestamp, exp: timestamp }
Signature: HMACSHA256(header.payload, secret)
```

### Token Usage
```javascript
// Frontend
const token = localStorage.getItem('token')
fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### Roles and Permissions
- **Volunteer**: Đăng ký sự kiện, xem lịch sử
- **Manager**: Tạo sự kiện, phê duyệt tình nguyện viên
- **Admin**: Quản lý toàn bộ hệ thống

---

## 🎯 Toast Messages

Backend trả về response với `toastType`:

```javascript
{
  "success": true,
  "message": "Thành công",
  "toastType": "success",  // success, error, warning, info
  "data": { ... }
}
```

Frontend tự động hiển thị toast dựa trên `toastType`.

---

## ⚡ Thường Gặp

### Q: API không kết nối được?
**A**: 
- Kiểm tra MongoDB có chạy không: `mongod`
- Kiểm tra PORT trong .env
- Kiểm tra CORS_ORIGIN

### Q: Token expired?
**A**: User cần đăng nhập lại để lấy token mới

### Q: Database error?
**A**: 
- Kiểm tra MongoDB URI
- Kiểm tra MongoDB có running
- Kiểm tra Network

### Q: CORS error?
**A**: Cập nhật `CLIENT_URL` trong .env

---

## 🧪 Test Endpoints

### Dùng cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Events
curl -X GET http://localhost:5000/api/events/all
```

### Dùng Postman

1. Import Collection từ `/docs/postman-collection.json`
2. Set environment variable `baseUrl = http://localhost:5000`
3. Set `token` variable sau khi login
4. Test các endpoints

---

## 🔗 Kết Nối Frontend

### Update Frontend API URL

```javascript
// src/api/client.js
const API_BASE_URL = 'http://localhost:5000/api'
```

### Sử Dụng API Client

```javascript
import apiClient from '@/api/client'
import { useToast } from '@/components/Toast'

export default function Login() {
  const { showToast } = useToast()

  const handleLogin = async (email, password) => {
    try {
      const result = await apiClient.login(email, password)
      showToast(result.message, result.toastType)
    } catch (error) {
      showToast(error.message, 'error')
    }
  }
}
```

---

## 📞 Cần Giúp Đỡ?

- Xem đầy đủ tại: `BACKEND_API_GUIDE.md`
- Kiểm tra logs của server
- Test endpoint bằng Postman hoặc cURL

---

**Happy Coding! 🎉**
