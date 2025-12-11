# 🗺️ Routes & Paths Mapping - VolunteerHub

## 📋 Mục Lục
- [Public Routes](#public-routes)
- [Protected Routes](#protected-routes)
- [Role-Based Routes](#role-based-routes)
- [Redirect Flow](#redirect-flow)
- [API Endpoints](#api-endpoints)

---

## 🌐 Public Routes
> Không yêu cầu authentication, ai cũng có thể truy cập

| Path | Component | Mô tả |
|------|-----------|-------|
| `/` | `LandingPage` | Trang chủ với Hero, About, Blood Donation, Contact |
| `/auth/callback` | `OAuthCallback` | OAuth callback handler |

---

## 🔒 Protected Routes
> Yêu cầu đăng nhập, áp dụng cho tất cả vai trò

| Path | Component | Mô tả | Áp dụng cho |
|------|-----------|-------|-------------|
| `/dashboard` | `Dashboard` | Trang dashboard chính | Tất cả |
| `/eventPosts/:eventId` | `EventPosts` | Chi tiết sự kiện với posts/comments | Tất cả |
| `/events` | `EventsVolunteer` | Danh sách sự kiện | Tất cả |
| `/history` | `History` | Lịch sử tham gia | Tất cả |
| `/notification` | `Notification` | Thông báo | Tất cả |

---

## 👥 Role-Based Routes

### 🟢 USER (Volunteer)
> Role: `USER` hoặc `VOLUNTEER`

**Default Redirect:** `/dashboard`

| Path | Component | Mô tả |
|------|-----------|-------|
| `/dashboard` | `Dashboard` | Dashboard với thống kê cá nhân |
| `/events` | `EventsVolunteer` | Danh sách sự kiện có thể đăng ký |
| `/eventPosts/:eventId` | `EventPosts` | Chi tiết sự kiện, tạo bài viết |
| `/history` | `History` | Lịch sử tham gia sự kiện |
| `/notification` | `Notification` | Thông báo từ hệ thống |

**Quyền:**
- ✅ Xem danh sách sự kiện
- ✅ Đăng ký tham gia sự kiện
- ✅ Tạo post, comment, like
- ✅ Xem lịch sử cá nhân
- ❌ Không tạo sự kiện mới
- ❌ Không quản lý người dùng

---

### 🔵 EVENT_MANAGER (Manager)
> Role: `EVENT_MANAGER`

**Default Redirect:** `/manager/events`

| Path | Component | Mô tả | Allowed Roles |
|------|-----------|-------|---------------|
| `/manager/events` | `EventManagement` | Quản lý sự kiện của mình | `EVENT_MANAGER` |
| `/manager/approve` | `VolunteerApproval` | Phê duyệt volunteer đăng ký | `EVENT_MANAGER` |
| `/manager/volunteerList` | `VolunteerList` | Danh sách volunteer trong sự kiện | `EVENT_MANAGER` |
| `/manager/volunteerCompleted` | `VolunteerCompleted` | Volunteer đã hoàn thành | `EVENT_MANAGER` |
| `/admin/blood-donations` | `BloodDonationManagement` | Quản lý hiến máu | `EVENT_MANAGER`, `ADMIN` |

**Quyền:**
- ✅ Tạo sự kiện mới (cần admin phê duyệt)
- ✅ Chỉnh sửa sự kiện của mình
- ✅ Xem danh sách volunteer đăng ký
- ✅ Phê duyệt/từ chối volunteer
- ✅ Đánh dấu volunteer hoàn thành
- ✅ Quản lý hiến máu
- ❌ Không chỉnh sửa sự kiện người khác
- ❌ Không quản lý user/manager khác

---

### 🟣 ADMIN (Administrator)
> Role: `ADMIN`

**Default Redirect:** `/admin/users`

| Path | Component | Mô tả | Allowed Roles |
|------|-----------|-------|---------------|
| `/admin/users` | `UserManagement` | Quản lý Manager | `ADMIN` |
| `/admin/volunteers` | `VolunteerList` | Quản lý Volunteer | `ADMIN` |
| `/admin/events` | `EventApproval` | Phê duyệt/quản lý sự kiện | `ADMIN` |
| `/admin/export` | `ExportData` | Xuất dữ liệu | `ADMIN` |
| `/admin/blood-donations` | `BloodDonationManagement` | Quản lý hiến máu | `ADMIN`, `EVENT_MANAGER` |

**Quyền:**
- ✅ Quản lý tất cả user (promote/demote role)
- ✅ Phê duyệt/từ chối sự kiện
- ✅ Chỉnh sửa/xóa bất kỳ sự kiện nào
- ✅ Xem tất cả volunteer
- ✅ Xuất báo cáo/dữ liệu
- ✅ Quản lý hiến máu
- ✅ Toàn quyền hệ thống

---

## 🔄 Redirect Flow

### Login Success Redirect
```javascript
// AuthModal.jsx - redirectByRole()
switch(role) {
  case 'ADMIN':
    navigate('/admin/users');
    break;
  case 'EVENT_MANAGER':
    navigate('/manager/events');
    break;
  case 'USER':
  default:
    navigate('/dashboard');
    break;
}
```

### Unauthorized Access
```javascript
// App.jsx - RoleRoute component
if (!user) {
  return <Navigate to="/" replace />
}

if (!allowedRoles.includes(userRole)) {
  return <Navigate to="/dashboard" replace />
}
```

### Header Navigation
```javascript
// Header.jsx - "Quản lý dự án" button
if (user?.role === 'ADMIN') {
  navigate('/admin/users');
} else if (user?.role === 'EVENT_MANAGER') {
  navigate('/manager/events');
} else {
  navigate('/dashboard');
}
```

---

## 🌐 API Endpoints

### REST API (Authentication)
**Base URL:** `http://localhost:8080/api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | ❌ | Đăng nhập, trả về JWT |
| POST | `/auth/signup` | ❌ | Đăng ký tài khoản mới (role = USER) |
| POST | `/auth/refresh` | 🍪 Cookie | Refresh access token |
| PUT | `/user-profile` | ✅ Bearer | Cập nhật profile |

### GraphQL API
**Endpoint:** `http://localhost:8080/graphql`  
**GraphiQL:** `http://localhost:8080/graphiql`

#### Queries
| Query | Description | Auth |
|-------|-------------|------|
| `findEvents` | Danh sách sự kiện (phân trang) | ✅ |
| `getEvent` | Chi tiết sự kiện với nested posts/comments | ✅ |
| `getUserProfile` | Profile người dùng | ✅ |
| `findPostsByEvent` | Danh sách posts của sự kiện | ✅ |

#### Mutations
| Mutation | Description | Auth | Role |
|----------|-------------|------|------|
| `createEvent` | Tạo sự kiện mới | ✅ | Manager, Admin |
| `updateEvent` | Cập nhật sự kiện | ✅ | Manager (own), Admin (all) |
| `deleteEvent` | Xóa sự kiện | ✅ | Manager (own), Admin (all) |
| `registerToEvent` | Đăng ký tham gia sự kiện | ✅ | User, Manager, Admin |
| `createPost` | Tạo bài viết | ✅ | All |
| `editPost` | Sửa bài viết | ✅ | Owner, Admin |
| `deletePost` | Xóa bài viết | ✅ | Owner, Admin |
| `like` | Like post/comment | ✅ | All |
| `unlike` | Unlike post/comment | ✅ | All |
| `createComment` | Tạo comment | ✅ | All |
| `editComment` | Sửa comment | ✅ | Owner, Admin |
| `deleteComment` | Xóa comment | ✅ | Owner, Admin |

---

## 📊 Route Summary by Role

### USER (8 routes)
```
/                    (public)
/dashboard           (protected)
/events              (protected)
/eventPosts/:id      (protected)
/history             (protected)
/notification        (protected)
/auth/callback       (public)
```

### EVENT_MANAGER (13 routes)
```
All USER routes +
/manager/events              (role-based)
/manager/approve             (role-based)
/manager/volunteerList       (role-based)
/manager/volunteerCompleted  (role-based)
/admin/blood-donations       (role-based, shared with ADMIN)
```

### ADMIN (18 routes)
```
All USER routes +
/admin/users                 (role-based)
/admin/volunteers            (role-based)
/admin/events                (role-based)
/admin/export                (role-based)
/admin/blood-donations       (role-based)
```

---

## 🔐 Authentication Flow

### 1. Login Process
```
User Input (email, password, role selection)
    ↓
AuthModal.jsx → authService.login()
    ↓
REST API: POST /api/auth/login
    ↓
Backend validates & returns JWT
    ↓
Token stored in localStorage: 'vh_access_token'
    ↓
Decode JWT to get user_id & roles[]
    ↓
GraphQL: getUserProfile(userId)
    ↓
Merge profile + role → user object
    ↓
AuthContext.setUser()
    ↓
redirectByRole() → Navigate to appropriate page
```

### 2. Token Management
```javascript
// Request Interceptor (axiosClient.js)
config.headers.Authorization = `Bearer ${token}`;

// Response Interceptor
if (error.response?.status === 401) {
  // Token expired
  localStorage.removeItem('vh_access_token');
  window.location.href = '/';
}
```

### 3. Role Check
```javascript
// App.jsx - RoleRoute
const userRole = user.role?.toUpperCase(); // USER, EVENT_MANAGER, ADMIN
const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase());

if (!normalizedAllowedRoles.includes(userRole)) {
  return <Navigate to="/dashboard" replace />
}
```

---

## 🎨 Sidebar Menu by Role

### USER
```
🏠 Dashboard       → /dashboard
📅 Sự kiện         → /events
📜 Lịch sử         → /history
🔔 Thông báo       → /notification
```

### EVENT_MANAGER
```
🏠 Dashboard               → /dashboard
📅 Sự kiện của tôi         → /manager/events
✅ Phê duyệt tình nguyện   → /manager/approve
👥 Danh sách tình nguyện   → /manager/volunteerList
✔️ Đã hoàn thành           → /manager/volunteerCompleted
🩸 Quản lý hiến máu        → /admin/blood-donations
```

### ADMIN
```
🏠 Dashboard           → /dashboard
🛠️ Quản lý sự kiện     → /admin/events
👥 Quản lý Manager     → /admin/users
👤 Quản lý Volunteer   → /admin/volunteers
🩸 Quản lý hiến máu     → /admin/blood-donations
📊 Xuất dữ liệu        → /admin/export
```

---

## 🧪 Testing Routes

### Test với các tài khoản mẫu
```javascript
// USER
Email: minh@volunteer.com
Password: 123456
Expected Redirect: /dashboard

// EVENT_MANAGER
Email: manager@charity.com
Password: 123456
Expected Redirect: /manager/events

// ADMIN
Email: admin@charity.com
Password: 123456
Expected Redirect: /admin/users
```

### Test Unauthorized Access
```bash
# Try accessing admin route as USER
# Should redirect to /dashboard
http://localhost:5173/admin/users

# Try accessing manager route as USER
# Should redirect to /dashboard
http://localhost:5173/manager/events
```

---

## 📝 Notes

1. **Role Format:** Tất cả role đều dùng UPPERCASE (`USER`, `EVENT_MANAGER`, `ADMIN`)
2. **Token Storage:** Chỉ lưu `accessToken` trong localStorage, không lưu user object
3. **RefreshToken:** Được lưu trong HttpOnly cookie, tự động gửi kèm request
4. **ID Types:**
   - `userId`: UUID (string)
   - `eventId`, `postId`, `commentId`: Snowflake ID (string)
5. **GraphQL vs REST:**
   - REST: Chỉ dùng cho authentication (`/api/auth/*`)
   - GraphQL: Tất cả data operations (`/graphql`)

---

## 🔗 Related Files

- **Routes Definition:** [src/App.jsx](frontend/src/App.jsx)
- **Auth Modal:** [src/components/AuthModal.jsx](frontend/src/components/AuthModal.jsx)
- **Auth Context:** [src/contexts/AuthContext.jsx](frontend/src/contexts/AuthContext.jsx)
- **Sidebar:** [src/components/common/Sidebar.jsx](frontend/src/components/common/Sidebar.jsx)
- **API Client (REST):** [src/api/axiosClient.js](frontend/src/api/axiosClient.js)
- **API Client (GraphQL):** [src/api/graphqlClient.js](frontend/src/api/graphqlClient.js)

---

**Last Updated:** December 11, 2025  
**Version:** 1.0.0
