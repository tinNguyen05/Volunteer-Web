# 📋 VolunteerHub Backend - Danh Sách Chức Năng

## 🔐 1. Authentication & Authorization

### 1.1 Đăng Ký (Signup)
- **Endpoint:** `POST /api/auth/signup`
- **Mô tả:** Đăng ký tài khoản mới với email và password
- **Role:** Public (không cần đăng nhập)
- **Features:**
  - Validate email format và password strength
  - Hash password với BCrypt
  - Tạo verification token
  - Gửi email xác nhận (nếu enable)
  - Trạng thái tài khoản: PENDING → ACTIVE

### 1.2 Đăng Nhập (Login)
- **Endpoint:** `POST /api/auth/login`
- **Mô tả:** Đăng nhập với email/password và nhận JWT tokens
- **Role:** Public
- **Features:**
  - Verify email và password
  - Generate Access Token (JWT - 3000 seconds)
  - Generate Refresh Token (JWT - 24 hours)
  - Set Refresh Token trong HttpOnly cookie
  - Return Access Token trong response body

### 1.3 Refresh Token
- **Endpoint:** `POST /api/auth/refresh`
- **Mô tả:** Làm mới Access Token khi hết hạn
- **Role:** Public (cần refresh token trong cookie)
- **Features:**
  - Validate refresh token từ cookie
  - Generate Access Token mới
  - Giữ nguyên Refresh Token

### 1.4 Email Verification
- **Endpoint:** `GET /api/auth/verify-email?token=xxx`
- **Mô tả:** Xác nhận email sau khi đăng ký
- **Role:** Public
- **Features:**
  - Validate verification token
  - Activate user account
  - Update user status

### 1.5 Resend Verification Email
- **Endpoint:** `GET /api/auth/resend?email=xxx`
- **Mô tả:** Gửi lại email xác nhận
- **Role:** Public

---

## 👤 2. User Profile Management

### 2.1 Create User Profile
- **Endpoint:** GraphQL Mutation `createUserProfile`
- **Role:** USER, EVENT_MANAGER
- **Features:**
  - Tạo profile với username, fullName, bio, avatarId
  - Link với user authentication
  - Set default status: ACTIVE

### 2.2 Update User Profile
- **Endpoint:** `PUT /api/user-profile`
- **Role:** USER, EVENT_MANAGER (owner only)
- **Features:**
  - Update username, fullName, bio, avatarId, email
  - Validate unique username
  - Update timestamp

### 2.3 Get User Profile
- **Endpoint:** GraphQL Query `getUserProfile(userId: ID!)`
- **Role:** Public (anonymous can view)
- **Features:**
  - Get profile details
  - Get post count, comment count, event count
  - Get list of joined events with pagination

### 2.4 Search User Profiles
- **Endpoint:** GraphQL Query `findUserProfiles(page, size, filter)`
- **Role:** Public
- **Features:**
  - Pagination support
  - Filter by criteria (optional)
  - Sort options

---

## 🎯 3. Event Management

### 3.1 Create Event
- **Endpoint:** GraphQL Mutation `createEvent`
- **Role:** EVENT_MANAGER
- **Features:**
  - Create event với name, description, location, date
  - Generate Snowflake ID
  - Set status: PENDING (cần admin approve)
  - Assign creator as EVENT_ADMIN
  - Auto create role in event for creator

### 3.2 Edit Event
- **Endpoint:** GraphQL Mutation `editEvent`
- **Role:** EVENT_MANAGER (owner or admin)
- **Features:**
  - Update event details
  - Update timestamp
  - Validate owner permission

### 3.3 Delete Event
- **Endpoint:** GraphQL Mutation `deleteEvent`
- **Role:** EVENT_MANAGER (owner or admin)
- **Features:**
  - Soft delete hoặc hard delete
  - Cascade delete related data
  - Check if event has active registrations

### 3.4 Approve Event
- **Endpoint:** GraphQL Mutation `approveEvent`
- **Role:** ADMIN only
- **Features:**
  - Change event status: PENDING → ACCEPTED
  - Notify event creator
  - Make event public

### 3.5 Get Event Details
- **Endpoint:** GraphQL Query `getEvent(eventId: ID!)`
- **Role:** Public
- **Features:**
  - Get event info
  - Get member count (from Redis)
  - Get post count (from Redis)
  - Get like count (from Redis)
  - Get creator info
  - Get list posts in event (nested query)

