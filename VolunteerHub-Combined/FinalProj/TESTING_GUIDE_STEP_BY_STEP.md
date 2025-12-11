# 🧪 VolunteerHub - Hướng Dẫn Test Chi Tiết

## ✅ Dự Án Đã Khởi Động

- **Backend:** http://localhost:8080
- **Frontend:** http://localhost:5173  
- **GraphQL:** http://localhost:8080/graphql
- **Database:** PostgreSQL (port 5431) ✅
- **Cache:** Redis (port 6379) ✅
- **Storage:** MinIO (port 9123) ✅

---

## 📝 Phần 1: Test Authentication (REST API)

### Bước 1.1: Đăng ký tài khoản mới

**Method:** POST  
**URL:** http://localhost:8080/api/auth/signup

**Request Body:**
```json
{
  "email": "testuser1@example.com",
  "password": "Test@123456"
}
```

**Cách test với curl:**
```bash
curl -X POST http://localhost:8080/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"testuser1@example.com\",\"password\":\"Test@123456\"}'
```

**Expected Response:**
```json
{
  "message": "Signup successful. Please check your email."
}
```

---

### Bước 1.2: Đăng nhập

**Method:** POST  
**URL:** http://localhost:8080/api/auth/login

**Request Body:**
```json
{
  "email": "testuser1@example.com",
  "password": "Test@123456"
}
```

