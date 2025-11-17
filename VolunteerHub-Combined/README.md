# VolunteerHub - Combined Project

Đây là phiên bản hợp nhất của VolunteerProject (trang landing công khai) và VolunteerHub-main (dashboard riêng tư).

## 🎯 Kiến Trúc Dự Án

### Luồng Ứng Dụng

```
┌─────────────────────────────────────────────────────────────┐
│ Landing Page (/)                                             │
│ - Hero Section                                              │
│ - Membership Form                                           │
│ - Projects                                                  │
│ - Blood Donation                                            │
│ - Auth Modal (Đăng nhập / Đăng ký)                         │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ Đăng nhập/Đăng ký thành công
               │
┌──────────────▼──────────────────────────────────────────────┐
│ Dashboard (/dashboard)                                      │
│ - Protected Route (yêu cầu đăng nhập)                      │
│ - Dựa trên Role:                                           │
│   * volunteer: EventsVolunteer, History, Notification      │
│   * manager: EventManagement, VolunteerApproval, List      │
│   * admin: UserManagement, EventApproval                   │
└──────────────────────────────────────────────────────────────┘
```

## 🚀 Cấu Trúc Thư Mục

```
VolunteerHub-Combined/
├── frontend/
│   ├── src/
│   │   ├── App.jsx (Main router component)
│   │   ├── main.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx (Combined auth context)
│   │   ├── pages/
│   │   │   ├── Hero.jsx
│   │   │   ├── MembershipForm.jsx
│   │   │   ├── BloodDonation.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── volunteer/
│   │   │   ├── manager/
│   │   │   ├── admin/
│   │   │   └── notfound/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── dashboard/
│   │   │   ├── post/
│   │   │   └── common/
│   │   ├── assets/
│   │   │   ├── styles/
│   │   │   └── images/
│   │   ├── api/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── backend/ (backend config)
```

## 🔐 Authentication Flow

### AuthContext (`contexts/AuthContext.jsx`)

Quản lý trạng thái authentication toàn bộ ứng dụng:

```javascript
{
  user: {
    id: number,
    name: string,
    email: string,
    role: 'volunteer' | 'manager' | 'admin'
  },
  isAuthOpen: boolean,
  authMode: 'login' | 'signup',
  login(userObj): void,
  logout(): void,
  openAuth(mode): void,
  closeAuth(): void,
  switchMode(mode): void
}
```

### Routes & Role Protection

#### Public Routes
- `/` - Landing page
- `/login` - Login page (redirect nếu đã login)
- `/register` - Register page (redirect nếu đã login)

#### Protected Routes (yêu cầu login)
- `/dashboard` - Main dashboard
- `/eventPosts` - Event posts
- `/events` - Events list
- `/history` - History
- `/notification` - Notifications

#### Manager Routes (role === 'manager')
- `/manager/events` - Event management
- `/manager/approve` - Volunteer approval
- `/manager/volunteerList` - Volunteer list
- `/manager/volunteerCompleted` - Completed volunteers

#### Admin Routes (role === 'admin')
- `/admin/users` - User management
- `/admin/events` - Event approval

## 🎛️ Component Structure

### Header
- Hiển thị navigation khi chưa đăng nhập
- Nút Login/Sign Up
- Mobile responsive

### AuthModal
- Modal đăng nhập/đăng ký
- Chọn role (volunteer, manager)
- Form validation

### Landing Page Sections
1. **Hero** - Welcome section
2. **Membership Form** - Đăng ký thành viên
3. **Projects** - Danh sách dự án
4. **Blood Donation** - Thông tin hiến máu
5. **Footer** - Contact & social links

## 🔧 Installation & Setup

```bash
# Cài dependencies
cd frontend
npm install

# Development
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

## 📝 Environment & Data Storage

- **User Data**: Lưu trong `localStorage` (vh_user)
- **State Management**: React Context API
- **Styling**: Tailwind CSS + Custom CSS
- **API Ready**: Folder `api/` sẵn sàng để kết nối backend

## 🎨 Styling

### CSS Framework
- Tailwind CSS
- Custom CSS modules
- Color scheme defined in `ColorScheme.css`

### Key Style Files
- `header_new.css` - Header styling
- `Auth.css` - Authentication modal
- `login_register.css` - Auth pages
- `ProfessionalLayout.css` - Layout utilities
- `animations.css` - Animations

## 🔄 User Flow Example

### New User (Signup as Volunteer)
1. Access `/` (Landing page)
2. Click "Sign Up" → Opens AuthModal
3. Select Role: "Volunteer"
4. Fill form & submit
5. Redirects to `/dashboard`
6. See volunteer-specific pages

### Returning User (Login as Manager)
1. Access `/` (Landing page)
2. Click "Login" → Opens login form
3. Select Role: "Manager"
4. Enter credentials
5. Redirects to `/dashboard`
6. Access to `/manager/*` routes

## 🔗 Data Persistence

User data persists across sessions via localStorage:
```javascript
// Auto-saved on login
localStorage.setItem('vh_user', JSON.stringify(user));

// Auto-loaded on app mount
const user = JSON.parse(localStorage.getItem('vh_user'));
```

## 📱 Responsive Design

- Mobile-first approach
- Tailwind breakpoints
- Mobile menu in Header
- Responsive layouts

## 🚧 Next Steps

1. **Backend Integration**
   - Replace mock auth with API calls
   - Connect to database
   - Implement real authentication

2. **API Integration**
   - Update `api/` folder with actual endpoints
   - Implement data fetching
   - Add error handling

3. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests

4. **Deployment**
   - Build optimization
   - Environment variables
   - CI/CD pipeline

## 📚 Key Features

✅ Landing page dengan multiple sections
✅ Authentication modal (signup/login)
✅ Role-based access control
✅ Protected routes
✅ Persistent user sessions
✅ Responsive design
✅ Role-specific dashboards
✅ Clean component structure

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

Project license information here.