### 3.6 Search Events
- **Endpoint:** GraphQL Query `findEvents(page, size, filter)`
- **Role:** Public
- **Features:**
  - Pagination
  - Filter: status, date, location
  - Sort: createdAt, memberCount, etc.

### 3.7 Dashboard Events
- **Endpoint:** GraphQL Query `dashboardEvents(filter: EventFilter)`
- **Role:** Public
- **Features:**
  - Get recently created events
  - Get trending events (by likes/members)
  - Limit results
  - Filter by date range

---

## 📝 4. Post Management

### 4.1 Create Post
- **Endpoint:** GraphQL Mutation `createPost`
- **Role:** USER (must be event member)
- **Features:**
  - Create post trong event
  - Generate Snowflake ID
  - Link to event
  - Track creator
  - Update event post count in Redis

### 4.2 Edit Post
- **Endpoint:** GraphQL Mutation `editPost`
- **Role:** USER (owner only)
- **Features:**
  - Update post content
  - Update timestamp
  - Validate owner permission

### 4.3 Delete Post
- **Endpoint:** GraphQL Mutation `deletePost`
- **Role:** USER (owner), EVENT_MANAGER (event admin), ADMIN
- **Features:**
  - Delete post
  - Cascade delete comments
  - Update counts in Redis

### 4.4 Get Post Details
- **Endpoint:** GraphQL Query `getPost(postId: ID!)`
- **Role:** Public
- **Features:**
  - Get post content
  - Get comment count (from Redis)
  - Get like count (from Redis)
  - Get creator info
  - Get list comments (nested query)

### 4.5 Search Posts
- **Endpoint:** GraphQL Query `findPosts(page, size, filter)`
- **Role:** Public
- **Features:**
  - Pagination
  - Filter by event, creator, date
  - Sort options

### 4.6 Dashboard Posts
- **Endpoint:** GraphQL Query `dashboardPosts(filter: PostFilter)`
- **Role:** Public
- **Features:**
  - Get recent posts
  - Filter by event IDs
  - Limit results

---

## 💬 5. Comment Management

### 5.1 Create Comment
- **Endpoint:** GraphQL Mutation `createComment`
- **Role:** USER
- **Features:**
  - Comment on post
  - Generate Snowflake ID
  - Link to post
  - Update comment count in Redis
  - Track creator

### 5.2 Edit Comment
- **Endpoint:** GraphQL Mutation `editComment`
- **Role:** USER (owner only)
- **Features:**
  - Update comment content
  - Update timestamp
  - Validate owner permission

### 5.3 Delete Comment
- **Endpoint:** GraphQL Mutation `deleteComment`
- **Role:** USER (owner), EVENT_MANAGER (event admin), ADMIN
- **Features:**
  - Delete comment
  - Update counts in Redis

### 5.4 Get Comments for Post
- **Endpoint:** GraphQL Schema `Post.listComment(page, size)`
- **Role:** Public
- **Features:**
  - Pagination support
  - Get like count for each comment
  - Get creator info

---

## ❤️ 6. Like System

### 6.1 Like
- **Endpoint:** GraphQL Mutation `like(input: LikeInput)`
- **Role:** USER
- **Features:**
  - Like Post, Comment, hoặc Event
  - Store in Redis Set (for fast counting)
  - Store in Database (for persistence)
  - Update like count in Redis
  - Prevent duplicate likes (idempotent)

### 6.2 Unlike
- **Endpoint:** GraphQL Mutation `unlike(input: LikeInput)`
- **Role:** USER
- **Features:**
  - Remove like from Post/Comment/Event
  - Remove from Redis Set
  - Remove from Database
  - Update like count in Redis

### 6.3 Get Like Count
- **Service:** RedisCountService
- **Features:**
  - Get like count cho Post: `likeCount(postId, "post")`
  - Get like count cho Comment: `likeCount(commentId, "comment")`
  - Get like count cho Event: `likeCount(eventId, "event")`
  - Cache in Redis for performance

---

## 📋 7. Event Registration

### 7.1 Register for Event
- **Endpoint:** GraphQL Mutation `registerEvent(eventId: ID!)`
- **Role:** USER
- **Features:**
  - Register to join event
  - Generate registration record
  - Status: PENDING (need approval)
  - Update member count in Redis (after approval)
  - Prevent duplicate registration

