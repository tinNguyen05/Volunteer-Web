# 🔐 HƯỚNG DẪN SETUP OAUTH - GOOGLE & FACEBOOK

## 📋 Tổng quan

Backend đã được tích hợp **Passport.js** để hỗ trợ đăng nhập nhanh bằng Google và Facebook. Người dùng có thể:
- Đăng nhập bằng tài khoản Google
- Đăng nhập bằng tài khoản Facebook
- Tự động tạo tài khoản mới nếu chưa tồn tại
- Nhận JWT token sau khi đăng nhập thành công

---

## 🚀 Cấu trúc đã triển khai

### Backend Files:
```
backend/
├── src/
│   ├── config/
│   │   └── passport.js              # Passport strategies (Google, Facebook)
│   ├── controllers/
│   │   └── oauthController.js       # OAuth callbacks & error handling
│   ├── api/
│   │   └── oauthRoutes.js           # OAuth routes
│   └── models/
│       └── User.js                   # Updated với googleId, facebookId
└── .env.example                      # Template cho OAuth credentials
```

### Frontend Files:
```
frontend/
├── src/
│   ├── pages/
│   │   └── auth/
│   │       ├── Login.jsx             # Updated với OAuth buttons
│   │       └── OAuthCallback.jsx     # Xử lý callback sau OAuth
│   ├── assets/
│   │   └── styles/
│   │       └── login_register.css    # OAuth button styles
│   └── App.jsx                       # Updated với /auth/callback route
```

---

## 🔧 Bước 1: Cài đặt Dependencies

Packages đã được cài đặt:
- ✅ `passport` - Core authentication middleware
- ✅ `passport-google-oauth20` - Google OAuth strategy
- ✅ `passport-facebook` - Facebook OAuth strategy
- ✅ `express-session` - Session management

---

## 🔑 Bước 2: Lấy OAuth Credentials

### A. Google OAuth Setup

1. **Truy cập Google Cloud Console:**
   - 🌐 https://console.cloud.google.com/

2. **Tạo Project mới:**
   - Click "Select a project" → "New Project"
   - Đặt tên: `VolunteerHub`
   - Click "Create"

3. **Enable Google+ API:**
   - Sidebar → "APIs & Services" → "Library"
   - Tìm "Google+ API"
   - Click "Enable"

4. **Tạo OAuth Credentials:**
   - Sidebar → "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `VolunteerHub Web Client`
   
5. **Cấu hình Authorized redirect URIs:**
   ```
   http://localhost:5000/api/auth/google/callback
   ```
   (Thêm domain production khi deploy)

6. **Copy credentials:**
   - Client ID: `123456789-abcdefg.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-xxxxxxxxxxxxx`

---

### B. Facebook OAuth Setup

1. **Truy cập Facebook Developers:**
   - 🌐  

2. **Tạo App mới:**
   - Click "My Apps" → "Create App"
   - Chọn: "Consumer" (cho login)
   - App Name: `VolunteerHub`
   - App Contact Email: your-email@example.com
   - Click "Create App"

3. **Add Facebook Login Product:**
   - Dashboard → "Add a Product"
   - Tìm "Facebook Login" → Click "Set Up"

4. **Cấu hình OAuth Settings:**
   - Sidebar → "Facebook Login" → "Settings"
   - Valid OAuth Redirect URIs:
   ```
   http://localhost:5000/api/auth/facebook/callback
   ```

5. **Copy credentials:**
   - Settings → Basic
   - App ID: `1234567890123456`
   - App Secret: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (Click "Show")

---

## ⚙️ Bước 3: Cấu hình Backend

### 1. Tạo file `.env`:

```bash
cd backend
cp .env.example .env
```

### 2. Điền OAuth credentials vào `.env`:

```env
# ==================== SERVER CONFIG ====================
PORT=5000
NODE_ENV=development

# ==================== DATABASE ====================
MONGODB_URI=mongodb://localhost:27017/volunteerhub

# ==================== JWT ====================
JWT_SECRET=your-secret-key-change-in-production
SESSION_SECRET=your-session-secret-change-in-production

# ==================== FRONTEND ====================
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# ==================== GOOGLE OAUTH ====================
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# ==================== FACEBOOK OAUTH ====================
FACEBOOK_APP_ID=1234567890123456
FACEBOOK_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback
```

### 3. Khởi động backend:

```bash
npm run dev
```

Server chạy tại: http://localhost:5000

---

## 🎨 Bước 4: Test OAuth Flow

### 1. Khởi động frontend:

```bash
cd frontend
npm run dev
```

Frontend chạy tại: http://localhost:5173

### 2. Test Google Login:

1. Mở http://localhost:5173/login
2. Click nút **"Google"** (màu xanh với logo Google)
3. Trình duyệt chuyển đến trang đăng nhập Google
4. Chọn tài khoản Google
5. Cho phép ứng dụng truy cập email & profile
6. Tự động chuyển về `/auth/callback` → `/dashboard`

### 3. Test Facebook Login:

1. Mở http://localhost:5173/login
2. Click nút **"Facebook"** (màu xanh đậm với logo Facebook)
3. Trình duyệt chuyển đến trang đăng nhập Facebook
4. Đăng nhập Facebook
5. Cho phép ứng dụng truy cập thông tin
6. Tự động chuyển về `/auth/callback` → `/dashboard`

