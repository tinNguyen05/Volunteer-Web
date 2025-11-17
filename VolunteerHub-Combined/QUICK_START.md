# 🚀 Quick Start Guide

## Nhanh chóng bắt đầu

### 1️⃣ Setup Project

```bash
cd VolunteerHub-Combined/frontend
npm install
```

### 2️⃣ Chạy Development Server

```bash
npm run dev
```

Output:
```
➜  Local:   http://localhost:5173/
```

### 3️⃣ Mở Browser

Truy cập: **http://localhost:5173/**

---

## 📱 Thử Nghiệm Ứng Dụng

### ✅ Landing Page (Public)
- ✔️ Xem hero section
- ✔️ Scroll các section khác nhau
- ✔️ Click nút "Sign Up" hoặc "Login"

### ✅ Đăng Ký (Sign Up)
1. Click "Sign Up" button
2. Modal mở lên
3. Nhập email & password
4. Chọn Role (Volunteer/Manager/Admin)
5. Đánh dấu "Agree Terms"
6. Click "SIGN UP"
7. **→ Redirect to Dashboard ✓**

### ✅ Login
1. Click "Login" button
2. Modal mở ở tab Login
3. Nhập email
4. Chọn Role
5. Click "LOGIN"
6. **→ Redirect to Dashboard ✓**

### ✅ Dashboard
Dựa trên role, bạn thấy:
- **Volunteer**: Events, History, Notifications
- **Manager**: Event Management, Approve Volunteers
- **Admin**: User Management, Event Approval

### ✅ Logout
1. Click profile/logout button
2. **→ Redirect to Landing ✓**
3. localStorage được xóa

---

## 🎯 Key Routes

| Route | Access | Role |
|-------|--------|------|
| `/` | Public | Everyone |
| `/login` | Public | Everyone |
| `/register` | Public | Everyone |
| `/dashboard` | Protected | Any logged-in user |
| `/events` | Protected | Any user |
| `/history` | Protected | Any user |
| `/manager/events` | Protected | manager only |
| `/manager/approve` | Protected | manager only |
| `/admin/users` | Protected | admin only |
| `/admin/events` | Protected | admin only |

---

## 💾 Testing Data

Data được lưu trong `localStorage`:
- Key: `vh_user`
- Dữ liệu: User object (JSON string)

Xem dữ liệu:
1. Mở DevTools (F12)
2. Vào Application tab
3. Local Storage → http://localhost:5173
4. Tìm key `vh_user`

---

## 🎨 Customization

### Thay đổi Colors
`src/assets/styles/ColorScheme.css`

### Thay đổi Fonts
`src/assets/styles/ColorScheme.css`

### Thêm New Routes
Edit `src/App.jsx` - thêm route mới trong `<Routes>`

### Thêm New Pages
1. Tạo file `.jsx` trong `src/pages/`
2. Import vào `App.jsx`
3. Thêm route

---

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main router & layout |
| `src/contexts/AuthContext.jsx` | Authentication state |
| `src/components/Header.jsx` | Navigation header |
| `src/components/AuthModal.jsx` | Login/Signup modal |
| `src/pages/Hero.jsx` | Landing page hero |

---

## 🚨 Troubleshooting

### Port 5173 already in use?
```bash
npm run dev -- --port 3000
```

### Build fails?
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
npm run build
```

### localStorage not working?
- Check DevTools → Application → Cookies
- Ensure cookies aren't disabled
- Refresh page

### Routes not working?
- Ensure you're inside Router context
- Check Browser DevTools console for errors
- Verify route paths match exactly

---

## ✅ First-Time Setup Checklist

- [ ] Ran `npm install`
- [ ] Dev server starts with `npm run dev`
- [ ] Browser opens to http://localhost:5173
- [ ] Can see landing page
- [ ] Can click "Sign Up" and see modal
- [ ] Can fill form and submit
- [ ] After submit, redirects to dashboard
- [ ] localStorage contains user data
- [ ] Can logout

---

## 🎓 Next Steps

1. **Build Real Features**
   - Replace mock data with real data
   - Connect to backend API

2. **Add More Pages**
   - Duplicate page structure
   - Update routes in App.jsx

3. **Improve Auth**
   - Add JWT tokens
   - Add refresh token logic
   - Add password reset

4. **Add Validation**
   - Form validation
   - Input sanitization
   - Error handling

5. **Deploy**
   - Build for production
   - Deploy to hosting
   - Setup environment variables

---

## 📞 Support

If something doesn't work:
1. Check console (DevTools)
2. Check Network tab
3. Verify file structure
4. Read error messages carefully
5. Check INTEGRATION_GUIDE.md

---

**Happy Coding! 🎉**
