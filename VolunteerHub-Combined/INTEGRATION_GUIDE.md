# HƯỚNG DẪN HỢP NHẤT VÀ SỬ DỤNG

## 📋 Tóm Tắt Những Gì Đã Được Hợp Nhất

### 1. **Cấu Trúc Dự Án**
- **VolunteerProject** (Landing Page) → Base structure
- **VolunteerHub-main** (Dashboard) → Các trang, routes, components
- Kết quả: **VolunteerHub-Combined** → Unified application

### 2. **Các Thành Phần Được Kết Hợp**

#### Pages (Pages được hợp nhất):
- ✅ Landing Pages (Hero, Membership, Blood Donation, Projects)
- ✅ Auth Pages (Login, Register)
- ✅ Volunteer Pages (Events, History, Notification)
- ✅ Manager Pages (Event Management, Approval, Lists)
- ✅ Admin Pages (User Management, Event Approval)

#### Components (Components được hợp nhất):
- ✅ Header (Landing header với auth buttons)
- ✅ AuthModal (Modal login/signup)
- ✅ Dashboard
- ✅ Sidebar
- ✅ Event Posts & Comments
- ✅ Common components (Footer, etc.)

#### Contexts:
- ✅ AuthContext (Unified authentication context)

#### Assets:
- ✅ Styles (CSS từ cả 2 project)
- ✅ Images (Public images)

---

## 🎯 Luồng Ứng Dụng Chi Tiết

### Scenario 1: New User (Chưa đăng nhập)

```
[1] User truy cập http://localhost:5173/
    ↓
[2] Thấy Landing Page:
    - Hero section
    - Membership form
    - Projects
    - Blood donation
    - Footer
    ↓
[3] Click "Sign Up" button
    ↓
[4] AuthModal mở → Chọn Role (Volunteer/Manager)
    ↓
[5] Fill form:
    - Email
    - Password
    - Confirm Password
    - Agree Terms
    ↓
[6] Click "SIGN UP"
    ↓
[7] User object tạo & lưu vào localStorage
    ↓
[8] Redirect đến /dashboard
    ↓
[9] Dashboard component render dựa trên role
```

### Scenario 2: Existing User (Đã đăng nhập)

```
[1] Truy cập http://localhost:5173/
    ↓
[2] AuthContext check localStorage
    ↓
[3] Nếu user tồn tại:
    - Header hiển thị logout button
    - Không hiển thị login/signup buttons
    ↓
[4] Người dùng navigate các routes dựa trên role
```

### Scenario 3: Logout

```
[1] User click "Logout" button
    ↓
[2] AuthContext.logout() được gọi
    ↓
[3] User state = null
    ↓
[4] localStorage cleared
    ↓
[5] Redirect đến "/" (Landing page)
```

---

## 🔐 Authentication Details

### Login/Register Flow

```javascript
// User submits form
const userObj = {
  id: Date.now(),
  name: email.split('@')[0],  // "john" from "john@example.com"
  email: email,
  role: selectedRole          // 'volunteer', 'manager', or 'admin'
};

// Save to auth context
login(userObj);

// Auto-saved to localStorage as:
// localStorage.vh_user = JSON.stringify(userObj)

// Redirect to dashboard
navigate('/dashboard');
```

### Role-Based Access Control

```javascript
// ProtectedRoute - requires ANY authenticated user
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// RoleRoute - requires specific role
<RoleRoute allowedRoles={['manager']}>
  <EventManagement />
</RoleRoute>

// If user doesn't have role:
// → Redirect to /dashboard
```

---

## 📁 Project Structure (Detailed)