---

## 🔄 OAuth Flow Diagram

```
User clicks "Login with Google"
       ↓
Frontend: Redirect to http://localhost:5000/api/auth/google
       ↓
Backend: Passport redirects to Google OAuth
       ↓
Google: User authenticates & authorizes
       ↓
Google: Redirects back to /api/auth/google/callback
       ↓
Backend: Passport receives user profile
       ↓
Backend: Find or create user in MongoDB
       ↓
Backend: Generate JWT token
       ↓
Backend: Redirect to http://localhost:5173/auth/callback?token=xxx
       ↓
Frontend: OAuthCallback.jsx receives token
       ↓
Frontend: Save token to localStorage
       ↓
Frontend: Fetch user info with token
       ↓
Frontend: Login user & redirect to /dashboard
       ✅ Done!
```

---

## 📊 User Model Changes

User schema được cập nhật với:

```javascript
{
  // Existing fields...
  email: String,
  password: String,  // Không bắt buộc nếu có googleId/facebookId
  name: String,
  avatar: String,
  
  // NEW OAuth fields:
  googleId: {
    type: String,
    unique: true,
    sparse: true  // Cho phép null không conflict
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true
  }
}
```

---

## 🎯 API Endpoints

### OAuth Routes (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/google` | Khởi tạo Google OAuth |
| GET | `/api/auth/google/callback` | Google callback handler |
| GET | `/api/auth/facebook` | Khởi tạo Facebook OAuth |
| GET | `/api/auth/facebook/callback` | Facebook callback handler |
| GET | `/api/auth/oauth/failure` | OAuth error handler |

### Frontend Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/login` | Login.jsx | Login form với OAuth buttons |
| `/auth/callback` | OAuthCallback.jsx | Xử lý OAuth callback & token |

---

## 🛠️ Troubleshooting

### 1. "Redirect URI mismatch" Error

**Nguyên nhân:** Callback URL trong Google/Facebook Console không khớp với backend

**Giải pháp:**
- Google Console: Thêm `http://localhost:5000/api/auth/google/callback`
- Facebook Settings: Thêm `http://localhost:5000/api/auth/facebook/callback`

### 2. "User not found" sau OAuth

**Nguyên nhân:** MongoDB chưa khởi động hoặc connection string sai

**Giải pháp:**
```bash
# Kiểm tra MongoDB đang chạy
mongod --version

# Khởi động MongoDB
mongod
```

### 3. OAuth button không hoạt động

**Nguyên nhân:** Backend chưa chạy hoặc CORS issue

**Giải pháp:**
- Kiểm tra backend: http://localhost:5000/api/health
- Kiểm tra CORS settings trong `index.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### 4. Token không được lưu

**Nguyên nhân:** Frontend callback handler lỗi

**Giải pháp:**
- Mở Console → Application → Local Storage
- Kiểm tra key `token` đã tồn tại chưa
- Check Console logs trong `OAuthCallback.jsx`

---

## 🚀 Production Deployment

### 1. Cập nhật `.env` với production URLs:

```env
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
FACEBOOK_CALLBACK_URL=https://yourdomain.com/api/auth/facebook/callback
```

### 2. Cập nhật OAuth Redirect URIs:

**Google Console:**
- Thêm: `https://yourdomain.com/api/auth/google/callback`

**Facebook Settings:**
- Thêm: `https://yourdomain.com/api/auth/facebook/callback`

### 3. Update frontend OAuth button URLs:

`frontend/src/pages/auth/Login.jsx`:
```jsx
<a href={`${process.env.VITE_API_URL}/api/auth/google`} className="btn-social btn-google">
  Google
</a>
```

---

## 📝 Notes

- **Session vs JWT:** Backend sử dụng session cho Passport nhưng cuối cùng trả về JWT để frontend sử dụng
- **Security:** Luôn dùng HTTPS trong production
- **Email Required:** Facebook có thể không trả về email, code handle bằng placeholder email
- **Multiple Providers:** User có thể link cả Google & Facebook vào cùng 1 tài khoản (dựa vào email)

---

## ✅ Checklist

- [ ] MongoDB đang chạy
- [ ] Backend dependencies đã cài (`passport`, `passport-google-oauth20`, `passport-facebook`, `express-session`)
- [ ] File `.env` đã tạo với OAuth credentials
- [ ] Google OAuth credentials đã lấy
- [ ] Facebook OAuth credentials đã lấy
- [ ] Redirect URIs đã config trong Google/Facebook Console
- [ ] Backend đang chạy: http://localhost:5000
- [ ] Frontend đang chạy: http://localhost:5173
- [ ] Test Google login thành công
- [ ] Test Facebook login thành công

---

## 🎉 Hoàn thành!

Bây giờ người dùng có thể đăng nhập bằng:
1. **Email/Password** (form truyền thống)
2. **Google Account** (nút màu xanh với logo Google)
3. **Facebook Account** (nút màu xanh đậm với logo Facebook)

Tất cả đều tự động tạo tài khoản mới nếu chưa tồn tại và redirect về dashboard sau khi thành công! 🚀