**Cách test với curl:**
```bash
curl -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"testuser1@example.com\",\"password\":\"Test@123456\"}'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**📌 LƯU Ý:** Copy `accessToken` này để dùng cho các bước tiếp theo!

---

### Bước 1.3: Tạo User Profile

**Method:** GraphQL Mutation  
**URL:** http://localhost:8080/graphql  
**Authorization:** Bearer <YOUR_ACCESS_TOKEN>

**GraphQL Mutation:**
```graphql
mutation {
  createUserProfile(input: {
    username: "testuser1"
    fullName: "Test User One"
    bio: "I'm a volunteer enthusiast!"
    email: "testuser1@example.com"
  }) {
    ok
    id
    message
    createdAt
  }
}
```

**Cách test với curl:**
```bash
curl -X POST http://localhost:8080/graphql `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -d '{\"query\":\"mutation { createUserProfile(input: {username: \\\"testuser1\\\", fullName: \\\"Test User One\\\", bio: \\\"I am a volunteer enthusiast!\\\", email: \\\"testuser1@example.com\\\"}) { ok id message createdAt }}\"}'
```

**Expected Response:**
```json
{
  "data": {
    "createUserProfile": {
      "ok": true,
      "id": "UUID của user",
      "message": "Profile created successfully",
      "createdAt": "2025-12-09T19:25:00.000Z"
    }
  }
}
```

**📌 LƯU Ý:** Copy `id` (userId) này để dùng cho các test sau!

---

## 📝 Phần 2: Test Event Management

### Bước 2.1: Tạo Event (cần EVENT_MANAGER role)

**Chú ý:** User mới tạo có role USER. Để test, bạn cần:
1. Đăng nhập với tài khoản có role EVENT_MANAGER
2. Hoặc update role trong database

**Giả sử bạn đã có tài khoản EVENT_MANAGER:**

**GraphQL Mutation:**
```graphql
mutation {
  createEvent(input: {
    eventName: "Community Beach Cleanup"
    eventDescription: "Join us for a beach cleanup event to protect our ocean!"
    eventLocation: "Sunset Beach"
    eventDate: "2025-12-20T09:00:00"
  }) {
    ok
    id
    message
    createdAt
  }
}
```

**Expected Response:**
```json
{
  "data": {
    "createEvent": {
      "ok": true,
      "id": "773316679898759168",
      "message": "Success",
      "createdAt": "2025-12-09T19:30:00.000Z"
    }
  }
}
```

**📌 LƯU Ý:** Copy `id` (eventId) này!

---

### Bước 2.2: Xem danh sách Events

**GraphQL Query:**
```graphql
query {
  findEvents(page: 0, size: 10) {
    pageInfo {
      page
      size
      totalElements
      totalPages
      hasNext
    }
    content {
      eventId
      eventName
      eventDescription
      eventLocation
      createdAt
      memberCount
      postCount
      likeCount
    }
  }
}
```

**Không cần Authorization** (public query)

---

### Bước 2.3: Xem chi tiết Event

**GraphQL Query:**
```graphql
query {
  getEvent(eventId: "773316679898759168") {
    eventId
    eventName
    eventDescription
    eventLocation
    createdAt
    memberCount
    postCount
    likeCount
    creatorInfo {
      userId
      username
      avatarId
    }
  }
}
```

---

### Bước 2.4: Đăng ký tham gia Event

**GraphQL Mutation:**
```graphql
mutation {
  registerEvent(eventId: "773316679898759168") {
    ok
    id
    message
    createdAt
  }
}
```

**Cần Authorization:** Bearer <YOUR_ACCESS_TOKEN>

---

## 📝 Phần 3: Test Post Management

### Bước 3.1: Tạo Post trong Event

**GraphQL Mutation:**
```graphql
mutation {
  createPost(input: {
    eventId: "773316679898759168"
    content: "Excited to join this beach cleanup event! 🌊🌴"
  }) {
    ok
    id
    message
    createdAt
  }
}
```

**📌 Copy postId từ response!**

---

### Bước 3.2: Xem danh sách Posts

**GraphQL Query:**
```graphql
query {
  findPosts(page: 0, size: 10) {
    pageInfo {
      page
      size
      totalElements
    }
    content {
      postId
      eventId
      content
      createdAt
      commentCount
      likeCount
      creatorInfo {
        userId
        username
        avatarId
      }
    }
  }
}
```

---

### Bước 3.3: Xem chi tiết Post với Comments

**GraphQL Query:**
```graphql
query {
  getPost(postId: "YOUR_POST_ID") {
    postId
    eventId
    content
    createdAt
    commentCount
    likeCount
    creatorInfo {
      userId
      username
      avatarId
    }
    listComment(page: 0, size: 5) {
      pageInfo {
        page
        size
        totalElements
      }
      content {
        commentId
        content
        createdAt
        likeCount
        creatorInfo {
          userId
          username
        }
      }
    }
  }
}
```

---

## 📝 Phần 4: Test Comment Management

### Bước 4.1: Tạo Comment

**GraphQL Mutation:**
```graphql
mutation {
  createComment(input: {
    postId: "YOUR_POST_ID"
    content: "Great initiative! Count me in! 💪"
  }) {
    ok
    id
    message
    createdAt
  }
}
```

**📌 Copy commentId từ response!**

---

### Bước 4.2: Edit Comment

**GraphQL Mutation:**
```graphql
mutation {
  editComment(input: {
    commentId: "YOUR_COMMENT_ID"
    content: "Updated: Really looking forward to this! 🌟"
  }) {
    ok
    id
    message
    updatedAt
  }
}
```

---

### Bước 4.3: Delete Comment

**GraphQL Mutation:**
```graphql
mutation {
  deleteComment(commentId: "YOUR_COMMENT_ID") {
    ok
    message
  }
}
```

---

## 📝 Phần 5: Test Like System

### Bước 5.1: Like một Post

**GraphQL Mutation:**
```graphql
mutation {
  like(input: {
    targetType: "post"
    targetId: "YOUR_POST_ID"
  }) {
    ok
    message
  }
}
```

---

### Bước 5.2: Like một Comment

**GraphQL Mutation:**
```graphql
mutation {
  like(input: {
    targetType: "comment"
    targetId: "YOUR_COMMENT_ID"
  }) {
    ok
    message
  }
}
```

---

### Bước 5.3: Like một Event

**GraphQL Mutation:**
```graphql
mutation {
  like(input: {
    targetType: "event"
    targetId: "773316679898759168"
  }) {
    ok
    message
  }
}
```

---

### Bước 5.4: Unlike

**GraphQL Mutation:**
```graphql
mutation {
  unlike(input: {
    targetType: "post"
    targetId: "YOUR_POST_ID"
  }) {
    ok
    message
  }
}
```

---

## 📝 Phần 6: Test Dashboard Queries

### Bước 6.1: Dashboard - Recent Events

**GraphQL Query:**
```graphql
query {
  dashboardEvents(filter: {
    recentlyCreated: true
    limit: 10
  }) {
    eventId
    eventName
    createdAt
    memberCount
    postCount
    likeCount
    creatorInfo {
      userId
      username
      avatarId
    }
  }
}
```

---

### Bước 6.2: Dashboard - Recent Posts

**GraphQL Query:**
```graphql
query {
  dashboardPosts(filter: {
    recent: true
    limit: 10
  }) {
    postId
    eventId
    createdAt
    commentCount
    likeCount
  }
}
```

---

## 📝 Phần 7: Test User Profile

### Bước 7.1: Xem User Profile với Events

**GraphQL Query:**
```graphql
query {
  getUserProfile(userId: "YOUR_USER_ID") {
    userId
    username
    fullName
    email
    bio
    status
    createdAt
    postCount
    commentCount
    eventCount
    listEvents(page: 0, size: 5) {
      pageInfo {
        page
        size
        totalElements
      }
      content {
        eventId
        eventName
        eventDescription
        createdAt
        memberCount
        postCount
      }
    }
  }
}
```

---

### Bước 7.2: Update User Profile (REST API)

**Method:** PUT  
**URL:** http://localhost:8080/api/user-profile

**Request Body:**
```json
{
  "username": "testuser1_updated",
  "fullName": "Test User One - Updated",
  "bio": "Updated bio: Passionate volunteer!",
  "email": "testuser1@example.com",
  "avatarId": "avatar123"
}
```

**Cách test với curl:**
```bash
curl -X PUT http://localhost:8080/api/user-profile `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -d '{\"username\":\"testuser1_updated\",\"fullName\":\"Test User One - Updated\",\"bio\":\"Updated bio: Passionate volunteer!\",\"email\":\"testuser1@example.com\"}'
```

---

## 📝 Phần 8: Test với Multiple Users

### Tạo User thứ 2:

1. Signup: `testuser2@example.com` / `Test@123456`
2. Login và lấy accessToken
3. Create profile với username `testuser2`
4. Thử comment vào post của user 1
5. Thử like post của user 1
6. Register event của user 1

### Test Permissions:

1. User 2 thử edit post của User 1 → Should FAIL
2. User 2 thử delete comment của User 1 → Should FAIL
3. User 2 thử edit event của User 1 → Should FAIL

---

## 📝 Phần 9: Test Complex Queries

### Query 1: Event với Posts và Comments (Nested)

**GraphQL Query:**
```graphql
query {
  getEvent(eventId: "773316679898759168") {
    eventId
    eventName
    eventDescription
    memberCount
    postCount
    likeCount
    
    listPosts(page: 0, size: 5) {
      pageInfo {
        page
        size
        totalElements
      }
      content {
        postId
        content
        createdAt
        commentCount
        likeCount
        
        listComment(page: 0, size: 3) {
          pageInfo {
            totalElements
          }
          content {
            commentId
            content
            createdAt
            likeCount
            creatorInfo {
              userId
              username
            }
          }
        }
      }
    }
  }
}
```

---

## 🛠️ Tools để Test

### Option 1: VS Code REST Client Extension

Tạo file `test.http`:

```http
### Signup
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "email": "testuser1@example.com",
  "password": "Test@123456"
}