```
VolunteerHub-Combined/
├── README.md (this file)
├── INTEGRATION_GUIDE.md (this guide)
├── backend/
│   ├── src/
│   ├── package.json
│   └── index.js
│
└── frontend/
    ├── package.json (includes react-router-dom)
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    │
    ├── src/
    │   ├── App.jsx ⭐ MAIN ROUTER
    │   ├── main.jsx
    │   │
    │   ├── contexts/
    │   │   └── AuthContext.jsx ⭐ UNIFIED AUTH
    │   │
    │   ├── pages/
    │   │   ├── Hero.jsx (Landing)
    │   │   ├── MembershipForm.jsx (Landing)
    │   │   ├── BloodDonation.jsx (Landing)
    │   │   ├── Projects.jsx (Landing)
    │   │   ├── auth/
    │   │   │   ├── Login.jsx ⭐ LOGIN PAGE
    │   │   │   └── Register.jsx ⭐ REGISTER PAGE
    │   │   ├── volunteer/
    │   │   │   ├── EventsVolunteer.jsx
    │   │   │   ├── History.jsx
    │   │   │   └── Notification.jsx
    │   │   ├── manager/
    │   │   │   ├── EventManagement.jsx
    │   │   │   ├── VolunteerApproval.jsx
    │   │   │   ├── VolunteerList.jsx
    │   │   │   └── VolunteerCompleted.jsx
    │   │   ├── admin/
    │   │   │   ├── UserManagement.jsx
    │   │   │   └── EventApproval.jsx
    │   │   └── notfound/
    │   │       └── NotFound.jsx
    │   │
    │   ├── components/
    │   │   ├── Header.jsx ⭐ MAIN HEADER
    │   │   ├── AuthModal.jsx ⭐ LOGIN/SIGNUP MODAL
    │   │   ├── Footer.jsx
    │   │   ├── common/
    │   │   │   ├── Sidebar.jsx
    │   │   │   └── Footer.jsx
    │   │   ├── dashboard/
    │   │   │   └── Dashboard.jsx
    │   │   └── post/
    │   │       ├── EventPosts.jsx
    │   │       ├── Post.jsx
    │   │       ├── CommentForm.jsx
    │   │       └── NewPostForm.jsx
    │   │
    │   ├── assets/
    │   │   ├── styles/
    │   │   │   ├── ColorScheme.css
    │   │   │   ├── ProfessionalLayout.css
    │   │   │   ├── animations.css
    │   │   │   ├── Auth.css
    │   │   │   ├── header_new.css
    │   │   │   ├── Hero.css
    │   │   │   ├── BloodDonation.css
    │   │   │   ├── MembershipForm.css
    │   │   │   ├── events.css
    │   │   │   ├── user-list.css
    │   │   │   └── login_register.css
    │   │   └── images/
    │   │       └── (placeholder images)
    │   │
    │   ├── api/
    │   │   ├── authApi.js
    │   │   ├── axiosClient.js
    │   │   ├── dashboardApi.js
    │   │   ├── eventApi.js
    │   │   └── userApi.js
    │   │
    │   ├── services/
    │   │   ├── authService.js
    │   │   ├── notificationService.js
    │   │   ├── pushService.js
    │   │   └── exportService.js
    │   │
    │   ├── contexts/
    │   │   ├── AuthContext.jsx
    │   │   ├── EventContext.jsx
    │   │   └── NotificationContext.jsx
    │   │
    │   └── utils/
    │       ├── constants.js
    │       ├── formatDate.js
    │       ├── roles.js
    │       └── validate.js
    │
    └── public/
        ├── index.html
        ├── manifest.json
        └── robots.txt
```

---

## 🚀 Getting Started

### Installation

```bash
# 1. Navigate to project
cd VolunteerHub-Combined/frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# → http://localhost:5173
```

### Test Login Credentials

Since we're using mock authentication (localStorage):

**Volunteer User:**
```
Email: volunteer@example.com
Password: any password (not validated)
Role: Volunteer
```

**Manager User:**
```
Email: manager@example.com
Password: any password
Role: Manager
```

**Admin User:**
```
Email: admin@example.com
Password: any password
Role: Admin
```

---

## 🔄 Key Features

### 1. **Landing Page (Public)**
- Access: Everyone (no login required)
- URL: `/`
- Includes:
  - Hero section
  - Membership registration form
  - Project showcase
  - Blood donation info
  - Footer with links
  - Auth modal for login/signup

### 2. **Authentication**
- Modal-based on landing page
- Supports Signup/Login toggle
- Role selection during signup
- Data persists in localStorage

### 3. **Dashboard (Protected)**
- Access: Logged-in users only
- URL: `/dashboard`
- Role-specific content

### 4. **Volunteer Area**
- Access: Users with role = 'volunteer'
- Pages:
  - `/events` - Browse events
  - `/history` - Volunteering history
  - `/notification` - Notifications
  - `/eventPosts` - Event posts & comments

### 5. **Manager Area**
- Access: Users with role = 'manager'
- Pages:
  - `/manager/events` - Manage events
  - `/manager/approve` - Approve volunteers
  - `/manager/volunteerList` - Volunteer list
  - `/manager/volunteerCompleted` - Completed volunteers

### 6. **Admin Area**
- Access: Users with role = 'admin'
- Pages:
  - `/admin/users` - User management
  - `/admin/events` - Event approval

