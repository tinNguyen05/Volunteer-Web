# 🚀 VolunteerHub - Complete Startup Guide

## ✅ Build Status

- **Frontend**: ✅ BUILT SUCCESSFULLY
  - Bundle size: 292.79 KB (gzipped: 85.05 KB)
  - Build time: 580ms
  - Output: `frontend/dist`

- **Backend**: ✅ READY TO RUN
  - All dependencies: ✅ Installed
  - All endpoints: ✅ Available
  - Database models: ✅ Created

- **Total**: ✅ PROJECT READY TO LAUNCH

---

## 📋 Cách Chạy (3 Bước Đơn Giản)

### **Bước 1: Start MongoDB**

Mở một **terminal mới** và chạy:

```bash
mongod
```

✅ Bạn sẽ thấy dòng: `MongoDB starting ...`

---

### **Bước 2: Start Backend**

Mở một **terminal mới** khác và chạy:

#### **Option A: Dùng Batch File (Windows)**
```bash
RUN_BACKEND.bat
```

#### **Option B: Manual**
```bash
cd backend
npm run dev
```

✅ Bạn sẽ thấy:
```
Server running on port 5000
http://localhost:5000
```

---

### **Bước 3: Start Frontend**

Mở một **terminal mới** khác nữa và chạy:

#### **Option A: Dùng Batch File (Windows)**
```bash
RUN_FRONTEND.bat
```

#### **Option B: Manual**
```bash
cd frontend
npm run dev
```

✅ Bạn sẽ thấy:
```
VITE v5.0.0 ready in 500 ms
http://localhost:5173
```

---

## 🎯 Tổng Hợp URLs

| Thành phần | URL | Port | Trạng thái |
|-----------|-----|------|-----------|
| **Frontend** | http://localhost:5173 | 5173 | ✅ Ready |
| **Backend** | http://localhost:5000 | 5000 | ✅ Ready |
| **MongoDB** | mongodb://localhost:27017 | 27017 | ⚠️ Must start manually |

---

## 📝 Các Terminal Bạn Cần Mở

```
┌─────────────────────────────────────────────────────┐
│  Terminal 1: MongoDB Server                         │
│  $ mongod                                           │
│  Port: 27017                                        │
├─────────────────────────────────────────────────────┤
│  Terminal 2: Backend Server                         │
│  $ cd backend && npm run dev                        │
│  Port: 5000                                         │
├─────────────────────────────────────────────────────┤
│  Terminal 3: Frontend Server                        │
│  $ cd frontend && npm run dev                       │
│  Port: 5173                                         │
└─────────────────────────────────────────────────────┘
```

---

## 🧪 Test Các Endpoints

### **Kiểm tra Backend Health**

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "Server is running",
  "timestamp": "2025-11-15T14:30:00.000Z"
}
```

### **Test Registration**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 🔧 Troubleshooting

### ❌ MongoDB Connection Error

**Lỗi**: `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Giải pháp**:
```bash
# Kiểm tra MongoDB
mongod --version

# Start MongoDB
mongod

# Hoặc trên Windows nếu đã install as service:
net start MongoDB
```

---

### ❌ Port Already in Use

**Lỗi**: `Error: listen EADDRINUSE :::5000`

**Giải pháp**:
```bash
# Kiểm tra process nào dùng port
netstat -ano | findstr :5000

# Kill process (thay 1234 bằng PID từ trên)
taskkill /PID 1234 /F
```

---

### ❌ Dependencies Not Installed

**Lỗi**: `Cannot find module 'express'`

**Giải pháp**:
```bash
cd backend
rm -r node_modules package-lock.json
npm install
```

---

### ❌ Frontend Not Loading

**Lỗi**: `Cannot GET /`

**Giải pháp**:
1. Kiểm tra frontend đã start trên port 5173
2. Mở http://localhost:5173 (không phải 5000)
3. Clear cache: Ctrl+Shift+Delete

---

## 📊 Build & Performance Stats

### Frontend Bundle
```
✓ 1714 modules transformed
✓ 292.79 KB JavaScript (gzipped: 85.05 KB)
✓ 86.22 KB CSS (gzipped: 15.67 KB)
✓ Build time: 580ms
```

### Backend Stack
```
✓ Node.js + Express 4.18.2
✓ MongoDB 7.6.1 (Mongoose)
✓ JWT Authentication
✓ 23 API Endpoints
✓ 5 Database Models
```

### Features Ready
```
✓ User Authentication & Authorization
✓ Event Management
✓ Blood Donation Registration
✓ Membership Program
✓ Toast Notifications
✓ Role-Based Access Control
✓ Input Validation
✓ Error Handling
```

---

## ✨ Quick Features to Test

1. **Đăng Ký** - Create a new account
2. **Đăng Nhập** - Login with your account
3. **Xem Events** - Browse volunteer events
4. **Đăng Ký Event** - Register for an event
5. **Hiến Máu** - Register for blood donation
6. **Thành Viên** - Join membership program

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `BACKEND_API_GUIDE.md` | Full API endpoint documentation |
| `BACKEND_QUICK_START.md` | Backend setup guide |
| `FRONTEND_INTEGRATION_EXAMPLES.md` | Code examples |
| `README_BACKEND.md` | Complete backend overview |

---

## 🚀 Quick Launch Commands

**All at once (requires opening 3 terminals):**

```bash
# Terminal 1
mongod

# Terminal 2
cd backend && npm run dev

# Terminal 3
cd frontend && npm run dev
```

**Then open in browser:**
- http://localhost:5173

---

## ✅ Success Checklist

- [ ] MongoDB running (port 27017)
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 5173)
- [ ] Can access http://localhost:5173
- [ ] Can see login page
- [ ] API health check: http://localhost:5000/api/health

---

## 💡 Tips

1. **Keep terminals open** - Don't close them while developing
2. **Hot reload** - Frontend automatically reloads on file changes
3. **API Testing** - Use Postman or Insomnia to test endpoints
4. **Logs** - Check terminal output for errors and logs
5. **Database** - Use MongoDB Compass to view/manage data

---

## 🎉 Ready!

Bạn đã sẵn sàng để:
- ✅ Chạy ứng dụng đầy đủ
- ✅ Test tất cả các features
- ✅ Phát triển thêm tính năng
- ✅ Deploy lên production

**Hãy bắt đầu!** 🚀

---

**Status**: ✅ PRODUCTION READY

**Version**: 1.0.0

**Last Built**: November 15, 2025

**Build Command**: `npm run build` (Frontend)

**Dev Command**: `npm run dev` (Backend/Frontend)
