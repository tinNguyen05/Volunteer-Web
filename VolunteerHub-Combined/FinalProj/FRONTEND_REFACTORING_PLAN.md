# 🔄 Frontend Refactoring Plan - Tích Hợp Backend

## 📊 Phân Tích Hiện Trạng

### ❌ Vấn Đề Cần Giải Quyết

1. **localStorage Authentication**: Frontend đang lưu user data trong localStorage thay vì dùng JWT
2. **Mock Data**: Admin pages dùng localStorage để lưu managers, volunteers
3. **Old API Client**: `client.js` đã được thay thế bằng `graphqlClient.js`
4. ✅ **GraphQL Integration**: Đã có GraphQL client hoàn chỉnh
5. **Hardcoded Users**: Admin login với hardcoded credentials (đã được fix)

## ✅ Đã Hoàn Thành

### 1. GraphQL Client Service ✓
- **File:** `frontend/src/api/graphqlClient.js`
- **Features:**
  - GraphQL query/mutation support
  - JWT token management
  - REST API helper methods
  - Automatic Authorization header injection

### 2. Auth Service Refactored ✓
- **File:** `frontend/src/services/authService.js`  
- **Integration:**
  - `POST /api/auth/signup` - Đăng ký
  - `POST /api/auth/login` - Đăng nhập
  - `POST /api/auth/refresh` - Refresh token
  - `POST /api/user-profile` - Tạo profile
  - `PUT /api/user-profile` - Cập nhật profile
  - GraphQL `getUserProfile` query

### 3. Event Service Template ✓
- **Template created** với GraphQL queries/mutations
- Needs to replace existing `eventService.js`

---

## 🔧 Các Bước Tiếp Theo

### Phase 1: Core Services (Priority: HIGH)

#### Step 1.1: Update AuthContext.jsx
```javascript
// BEFORE: localStorage based
const [user, setUser] = useState(null);
localStorage.setItem('vh_user', JSON.stringify(userObj));

// AFTER: JWT + Backend API
import * as authService from '../services/authService';

const login = async (email, password) => {
  try {
    const result = await authService.login(email, password);
    // Store user ID and fetch profile
    const profile = await authService.getUserProfile(result.userId);
    setUser({
      id: result.userId,
      ...profile.data,
      role: result.roles[0] || 'USER',
    });
  } catch (error) {
    throw error;
  }
};
```

#### Step 1.2: Update AuthModal.jsx
```javascript
// Remove hardcoded auth logic
// Replace with:
import * as authService from '../../services/authService';

const handleSignup = async () => {
  try {
    await authService.signup(formData.email, formData.password);
    showNotification('Đăng ký thành công! Kiểm tra email.', 'success');
    switchMode('login');
  } catch (error) {
    setErrors({ email: error.message });
  }
};

const handleLogin = async () => {
  try {
    const result = await authService.login(formData.email, formData.password);
    
    // After login, create profile if needed
    if (!result.hasProfile) {
      // Redirect to profile creation
    } else {
      const profile = await authService.getUserProfile(result.userId);
      login({
        id: result.userId,
        ...profile.data,
      });
    }
  } catch (error) {
    setErrors({ email: error.message });
  }
};
```

#### Step 1.3: Replace eventService.js
- Use template from above
- Add to all event-related components

#### Step 1.4: Create postService.js
```javascript
/**
 * Post Service - GraphQL Integration
 */
import graphqlClient from '../api/graphqlClient';

export const createPost = async (eventId, content) => {
  const mutation = `
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        ok
        id
        message
        createdAt
      }
    }
  `;
  
  const data = await graphqlClient.mutation(mutation, {
    input: { eventId, content }
  });
  
  return data.createPost;
};

export const getPostsByEvent = async (eventId, page = 0, size = 10) => {
  const query = `
    query GetEvent($eventId: ID!) {
      getEvent(eventId: $eventId) {
        listPosts(page: ${page}, size: ${size}) {
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
          }
        }
      }
    }
  `;
  
  const data = await graphqlClient.query(query, { eventId });
  return data.getEvent.listPosts.content;
};

// ... more methods
```

#### Step 1.5: Create commentService.js (similar pattern)

---

### Phase 2: Admin Pages (Priority: MEDIUM)

#### Files to Update:
1. `frontend/src/pages/admin/UserManagement.jsx`
2. `frontend/src/pages/admin/VolunteerList.jsx`

#### Changes:

**UserManagement.jsx**
```javascript
// REMOVE:
const updatedManagers = pendingManagers.map(...)
localStorage.setItem('vh_pending_managers', ...)

// REPLACE WITH:
import graphqlClient from '../../api/graphqlClient';

const handleApprove = async (userId) => {
  try {
    const mutation = `
      mutation UnbanUser($userId: ID!) {
        unbanUser(userId: $userId) {
          ok
          message
        }
      }
    `;
    
    await graphqlClient.mutation(mutation, { userId });
    showNotification('Đã phê duyệt thành công', 'success');
    // Refresh list
    fetchUsers();
  } catch (error) {
    showNotification(error.message, 'error');
  }
};

const handleBan = async (userId) => {
  try {
    const mutation = `
      mutation BanUser($userId: ID!) {
        banUser(userId: $userId) {
          ok
          message
        }
      }
    `;
    
    await graphqlClient.mutation(mutation, { userId });
    showNotification('Đã khóa tài khoản', 'success');
    fetchUsers();
  } catch (error) {
    showNotification(error.message, 'error');
  }
};
```

