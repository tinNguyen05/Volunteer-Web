# 🧪 Testing GraphQL Integration

## Quick Start Guide

### 1️⃣ Start Backend
```powershell
cd backend
$env:JAVA_HOME="C:\Program Files\Java\jdk-21"
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
$env:JWT_SECRET="mySecretKeyForJWTTokenGenerationAndValidation2024VolunteerHub"
.\gradlew.bat bootRun
```

**Chờ backend khởi động thành công** (xem log "Started VolunteerHubProject")

### 2️⃣ Start Frontend
```powershell
cd frontend
npm run dev
```

Truy cập: http://localhost:5173

---

## 🧪 Manual Testing Steps

### Step 1: Authentication
1. Click "Đăng Nhập" button
2. Nếu chưa có tài khoản, chọn "Đăng Ký"
   - Email: `test@example.com`
   - Password: `Test@123456`
   - Role: **Volunteer (USER)**
3. Sau khi đăng ký, login với tài khoản vừa tạo
4. **✅ Expected:** Redirect to `/dashboard` sau khi login thành công

### Step 2: Dashboard
1. Xem dashboard page
2. **✅ Expected:** 
   - Hiển thị stats (số events, members, posts)
   - List upcoming events (nếu có)
   - Recent activities

### Step 3: Events List
1. Click menu "Sự kiện" hoặc navigate to `/events`
2. **✅ Expected:**
   - Load danh sách events từ GraphQL
   - Hiển thị: title, date, location, attendees count
   - Tabs: Upcoming / Ongoing / Completed

### Step 4: Event Registration
1. Chọn một event từ list
2. Click "Đăng ký" button
3. **✅ Expected:**
   - Toast notification "Đăng ký thành công"
   - Attendee count tăng lên

### Step 5: Event Posts (Wall)
1. Click "Xem bài viết" trên một event
2. Navigate to `/eventPosts/:eventId`
3. **✅ Expected:**
   - Load event details + posts + comments
   - Hiển thị nested data đúng

### Step 6: Create Post
1. Trên Event Posts page, click "Tạo bài viết"
2. Nhập title, content
3. Submit
4. **✅ Expected:**
   - Toast "Đã đăng bài viết"
   - Post mới xuất hiện trong list

### Step 7: Comment & Like
1. Scroll xuống một post
2. Click ❤️ (Like) button
3. Nhập comment và submit
4. **✅ Expected:**
   - Like count tăng
   - Comment xuất hiện ngay

---

## 🔍 Browser DevTools Testing

### Quick API Test (F12 Console)
```javascript
// Copy nội dung file: graphql-integration-test.js
// Paste vào Console
// Run để test tất cả endpoints
```

### Check Network Tab
1. Open DevTools → Network
2. Filter: `graphql`
3. Refresh page hoặc trigger action
4. **✅ Expected:**
   - Request đến `http://localhost:8080/graphql`
   - Headers có `Authorization: Bearer <token>`
   - Response có `data` object (không có `errors`)

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend không start
**Error:** `Could not resolve placeholder 'JWT_SECRET'`
**Solution:** Set environment variable trước khi run:
```powershell
$env:JWT_SECRET="mySecretKeyForJWTTokenGenerationAndValidation2024VolunteerHub"
```

### Issue 2: CORS Error
**Error:** `blocked by CORS policy`
**Solution:** 
- Check `GlobalCorsConfig.java` có allow `http://localhost:5173`
- Restart backend

### Issue 3: Unauthorized (401)
**Error:** `Unauthorized` hoặc `Invalid token`
**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Login lại
3. Check token trong DevTools → Application → Local Storage

### Issue 4: GraphQL Error
**Error:** `Cannot query field "xxx" on type "Query"`
**Solution:**
- Check query syntax trong `eventService.js` / `postService.js`
- Verify với GraphiQL: http://localhost:8080/graphiql

### Issue 5: Không có dữ liệu
**Error:** Empty list hoặc null
**Solution:**
- Tạo dữ liệu mẫu trong backend trước
- Hoặc sử dụng Manager account để tạo Events

---

## 📊 GraphiQL Testing (Advanced)

1. Mở trình duyệt: http://localhost:8080/graphiql
2. Set Authorization header:
   ```
   {
     "Authorization": "Bearer <your-token-here>"
   }
   ```
3. Test queries:

**Example Query:**
```graphql
query {
  findEvents(page: 0, size: 5) {
    content {
      eventId
      title
      memberCount
      creatorInfo {
        username
      }
    }
  }
}
```

**Example Mutation:**
```graphql
mutation {
  registerEvent(eventId: "773316679898759168") {
    ok
    message
  }
}
```

---

## ✅ Final Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] Can login/signup successfully
- [ ] Dashboard shows real data
- [ ] Events list loads from GraphQL
- [ ] Can register for events
- [ ] Event posts page shows nested data
- [ ] Can create posts
- [ ] Can add comments
- [ ] Like/unlike works
- [ ] Role-based redirect works (USER→/dashboard, MANAGER→/manager/events, ADMIN→/admin/users)

---

## 🎉 Success Criteria

Nếu tất cả checklist trên ✅, congratulations! 

**Hybrid API Integration hoàn thành:**
- ✅ REST cho Authentication
- ✅ GraphQL cho Data (Events, Posts, Comments)
- ✅ JWT auto-inject
- ✅ Error handling
- ✅ Real-time UI updates

🚀 **Ready for Production!**
