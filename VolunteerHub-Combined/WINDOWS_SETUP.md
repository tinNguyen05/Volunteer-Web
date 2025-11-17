# 🪟 VolunteerHub - Windows Setup Guide

## Step-by-Step for Windows Users

### Prerequisites

1. **Node.js** - Download from https://nodejs.org (LTS version)
   ```bash
   node --version  # Should show v18+ or higher
   npm --version   # Should show 9+
   ```

2. **MongoDB** - Download from https://www.mongodb.com/try/download/community
   ```bash
   mongod --version  # Verify installation
   ```

3. **Git** (Optional) - Download from https://git-scm.com

---

## Installation Steps

### Step 1: Navigate to Project Folder

Open PowerShell or Command Prompt and go to project folder:

```powershell
cd "c:\Users\Admin\OneDrive - vnu.edu.vn\Máy tính\Code\Proj\VolunteerHub-Combined"
```

Or simply **shift+right-click** in the folder and select "Open PowerShell here"

---

### Step 2: Auto Setup (Recommended)

Double-click this file:
- **SETUP.bat**

This will:
- ✅ Install backend dependencies
- ✅ Install frontend dependencies  
- ✅ Build frontend

---

### Step 3: Start Services

After setup completes, open **3 separate PowerShell/Command Prompt windows**:

#### Window 1: MongoDB
```powershell
mongod
```

You should see: `MongoDB starting on port 27017`

---

#### Window 2: Backend

Double-click:
- **RUN_BACKEND.bat**

Or manually:
```powershell
cd backend
npm run dev
```

You should see: `Server running on port 5000`

---

#### Window 3: Frontend

Double-click:
- **RUN_FRONTEND.bat**

Or manually:
```powershell
cd frontend
npm run dev
```

You should see: `VITE ready in XXX ms`

---

## ✅ Verification

### Check MongoDB
Open new PowerShell:
```powershell
mongo
> show dbs
```

### Check Backend
Open browser and go to:
```
http://localhost:5000/api/health
```

Should see JSON response.

### Check Frontend
Open browser and go to:
```
http://localhost:5173
```

Should see login page.

---

## 🎯 Access URLs

| Service | URL |
|---------|-----|
| **App** | http://localhost:5173 |
| **API** | http://localhost:5000 |
| **Health** | http://localhost:5000/api/health |

---

## 🧪 Test Features

1. **Sign Up**
   - Go to http://localhost:5173
   - Click "Sign Up"
   - Fill in details and select a role
   - Submit

2. **Sign In**
   - Use credentials from signup
   - You'll see the dashboard

3. **Browse Events**
   - Click "Projects" or "Events"
   - View all events
   - Register for an event

4. **Other Features**
   - Blood Donation
   - Membership
   - User Profile
   - Admin Panel

---

## 🐛 Troubleshooting

### Error: "Cannot find module"

**Solution**: Reinstall dependencies
```powershell
cd backend
rm -r node_modules
npm install
```

### Error: "Port already in use"

**Solution**: Kill the process using that port
```powershell
# Find process on port 5000
netstat -ano | findstr :5000

# Kill the process (replace 1234 with actual PID)
taskkill /PID 1234 /F
```

### Error: "MongoDB connection refused"

**Solution**: Start MongoDB first
```powershell
mongod
# Wait for "MongoDB starting..."
```

### Error: Frontend shows blank page

**Solution**: 
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Open in incognito mode

### Error: "npm command not found"

**Solution**: Reinstall Node.js from nodejs.org

---

## 📊 Expected Results

After everything is running, you should see:

**Terminal 1 (MongoDB):**
```
MongoDB starting on port 27017
```

**Terminal 2 (Backend):**
```
Server running on port 5000
http://localhost:5000
```

**Terminal 3 (Frontend):**
```
VITE v5.0.0 ready in 500 ms
  ➜  Local:   http://localhost:5173/
```

**Browser (http://localhost:5173):**
- Login page visible
- Can enter credentials
- Can click buttons

---

## 🚀 Next Steps

After everything is working:

1. **Create Account** - Sign up with test data
2. **Explore UI** - Click through all pages
3. **Test APIs** - Create events, register, etc.
4. **Check Console** - Open F12 to see logs
5. **Review Code** - Check the source files

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `SETUP.bat` | Auto setup (click to run) |
| `RUN_BACKEND.bat` | Start backend (click to run) |
| `RUN_FRONTEND.bat` | Start frontend (click to run) |
| `STARTUP_GUIDE.md` | Detailed guide |
| `QUICK_START.txt` | Quick reference |
| `README_BACKEND.md` | API documentation |

---

## 💡 Windows Tips

1. **Keep terminals open** - Minimize them, don't close
2. **Right-click window** - Pin to taskbar for easy access
3. **Copy long paths** - Easier than typing
4. **Use Task Manager** - To kill processes if needed
5. **Environment Variables** - Already handled by npm

---

## 🎉 Success!

If you see all 3 services running and can access http://localhost:5173, you're done! 🎉

**Congratulations! Your VolunteerHub app is ready to use!**

---

**Questions?** Check the other markdown files in this folder for more detailed documentation.

**Ready?** Let's build something amazing! 🚀
