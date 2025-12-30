# 🌟 VolunteerHub - Nền tảng Quản lý Hoạt động Tình nguyện

## 📝 Giới thiệu

**VolunteerHub** là nền tảng web toàn diện hỗ trợ quản lý hoạt động tình nguyện, cho phép người dùng tạo hồ sơ cá nhân, đăng ký và tham gia các sự kiện tình nguyện, cũng như tương tác với cộng đồng qua các bài viết, bình luận và lượt thích - tương tự như một mạng xã hội chuyên biệt cho hoạt động thiện nguyện.

## 🎯 Chức năng chính

### 🔐 Xác thực & Quản lý Tài khoản
- **Đăng ký tài khoản** với xác thực email tự động
- **Đăng nhập bảo mật** với JWT (Access Token + Refresh Token)
- **Phân quyền người dùng**: 
  - `USER` (Tình nguyện viên)
  - `EVENT_MANAGER` (Quản lý sự kiện)
  - `ADMIN` (Quản trị viên hệ thống)
- **Refresh token** tự động bằng HttpOnly Cookie (bảo mật cao)

### 👤 Quản lý Hồ sơ Cá nhân
- Tạo và cập nhật thông tin cá nhân (tên, username, avatar, bio)
- Xem hồ sơ công khai của người dùng khác
- Lịch sử hoạt động và thống kê tham gia sự kiện

### 🎉 Quản lý Sự kiện
- **Tạo sự kiện mới** (EVENT_MANAGER)
- **Chỉnh sửa và xóa sự kiện** của riêng mình
- **Phê duyệt sự kiện** (ADMIN)
- **Tìm kiếm và lọc sự kiện** với phân trang
- **Đăng ký tham gia sự kiện** (USER)
- **Phê duyệt/Từ chối đăng ký** (EVENT_MANAGER)
- **Hủy đăng ký** sự kiện

### 📱 Tương tác Cộng đồng (Social Feed)
- **Đăng bài viết** về sự kiện (Facebook-like interface)
- **Like/Unlike** bài viết và bình luận với Optimistic UI Updates
- **Bình luận** vào bài viết
- **Chỉnh sửa và xóa** bài viết/bình luận của riêng mình
- **Real-time updates** cho trải nghiệm mượt mà

### 🛡️ Quản trị Hệ thống
- **Khóa/Mở khóa người dùng** (ADMIN)
- **Phê duyệt sự kiện** (ADMIN)
- **Xuất báo cáo** danh sách tình nguyện viên theo sự kiện (CSV/JSON)
- **Dashboard thống kê** với biểu đồ trực quan

### 🩸 Quản lý Hiến máu (Blood Donation)
- Đăng ký hiến máu
- Theo dõi lịch sử hiến máu
- Thống kê theo nhóm máu
- Quản lý trạng thái đăng ký

## 🏗️ Kiến trúc Hệ thống

```
VolunteerHub/
├── backend/          # Spring Boot API
│   ├── REST API      # Các thao tác ghi (Create, Update, Delete)
│   └── GraphQL API   # Truy vấn đọc dữ liệu (Read)
└── frontend/         # React + Vite SPA
    ├── UI Components # Giao diện người dùng
    ├── Services      # API integration
    └── Contexts      # State management
```

## 🛠️ Công nghệ Sử dụng

### Backend
- **Java 21** - Ngôn ngữ lập trình
- **Spring Boot 3.5.6** - Framework chính
  - Spring MVC (REST API)
  - Spring Security (Xác thực & phân quyền)
  - Spring Data JPA (ORM)
  - Spring Validation (Kiểm tra dữ liệu đầu vào)
  - Spring GraphQL (API đọc dữ liệu)
  - Spring Mail (Gửi email xác thực)
- **PostgreSQL** - Cơ sở dữ liệu quan hệ
- **Redis** - Cache và session storage
- **JWT (Nimbus JOSE + JWT)** - Token-based authentication
- **Lombok** - Giảm boilerplate code
- **Gradle** - Build tool

### Frontend
- **React 19.2** - UI Library
- **Vite** - Build tool & Development server
- **React Router DOM** - Client-side routing
- **Apollo Client** - GraphQL client
- **Axios** - HTTP client cho REST API
- **TailwindCSS** - Utility-first CSS framework
- **Recharts** - Thư viện biểu đồ
- **Lucide React** - Icons
- **Vitest** - Unit testing framework

### DevOps & Infrastructure
- **Docker Compose** - Container orchestration
  - PostgreSQL database
  - Redis cache
  - Object Storage (MinIO/S3-compatible)

## 📋 Yêu cầu Hệ thống

