# VolunteerHub GraphQL API Testing Guide

## 🔧 Setup

**GraphQL Endpoint:** `http://localhost:8080/graphql`

Sử dụng một trong các công cụ sau để test:
- GraphQL Playground (nếu được enable)
- Postman
- Insomnia
- curl

## 🔑 Authentication

Để test các mutation cần authentication, thêm header:
```
Authorization: Bearer <accessToken>
```

## 📝 Test Queries

### 1. Query Event với Posts và Comments

```graphql
query GetEventWithPosts {
  getEvent(eventId: "1") {
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
    listPosts(page: 0, size: 5) {
      pageInfo {
        page
        size
        totalElements
        totalPages
        hasNext
      }
      content {
        postId
        content
        createdAt
        commentCount
        likeCount
        creatorInfo {
          userId
          username
          avatarId
        }
        listComment(page: 0, size: 3) {
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
              avatarId
            }
          }
        }
      }
    }
  }
}
```

### 2. Query User Profile với Events

```graphql
query GetUserProfile {
  getUserProfile(userId: "your-uuid-here") {
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
    listEvents(page: 0, size: 10) {
      pageInfo {
        page
        size
        totalElements
        totalPages
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

### 3. Query Dashboard - Recent Events

```graphql
query DashboardEvents {
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

### 4. Query Dashboard - Recent Posts

```graphql
query DashboardPosts {
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

### 5. Find Events với Pagination

```graphql
query FindEvents {
  findEvents(page: 0, size: 10) {
    pageInfo {
      page
      size
      totalElements
      totalPages
      hasNext
      hasPrevious
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

### 6. Find Posts với Pagination

```graphql
query FindPosts {
  findPosts(page: 0, size: 10) {
    pageInfo {
      page
      size
      totalElements
      totalPages
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

## ✏️ Test Mutations

### 1. Create Event (EVENT_MANAGER role required)

```graphql
mutation CreateEvent {
  createEvent(input: {
    eventName: "Community Cleanup Day"
    eventDescription: "Join us for a community cleanup event"
    eventLocation: "Central Park"
    eventDate: "2025-12-15T10:00:00"
  }) {
    ok
    id
    message
    createdAt
  }
}
```

### 2. Edit Event (EVENT_MANAGER role required)

```graphql
mutation EditEvent {
  editEvent(input: {
    eventId: "1"
    eventName: "Updated Event Name"
    eventDescription: "Updated description"
    eventLocation: "New Location"
  }) {
    ok
    id
    message
    updatedAt
  }
}
```

### 3. Create Post (USER role required)

```graphql
mutation CreatePost {
  createPost(input: {
    eventId: "1"
    content: "This is my first post about this event!"
  }) {
    ok
    id
    message
    createdAt
  }
}
```

### 4. Edit Post (USER role required)

```graphql
mutation EditPost {
  editPost(input: {
    postId: "123456789"
    content: "Updated post content"
  }) {
    ok
    id
    message
    updatedAt
  }
}
```

### 5. Delete Post (USER role required)

```graphql
mutation DeletePost {
  deletePost(postId: "123456789") {
    ok
    message
  }
}
```

### 6. Create Comment (USER role required)

```graphql
mutation CreateComment {
  createComment(input: {
    postId: "123456789"
    content: "Great post! Thanks for sharing."
  }) {
    ok
    id
    message
    createdAt
  }
}
```

### 7. Edit Comment (USER role required)

```graphql
mutation EditComment {
  editComment(input: {
    commentId: "987654321"
    content: "Updated comment text"
  }) {
    ok
    id
    message
    updatedAt
  }
}
```

### 8. Delete Comment (USER role required)

```graphql
mutation DeleteComment {
  deleteComment(commentId: "987654321") {
    ok
    message
  }
}
```

### 9. Like Post/Comment/Event (USER role required)

```graphql
mutation LikePost {
  like(input: {
    targetType: "post"
    targetId: "123456789"
  }) {
    ok
    message
  }
}

mutation LikeComment {
  like(input: {
    targetType: "comment"
    targetId: "987654321"
  }) {
    ok
    message
  }
}

mutation LikeEvent {
  like(input: {
    targetType: "event"
    targetId: "1"
  }) {
    ok
    message
  }
}
```

### 10. Unlike Post/Comment/Event (USER role required)

```graphql
mutation UnlikePost {
  unlike(input: {
    targetType: "post"
    targetId: "123456789"
  }) {
    ok
    message
  }
}
```

### 11. Register for Event (USER role required)

```graphql
mutation RegisterEvent {
  registerEvent(eventId: "1") {
    ok
    id
    message
    createdAt
  }
}
```

### 12. Unregister from Event (USER role required)

```graphql
mutation UnregisterEvent {
  unregisterEvent(eventId: "1") {
    ok
    message
  }
}
```

### 13. Approve Event (ADMIN role required)

```graphql
mutation ApproveEvent {
  approveEvent(eventId: "1") {
    ok
    id
    message
    updatedAt
  }
}
```

### 14. Approve Registration (EVENT_MANAGER role required)

```graphql
mutation ApproveRegistration {
  approveRegistration(registrationId: "123") {
    ok
    message
  }
}
```

### 15. Reject Registration (EVENT_MANAGER role required)

```graphql
mutation RejectRegistration {
  rejectRegistration(registrationId: "123") {
    ok
    message
  }
}
```

### 16. Ban User (ADMIN role required)

```graphql
mutation BanUser {
  banUser(userId: "user-uuid-here") {
    ok
    message
  }
}
```

### 17. Unban User (ADMIN role required)

```graphql
mutation UnbanUser {
  unbanUser(userId: "user-uuid-here") {
    ok
    message
  }
}
```

### 18. Create User Profile (USER role required)

```graphql
mutation CreateUserProfile {
  createUserProfile(input: {
    username: "john_doe"
    fullName: "John Doe"
    bio: "Passionate about volunteering"
    email: "john@example.com"
  }) {
    ok
    id
    message
    createdAt
  }
}
```

## 🧪 Testing với curl

### Login và lấy accessToken

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

### Query GraphQL với curl

```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "query": "query { getEvent(eventId: \"1\") { eventId eventName } }"
  }'
```

### Mutation với curl

```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "query": "mutation { createPost(input: { eventId: \"1\", content: \"Test post\" }) { ok id message } }"
  }'
```

## 📊 Response Format

### Success Response
```json
{
  "data": {
    "createEvent": {
      "ok": true,
      "id": "773316679898759168",
      "message": "Success",
      "createdAt": "2025-12-09T18:52:12.124Z"
    }
  }
}
```

### Error Response
```json
{
  "data": {
    "editEvent": {
      "ok": false,
      "message": "Event not found"
    }
  }
}
```

### Authentication Error
```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "extensions": {
        "classification": "UNAUTHORIZED"
      }
    }
  ]
}
```

## 💡 Tips

1. **Tạo test user trước**: Sử dụng REST API `/api/auth/signup` để tạo user
2. **Login để lấy token**: Dùng `/api/auth/login` 
3. **Test từng query/mutation riêng lẻ** trước khi test nested queries
4. **Check Redis data**: Verify counts được cache đúng trong Redis
5. **Monitor logs**: Check backend logs để debug issues

## 🔍 Common Issues

### Issue: "Unauthorized" error
- **Solution**: Đảm bảo đã thêm `Authorization: Bearer <token>` header

### Issue: Count trả về 0 hoặc -1
- **Solution**: Kiểm tra Redis đang chạy và data đã được sync

### Issue: "Event not found"
- **Solution**: Tạo Event trước bằng mutation `createEvent`

### Issue: Cannot create post/comment
- **Solution**: Đảm bảo Event đã tồn tại và user có đúng role
