# VolunteerHub - Full Stack Application

## 📋 Tổng Quan

VolunteerHub là nền tảng quản lý tình nguyện viên với các tính năng:
- Landing page công khai với đăng ký thành viên, hiến máu
- Hệ thống authentication và authorization (Role-based: Admin, Manager, Volunteer)
- Dashboard quản lý sự kiện, đăng ký tình nguyện viên
- Event Wall với post/comment/like
- Thông báo realtime
- GraphQL API

## 🏗️ Kiến Trúc

```
VolunteerHub/
├── backend/           # Spring Boot 3.5.6 + GraphQL
│   ├── src/
│   │   └── main/
│   │       ├── java/com/volunteerhub/
│   │       └── resources/
│   └── build.gradle
│
├── frontend/          # React 19 + Vite + TailwindCSS
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── contexts/
│   └── package.json
│
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 3.5.6
- **Java:** 21
- **API:** GraphQL + REST
- **Database:** PostgreSQL
- **Cache:** Redis
- **Authentication:** JWT (nimbus-jose-jwt)

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** TailwindCSS 4.1
- **Router:** React Router v6
- **HTTP Client:** GraphQL Client
## 🚀 Yêu Cầu Hệ Thống

- **Java:** JDK 21 hoặc cao hơn
- **Node.js:** v18 hoặc cao hơn
- **PostgreSQL:** 13 hoặc cao hơn
- **Redis:** 6 hoặc cao hơn

## 📦 Cài Đặt & Chạy

### 1. Chuẩn Bị Database & Redis

```bash
# Khởi động PostgreSQL và Redis bằng Docker
cd backend/project_setup/database
docker-compose up -d

cd ../redis
docker-compose up -d
```

Hoặc cài đặt thủ công:
- PostgreSQL: Port 5431, Database: `volunteerhub`, User: `admin`, Password: `admin123`
- Redis: Port 6379, Host: `localhost`

### 2. Cấu Hình Environment Variables

Tạo file `.env` trong thư mục gốc hoặc set biến môi trường:

```bash
# Backend
JWT_SECRET=your_jwt_secret_key_here
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

### 3. Chạy Backend

```bash
cd backend

# Windows
.\gradlew.bat bootRun

# Linux/Mac
./gradlew bootRun
```

Backend sẽ chạy tại: `http://localhost:8080`

### 4. Chạy Frontend

```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

### 5. Truy Cập Ứng Dụng

Mở trình duyệt và truy cập: `http://localhost:5173`

## 🔌 API Endpoints

### REST API
- Base URL: `http://localhost:8080/api`

### GraphQL
- Endpoint: `http://localhost:8080/graphql`
- GraphiQL: `http://localhost:8080/graphiql` (nếu được enable)

## 📖 Documentation

- **Backend API:** Xem file `backend/volunteerhub_graphql_api.md`
- **Frontend Auth:** Xem file `frontend/AUTH_DOCUMENTATION.md`
- **Blood Donation:** Xem file `frontend/BLOOD_DONATION_GUIDE.md`

## 🏗️ Build Production

### Backend
```bash
cd backend
.\gradlew.bat build
# Output: build/libs/VolunteerHubProject-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
# Output: dist/
```

## 🔐 Roles & Permissions

- **VOLUNTEER:** Xem sự kiện, đăng ký tham gia, tương tác với posts
- **MANAGER:** Tạo/quản lý sự kiện, duyệt đăng ký tình nguyện viên
- **ADMIN:** Quản lý users, duyệt sự kiện, full access

## 🛠️ Công Nghệ Sử Dụng

### Backend Stack
- Spring Boot 3.5.6
- Spring Data JPA
- GraphQL Java
- PostgreSQL + Redis
- JWT Authentication
- Spring Mail

### Frontend Stack
- React 19.2
- Vite
- React Router v6
- TailwindCSS 4.1
- Lucide React Icons

## 📝 Scripts Hữu Ích

### Backend
```bash
# Build project
.\gradlew.bat build

# Run tests
.\gradlew.bat test

# Clean build
.\gradlew.bat clean build
```

### Frontend
```bash
# Dev server
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

## 🐛 Troubleshooting

### Database Connection Error
- Kiểm tra PostgreSQL đang chạy trên port 5431
- Verify credentials trong `application.yml`

### Redis Connection Error
- Kiểm tra Redis đang chạy trên port 6379

### Frontend không kết nối được Backend
- Kiểm tra CORS settings trong backend
- Verify API URL trong frontend config

## 📚 Tài Liệu Tham Khảo

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/)
- [GraphQL Java](https://www.graphql-java.com/)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)

## 👥 Contributors

Your team information here

## 📄 License

This project is licensed under the MIT License