### 7.2 Unregister from Event
- **Endpoint:** GraphQL Mutation `unregisterEvent(eventId: ID!)`
- **Role:** USER
- **Features:**
  - Cancel registration
  - Remove from event
  - Update member count in Redis

### 7.3 Approve Registration
- **Endpoint:** GraphQL Mutation `approveRegistration(registrationId: ID!)`
- **Role:** EVENT_MANAGER (event admin)
- **Features:**
  - Change status: PENDING → ACCEPTED
  - Add member to event
  - Update member count in Redis
  - Notify user (optional)

### 7.4 Reject Registration
- **Endpoint:** GraphQL Mutation `rejectRegistration(registrationId: ID!)`
- **Role:** EVENT_MANAGER (event admin)
- **Features:**
  - Change status: PENDING → REJECTED
  - Notify user (optional)

---

## 👨‍💼 8. User Management (Admin)

### 8.1 Ban User
- **Endpoint:** GraphQL Mutation `banUser(userId: ID!)`
- **Role:** ADMIN only
- **Features:**
  - Change user status to BANNED
  - Prevent user login
  - Invalidate all user tokens
  - Log ban action

### 8.2 Unban User
- **Endpoint:** GraphQL Mutation `unbanUser(userId: ID!)`
- **Role:** ADMIN only
- **Features:**
  - Change user status to ACTIVE
  - Allow user login again
  - Log unban action

---

## 📊 9. Analytics & Dashboard

### 9.1 Event Statistics
- Member count (Redis)
- Post count (Redis)
- Like count (Redis)
- Registration status distribution

### 9.2 User Statistics
- Post count (Database)
- Comment count (Database)
- Event count (Database - participated events)

### 9.3 Dashboard Queries
- Recently created events
- Trending events (by engagement)
- Recent posts across events
- Top contributors

---

## 🔒 10. Security Features

### 10.1 JWT Authentication
- Access Token: Short-lived (50 minutes)
- Refresh Token: Long-lived (24 hours)
- Token validation on each request
- Role-based permissions

### 10.2 Authorization Levels
- **Public:** Anyone can access (no token)
- **USER:** Basic authenticated user
- **EVENT_MANAGER:** Can create/manage events
- **ADMIN:** Full system access

### 10.3 Data Validation
- Input validation với Jakarta Validation
- Email format validation
- Password strength requirements
- Unique constraints (email, username)

### 10.4 Security Filters
- JWT Token Filter
- CORS Configuration
- XSS Prevention
- SQL Injection Prevention (JPA)

---

## 🚀 11. Performance Optimizations

### 11.1 Redis Caching
- Cache like counts
- Cache member counts
- Cache post counts
- Cache comment counts
- Fast read operations

### 11.2 Database Optimizations
- Snowflake ID generation (distributed IDs)
- Indexed columns
- Pagination support
- Lazy loading relationships

### 11.3 GraphQL DataLoader
- Batch loading (prepared for future)
- N+1 query prevention
- Efficient nested queries

---

## 📧 12. Email Services

### 12.1 Verification Email
- Send welcome email with verification link
- Resend verification email
- Email templates

### 12.2 Notification Emails (Prepared)
- Event approval notification
- Registration approval notification
- Event reminders

---

## 🗄️ 13. Data Management

### 13.1 Snowflake ID Generator
- Distributed unique ID generation
- Timestamp-based ordering
- No collision guaranteed

### 13.2 Pagination
- Offset-based pagination
- Page info: totalElements, totalPages, hasNext, hasPrevious
- Configurable page size

### 13.3 Filtering & Sorting
- Dynamic filters for queries
- Sort by multiple fields
- Date range filtering

---

## 📝 Summary

**Total Features: 50+ chức năng**

**Breakdown:**
- Authentication & Authorization: 5 features
- User Profile: 4 features  
- Event Management: 7 features
- Post Management: 6 features
- Comment Management: 4 features
- Like System: 3 features
- Event Registration: 4 features
- User Management: 2 features
- Analytics: 3 features
- Security: 4 features
- Performance: 3 features
- Email: 2 features
- Data Management: 3 features

**Tech Stack:**
- Spring Boot 3.5.6 + Java 21
- GraphQL + REST API
- PostgreSQL (Database)
- Redis (Cache)
- JWT Authentication
- MinIO (Object Storage)