---

## 🔗 Integration Points with Backend

Ready to connect to backend - No changes needed to structure:

```javascript
// 1. Update API endpoints in api/ folder
// Example: authApi.js
export const loginUser = async (email, password, role) => {
  const response = await axiosClient.post('/auth/login', {
    email, password, role
  });
  return response.data;
};

// 2. Use in AuthContext instead of localStorage mock
const handleLogin = async (credentials) => {
  const user = await loginUser(credentials);
  setUser(user);
  localStorage.setItem('vh_user', JSON.stringify(user));
};

// 3. Backend returns user object with same structure:
{
  id: string/number,
  name: string,
  email: string,
  role: 'volunteer' | 'manager' | 'admin',
  token?: string // optional JWT
}
```

---

## 📊 State Management

### Global State (AuthContext)

```javascript
// Available everywhere via useAuth()
{
  user: User | null,           // Current user
  setUser: (user) => void,     // Set user
  login: (user) => void,       // Login & save
  logout: () => void,          // Logout & clear
  isAuthOpen: boolean,         // Is auth modal open
  authMode: 'login' | 'signup', // Auth form mode
  openAuth: (mode) => void,    // Open auth modal
  closeAuth: () => void,       // Close auth modal
  switchMode: (mode) => void   // Toggle login/signup
}
```

### Local Component State
- Each component manages its own local state (form inputs, UI state)
- Use localStorage for user data persistence

---

## 🎨 Styling System

### CSS Architecture
1. **Tailwind CSS** - Utility classes
2. **Custom CSS** - Component-specific styles
3. **Color Scheme** - Defined in ColorScheme.css

### Key Classes

```css
/* Buttons */
.btn-signup, .btn-login, .btn-primary

/* Layouts */
.page-wrapper, .content, .sidebar

/* Forms */
.form-input, .form-label, .form-group

/* Animations */
.fade-in, .slide-up (defined in animations.css)
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Module not found" on build
**Solution:** Run `npm install` and ensure all dependencies are installed

### Issue 2: User not persisting on refresh
**Check:** 
- Browser DevTools → Application → Local Storage
- Look for key `vh_user`
- Ensure localStorage is enabled

### Issue 3: Routes not working
**Check:**
- App.jsx has BrowserRouter wrapper
- Routes are inside Router component
- useNavigate() is inside Router context

### Issue 4: Styles not applied
**Solution:**
- Check CSS import paths are correct
- Ensure Tailwind config is loaded
- Clear browser cache

---

## 📝 File Changes Summary

### New/Modified Files:
1. ✅ `App.jsx` - Converted to router-based with role protection
2. ✅ `contexts/AuthContext.jsx` - Unified auth context
3. ✅ `components/Header.jsx` - Updated imports
4. ✅ `components/AuthModal.jsx` - Updated imports & logic
5. ✅ `pages/auth/Login.jsx` - Added redirect to home
6. ✅ `pages/auth/Register.jsx` - Added full functionality
7. ✅ `package.json` - Added react-router-dom

### Copied/Integrated:
- All components from VolunteerHub-main
- All pages from VolunteerHub-main
- All styles from both projects
- API structure maintained
- Services maintained

---

## ✅ Verification Checklist

After integration, verify:

- [ ] Project builds without errors: `npm run build`
- [ ] Dev server starts: `npm run dev`
- [ ] Landing page loads at `/`
- [ ] Can open auth modal on landing
- [ ] Can submit signup form
- [ ] After signup, redirects to dashboard
- [ ] localStorage contains user data
- [ ] Can logout
- [ ] After logout, redirects to landing
- [ ] Protected routes redirect if not logged in
- [ ] Role-based routes work (manager/admin pages)

---

## 🎓 Learning Resources

### Key Concepts Used:
1. **React Routing** - React Router v6
2. **Context API** - Global state management
3. **Protected Routes** - Role-based access control
4. **localStorage** - Client-side data persistence
5. **Modal Management** - Modal state in context
6. **CSS Architecture** - Utility + component styles

### Next Learning Steps:
1. Backend integration (API calls)
2. JWT token management
3. Error handling
4. Form validation
5. Data fetching & caching

---

## 🤝 Support

For issues or questions:
1. Check browser console for errors
2. Inspect Network tab in DevTools
3. Verify localStorage data
4. Check routing configuration
5. Ensure all files are present

---

**Project Status: ✅ Ready for Development**

The unified project is ready for:
- Backend integration
- Additional feature development
- Testing
- Deployment