### Phần mềm cần cài đặt
- **Java Development Kit (JDK) 21** hoặc cao hơn
- **Node.js 18+** và **npm** hoặc **yarn**
- **PostgreSQL 14+**
- **Redis 7+**
- **Docker & Docker Compose** (khuyến nghị)
- **Git**

### Cấu hình tối thiểu
- **RAM**: 4GB (khuyến nghị 8GB)
- **Disk**: 2GB trống
- **OS**: Windows 10/11, macOS, hoặc Linux

## 🚀 Cài đặt và Chạy Dự án

### 1. Clone Repository

```bash
git clone <repository-url>
cd Volunteer-Web-main
```

### 2. Cấu hình Backend

#### a. Khởi động Database và Redis với Docker

```bash
cd backend/project_setup/database
docker-compose up -d

cd ../redis
docker-compose up -d

cd ../object_store
docker-compose up -d
```

#### b. Tạo file `.env` trong thư mục `backend/`

```env
# JWT Configuration
JWT_SECRET=your-secret-key-here-minimum-256-bits

# Mail Configuration
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

> **Lưu ý**: Để lấy App Password cho Gmail, truy cập [Google Account Security](https://myaccount.google.com/security) và tạo App Password.

#### c. Chạy Backend

```bash
cd backend
./gradlew bootRun
```

Hoặc trên Windows:

```bash
.\gradlew.bat bootRun
```

Backend sẽ chạy tại: `http://localhost:8080`

### 3. Cấu hình Frontend

#### a. Cài đặt Dependencies

```bash
cd frontend
npm install
```

#### b. Chạy Development Server

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## 📡 API Documentation

### REST API Endpoints

**Base URL**: `http://localhost:8080`

#### Authentication
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| POST | `/api/auth/signup` | Đăng ký tài khoản | Public |
| GET | `/api/auth/verify-email?token=...` | Xác thực email | Public |
| POST | `/api/auth/login` | Đăng nhập | Public |
| POST | `/api/auth/refresh` | Refresh access token | Public |

#### User Profiles
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| POST | `/api/user-profiles` | Tạo hồ sơ | USER |
| PUT | `/api/user-profiles` | Cập nhật hồ sơ | USER |

#### Events
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| POST | `/api/events` | Tạo sự kiện | EVENT_MANAGER |
| PUT | `/api/events` | Cập nhật sự kiện | EVENT_MANAGER |
| DELETE | `/api/events/{eventId}` | Xóa sự kiện | EVENT_MANAGER |
| POST | `/api/events/{eventId}/approve` | Phê duyệt sự kiện | ADMIN |

#### Event Registrations
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| POST | `/api/events/{eventId}/registrations` | Đăng ký sự kiện | USER |
| DELETE | `/api/events/{eventId}/registrations` | Hủy đăng ký | USER |
| POST | `/api/event-registrations/{id}/approve` | Phê duyệt đăng ký | EVENT_MANAGER |
| POST | `/api/event-registrations/{id}/reject` | Từ chối đăng ký | EVENT_MANAGER |

#### Posts & Comments
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| POST | `/api/posts` | Tạo bài viết | USER |
| PUT | `/api/posts` | Sửa bài viết | USER |
| DELETE | `/api/posts/{postId}` | Xóa bài viết | USER |
| POST | `/api/comments` | Tạo bình luận | USER |
| PUT | `/api/comments` | Sửa bình luận | USER |
| DELETE | `/api/comments/{commentId}` | Xóa bình luận | USER |

#### Likes
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| POST | `/api/likes` | Thích | USER |
| DELETE | `/api/likes` | Bỏ thích | USER |

#### Admin & Exports
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| POST | `/api/users/{userId}/ban` | Khóa người dùng | ADMIN |
| DELETE | `/api/users/{userId}/ban` | Mở khóa | ADMIN |
| POST | `/api/exports/event-volunteers` | Xuất danh sách CSV/JSON | ADMIN |

### GraphQL API

**Endpoint**: `POST http://localhost:8080/graphql`

#### Queries chính:
- `getUserProfile(userId: ID!)` - Lấy hồ sơ người dùng
- `getEvent(eventId: ID!)` - Lấy chi tiết sự kiện
- `getPost(postId: ID!)` - Lấy chi tiết bài viết
- `findEvents(page: Int, size: Int, filter: JSON)` - Tìm kiếm sự kiện có phân trang
- `findPosts(page: Int, size: Int)` - Danh sách bài viết có phân trang

Chi tiết đầy đủ xem tại: [volunteerhub_graphql_api.md](backend/volunteerhub_graphql_api.md)

## 🗂️ Cấu trúc Thư mục

