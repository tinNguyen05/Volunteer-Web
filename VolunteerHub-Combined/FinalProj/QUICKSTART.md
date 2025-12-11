# ⚡ VolunteerHub - Quick Start Guide

## 🚀 Khởi Động Nhanh (Windows)

```powershell
# 1. Khởi động database (nếu dùng Docker)
cd backend/project_setup/database
docker-compose up -d

cd ../redis
docker-compose up -d

# 2. Về thư mục gốc và chạy
cd ../../../
.\start.ps1
```

## 🚀 Khởi Động Nhanh (Linux/Mac)

```bash
# 1. Khởi động database (nếu dùng Docker)
cd backend/project_setup/database
docker-compose up -d

cd ../redis
docker-compose up -d

# 2. Về thư mục gốc và chạy
cd ../../../
chmod +x start.sh
./start.sh
```

## 📦 Yêu Cầu Hệ Thống

- ✅ Java 21+
- ✅ Node.js 18+
- ✅ PostgreSQL (port 5431)
- ✅ Redis (port 6379)

## 🌐 URLs Quan Trọng

| Service | URL | Mô tả |
|---------|-----|-------|
| Frontend | http://localhost:5173 | React App |
| Backend | http://localhost:8080 | Spring Boot API |
| GraphQL | http://localhost:8080/graphql | GraphQL Endpoint |
| Database | localhost:5431 | PostgreSQL |
| Cache | localhost:6379 | Redis |

## 🔐 Environment Variables

Tạo file `.env` trong thư mục gốc:

```env
JWT_SECRET=your_secret_key_minimum_32_characters_long
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

## 📁 Cấu Trúc Project

```
VolunteerHub/
├── backend/              # Spring Boot + GraphQL
│   ├── src/
│   ├── build.gradle
│   └── project_setup/   # Docker configs
│
├── frontend/            # React + Vite
│   ├── src/
│   └── package.json
│
├── start.ps1           # Windows startup
├── start.sh            # Linux/Mac startup
└── README.md           # Full documentation
```

## 🛠️ Commands Hữu Ích

### Backend (từ thư mục backend/)
```bash
# Chạy dev
.\gradlew.bat bootRun

# Build
.\gradlew.bat build

# Test
.\gradlew.bat test
```

### Frontend (từ thư mục frontend/)
```bash
# Chạy dev
npm run dev

# Build
npm run build

# Preview build
npm run preview
```

## 🐛 Common Issues

### PostgreSQL không kết nối được
```bash
# Kiểm tra PostgreSQL đang chạy
# Windows
Get-Service -Name postgresql*

# Linux/Mac
sudo systemctl status postgresql
```

### Redis không kết nối được
```bash
# Kiểm tra Redis đang chạy
redis-cli ping
# Kết quả mong đợi: PONG
```

### Port đã được sử dụng
```bash
# Tìm process đang dùng port
# Windows
netstat -ano | findstr :8080
netstat -ano | findstr :5173

# Linux/Mac
lsof -i :8080
lsof -i :5173
```

## 📚 Documentation Chi Tiết

- **Full README:** [README.md](README.md)
- **Backend API:** [backend/volunteerhub_graphql_api.md](backend/volunteerhub_graphql_api.md)
- **Auth Guide:** [frontend/AUTH_DOCUMENTATION.md](frontend/AUTH_DOCUMENTATION.md)
- **Blood Donation:** [frontend/BLOOD_DONATION_GUIDE.md](frontend/BLOOD_DONATION_GUIDE.md)

## 🎯 Next Steps

1. ✅ Đọc [README.md](README.md) để hiểu chi tiết về project
2. ✅ Khám phá backend API qua GraphQL endpoint
3. ✅ Test các tính năng authentication
4. ✅ Xem code examples trong frontend/

---

**Happy Coding! 🚀**