**VolunteerList.jsx** - Similar pattern

---

### Phase 3: Components Update (Priority: MEDIUM)

#### Header.jsx
```javascript
// Update logout
const handleLogout = () => {
  authService.logout();
  logout(); // from AuthContext
  navigate('/');
};
```

#### Dashboard.jsx
```javascript
// Fetch real stats from backend
import { getDashboardEvents } from '../../services/eventService';
import { getUserProfile } from '../../services/authService';

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const events = await getDashboardEvents(5);
      const profile = await getUserProfile(user.id);
      
      setStats([
        { label: 'Sự kiện', value: profile.data.eventCount },
        { label: 'Bài viết', value: profile.data.postCount },
        { label: 'Bình luận', value: profile.data.commentCount },
      ]);
    } catch (error) {
      console.error(error);
    }
  };
  
  fetchDashboardData();
}, [user]);
```

---

### Phase 4: Remove Dead Code (Priority: LOW)

#### Files to Delete:
- `frontend/src/api/client.js` (replaced by graphqlClient.js)
- `frontend/src/services/toastService.js` (if not used)
- Any mock data files

#### localStorage Keys to Remove:
- `vh_user`
- `vh_pending_managers`
- `vh_volunteers`
- `vh_session`
- `token`

**Keep only:**
- `vh_access_token` (for JWT)

---

## 🧪 Testing Plan

### Test 1: Authentication Flow
```bash
# 1. Signup
POST http://localhost:8080/api/auth/signup
Body: {"email": "test@example.com", "password": "Test@123"}

# 2. Login
POST http://localhost:8080/api/auth/login
Body: {"email": "test@example.com", "password": "Test@123"}
# Expect: accessToken in response

# 3. Create Profile
POST http://localhost:8080/api/user-profile
Header: Authorization: Bearer <token>
Body: {"username": "testuser", "fullName": "Test User", ...}
```

### Test 2: Event Flow
```javascript
// 1. Get events list
const events = await getAllEvents(0, 10);

// 2. Get event details
const event = await getEventById(events.data[0].eventId);

// 3. Register for event
await registerForEvent(event.data.eventId);
```

### Test 3: Post & Comment Flow
```javascript
// 1. Create post
const post = await createPost(eventId, "Hello!");

// 2. Create comment
await createComment(post.id, "Nice post!");

// 3. Like post
await likePost(post.id);
```

---

## 🚀 Launch Checklist

- [ ] Update all services (auth, event, post, comment)
- [ ] Update AuthContext to use real API
- [ ] Update AuthModal for signup/login
- [ ] Remove localStorage mock data
- [ ] Update admin pages to use GraphQL mutations
- [ ] Test authentication flow end-to-end
- [ ] Test event creation and registration
- [ ] Test post/comment creation
- [ ] Test like functionality
- [ ] Remove old client.js
- [ ] Clean up unused code
- [ ] Test on fresh browser (no localStorage)
- [ ] Verify JWT refresh works
- [ ] Test role-based permissions

---

## 📝 Implementation Priority

### Must Have (Week 1)
1. ✅ GraphQL Client
2. ✅ Auth Service
3. ⏳ Update AuthContext
4. ⏳ Update AuthModal
5. ⏳ Event Service
6. ⏳ Post Service

### Should Have (Week 2)
7. Comment Service
8. Like Service  
9. Admin pages GraphQL integration
10. Dashboard real data

### Nice to Have (Week 3)
11. File upload for avatars
12. Real-time notifications
13. Email verification flow
14. Password reset

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
**Solution:** Backend có CORS configuration, check `application.yml`

### Issue 2: JWT Expired
**Solution:** Implement auto-refresh with `authService.refreshToken()`

### Issue 3: GraphQL Error "Unauthorized"
**Solution:** Check Authorization header format: `Bearer <token>`

### Issue 4: Cookie not sent
**Solution:** Use `credentials: 'include'` in fetch

---

## 📚 API Reference

### REST Endpoints
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/user-profile`
- `PUT /api/user-profile`

### GraphQL Queries
- `getUserProfile(userId: ID!)`
- `getEvent(eventId: ID!)`
- `getPost(postId: ID!)`
- `findEvents(page, size, filter)`
- `findPosts(page, size, filter)`
- `dashboardEvents(filter)`
- `dashboardPosts(filter)`

### GraphQL Mutations
- `createEvent(input: CreateEventInput!)`
- `editEvent(input: EditEventInput!)`
- `deleteEvent(eventId: ID!)`
- `registerEvent(eventId: ID!)`
- `createPost(input: CreatePostInput!)`
- `createComment(input: CreateCommentInput!)`
- `like(input: LikeInput!)`
- `unlike(input: LikeInput!)`
- `banUser(userId: ID!)`
- `unbanUser(userId: ID!)`

Xem chi tiết trong `GRAPHQL_TESTING_GUIDE.md`