### Backend Structure
```
backend/
├── src/main/java/com/volunteerhub/
│   ├── authentication/          # Xác thực & đăng ký
│   │   ├── controller/         # REST controllers
│   │   ├── service/            # Business logic
│   │   ├── dto/                # Data Transfer Objects
│   │   └── model/              # Entities
│   ├── community/              # Sự kiện, bài viết, bình luận
│   │   ├── controller/
│   │   │   ├── rest/           # REST endpoints
│   │   │   └── graphql/        # GraphQL resolvers
│   │   ├── service/
│   │   ├── repository/
│   │   └── model/
│   ├── export_data/            # Export CSV/JSON
│   ├── security/               # JWT & Security config
│   └── config/                 # Spring configuration
├── src/main/resources/
│   ├── application.yml         # App configuration
│   └── graphql/schema.graphqls # GraphQL schema
└── project_setup/
    ├── database/               # PostgreSQL Docker
    ├── redis/                  # Redis Docker
    └── object_store/           # MinIO Docker
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/             # React components
│   │   ├── auth/              # Authentication UI
│   │   ├── event/             # Event components
│   │   ├── post/              # Post & Comment UI
│   │   ├── dashboard/         # Admin dashboard
│   │   └── ui/                # Reusable UI components
│   ├── pages/                 # Page components
│   │   ├── volunteer/         # Volunteer views
│   │   ├── manager/           # Event manager views
│   │   └── admin/             # Admin views
│   ├── services/              # API integration
│   │   ├── authService.js
│   │   ├── eventService.js
│   │   ├── postService.js
│   │   └── userProfileService.js
│   ├── contexts/              # React Context (State)
│   │   ├── AuthContext.jsx
│   │   ├── EventContext.jsx
│   │   └── NotificationContext.jsx
│   ├── routes/                # Route guards
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utilities & constants
│   └── styles/                # CSS files
└── public/
    └── sw.js                  # Service Worker (PWA)
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
./gradlew test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

Mở Vitest UI:
```bash
npm run test:ui
```

## 📦 Build Production

### Backend

```bash
cd backend
./gradlew bootJar
```

File JAR sẽ được tạo tại: `backend/build/libs/VolunteerHubProject-0.0.1-SNAPSHOT.jar`

Chạy production:
```bash
java -jar backend/build/libs/VolunteerHubProject-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
cd frontend
npm run build
```

File build sẽ được tạo tại: `frontend/dist/`

Preview production build:
```bash
npm run preview
```

## 🔒 Bảo mật

### Các biện pháp bảo mật đã triển khai:
- ✅ **JWT Authentication** với Access Token (50 phút) và Refresh Token (24 giờ)
- ✅ **HttpOnly Cookies** cho Refresh Token (chống XSS)
- ✅ **SameSite=Strict** cookie policy (chống CSRF)
- ✅ **Password hashing** với BCrypt
- ✅ **Email verification** bắt buộc
- ✅ **Role-based Access Control** (RBAC)
- ✅ **Input Validation** với Spring Validation
- ✅ **SQL Injection protection** với JPA/Hibernate
- ✅ **CORS configuration** cho production

### Khuyến nghị Production:
1. Sử dụng HTTPS cho tất cả requests
2. Đặt JWT_SECRET phức tạp (>256 bits)
3. Cấu hình rate limiting
4. Enable CSRF protection cho production
5. Sử dụng environment variables cho secrets
6. Backup database định kỳ
7. Monitor logs và security events

## 🌐 Environment Variables

### Backend (.env)
```env
JWT_SECRET=your-super-secret-key-at-least-256-bits
MAIL_USERNAME=your-gmail@gmail.com
MAIL_PASSWORD=your-gmail-app-password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8080
VITE_GRAPHQL_URL=http://localhost:8080/graphql
```

## 📊 Database Schema

### Các bảng chính:
- `users` - Thông tin tài khoản và xác thực
- `user_profiles` - Hồ sơ người dùng
- `events` - Sự kiện tình nguyện
- `event_registrations` - Đăng ký tham gia sự kiện
- `posts` - Bài viết về sự kiện
- `comments` - Bình luận
- `likes` - Lượt thích (polymorphic)
- `blood_donations` - Đăng ký hiến máu

## 🤝 Đóng góp

Dự án này được phát triển cho mục đích học tập và ứng tuyển công việc. Nếu bạn muốn đóng góp:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phát triển cho mục đích học tập và demo.

## 👥 Team & Contact

- **Developer**: [Tên của bạn]
- **Email**: [Email của bạn]
- **GitHub**: [GitHub profile của bạn]

## 🙏 Lời cảm ơn

Cảm ơn các thư viện và framework open-source đã hỗ trợ dự án này:
- Spring Framework Team
- React Team
- PostgreSQL Community
- Redis Community
- Tất cả contributors của các dependencies

---

**Made with ❤️ for the community**