### Login
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "testuser1@example.com",
  "password": "Test@123456"
}

### GraphQL Query
POST http://localhost:8080/graphql
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "query": "query { findEvents(page: 0, size: 10) { content { eventId eventName } } }"
}
```

---

### Option 2: Postman

1. Tạo Collection "VolunteerHub"
2. Add requests cho từng endpoint
3. Set Environment variables: `baseUrl`, `accessToken`
4. Use `{{baseUrl}}` và `{{accessToken}}` trong requests

---

### Option 3: curl (Command Line)

Xem các ví dụ curl ở trên từng phần.

---

## ✅ Checklist Test

- [ ] **Authentication**
  - [ ] Signup user mới
  - [ ] Login và lấy token
  - [ ] Refresh token
  - [ ] Create profile

- [ ] **Event Management**
  - [ ] Create event (EVENT_MANAGER)
  - [ ] List events
  - [ ] Get event details
  - [ ] Register event
  - [ ] Approve event (ADMIN)

- [ ] **Post Management**
  - [ ] Create post
  - [ ] List posts
  - [ ] Get post details
  - [ ] Edit post (owner)
  - [ ] Delete post (owner)

- [ ] **Comment Management**
  - [ ] Create comment
  - [ ] Edit comment (owner)
  - [ ] Delete comment (owner)

- [ ] **Like System**
  - [ ] Like post
  - [ ] Like comment
  - [ ] Like event
  - [ ] Unlike

- [ ] **User Profile**
  - [ ] Get profile
  - [ ] Update profile
  - [ ] View events joined

- [ ] **Dashboard**
  - [ ] Recent events
  - [ ] Recent posts

- [ ] **Permissions**
  - [ ] Test USER role
  - [ ] Test EVENT_MANAGER role
  - [ ] Test ADMIN role
  - [ ] Test unauthorized access

---

## 🐛 Troubleshooting

### Lỗi: "Unauthorized"
- Kiểm tra accessToken có đúng không
- Token có expired không (50 minutes)
- Header có format: `Authorization: Bearer <token>`

### Lỗi: "Event not found"
- Kiểm tra eventId có đúng không
- Event đã được tạo chưa

### Lỗi: "User does not have permission"
- Kiểm tra role của user
- Endpoint này cần role gì

### Count trả về 0
- Check Redis đang chạy
- Thử like/comment trước để tạo data

---

## 📊 Expected Results Summary

Sau khi test xong, bạn nên có:
- ✅ 2-3 users đã đăng ký và có profile
- ✅ 1-2 events đã được tạo
- ✅ 3-5 posts trong các events
- ✅ 5-10 comments trên các posts
- ✅ Một số likes trên posts/comments/events
- ✅ User profiles hiển thị đúng counts
- ✅ Dashboard queries trả về data

---

## 🎯 Next Steps

Sau khi test backend thành công, bạn có thể:
1. Test frontend integration với backend APIs
2. Test real-time features (nếu có)
3. Test file upload (avatars)
4. Performance testing với nhiều users
5. Security testing
