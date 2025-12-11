# 🚀 Quick Reference - API Integration Cheatsheet

## 📞 API Calls

### REST Authentication
```javascript
import axiosClient from '../api/axiosClient';

// Login
const data = await axiosClient.post('/auth/login', { email, password });
// → { accessToken, tokenType }

// Signup
const result = await axiosClient.post('/auth/signup', { email, password });

// Refresh
const newToken = await axiosClient.post('/auth/refresh');
```

### GraphQL Queries
```javascript
import graphqlClient from '../api/graphqlClient';

// Get all events
const data = await graphqlClient.query(`
  query FindEvents($page: Int!, $size: Int!) {
    findEvents(page: $page, size: $size) {
      content { eventId, title, memberCount }
    }
  }
`, { page: 0, size: 10 });

// Get event with nested data
const event = await graphqlClient.query(`
  query GetEvent($eventId: ID!) {
    getEvent(eventId: $eventId) {
      title
      listPosts(page: 0, size: 10) {
        content {
          postId
          content
          listComment(page: 0, size: 5) {
            content { commentId, content }
          }
        }
      }
    }
  }
`, { eventId: "773316679898759168" });
```

### GraphQL Mutations
```javascript
// Create post
const result = await graphqlClient.mutation(`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ok
      id
      message
    }
  }
`, { 
  input: { 
    eventId: "773316679898759168", 
    content: "Hello World" 
  } 
});

// Like post
await graphqlClient.mutation(`
  mutation Like($input: LikeInput!) {
    like(input: $input) { ok }
  }
`, { 
  input: { 
    targetType: "POST", 
    targetId: "773316679898759168" 
  } 
});

// Add comment
await graphqlClient.mutation(`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      ok
      id
    }
  }
`, { 
  input: { 
    postId: "773316679898759168", 
    content: "Great post!" 
  } 
});
```

---

## 🎣 Custom Hooks Usage

### Events
```javascript
import { useEvents, useEventDetail } from '../hooks/useEvents';

// List all events
function EventList() {
  const { events, loading, error, refetch } = useEvents(0, 10);
  
  if (loading) return <Spinner />;
  return events.map(e => <EventCard key={e.eventId} {...e} />);
}

// Event detail with posts
function EventDetail() {
  const { eventId } = useParams();
  const { event, posts, loading, refetch } = useEventDetail(eventId);
  
  return (
    <div>
      <h1>{event.title}</h1>
      {posts.map(p => <Post key={p.id} {...p} onUpdate={refetch} />)}
    </div>
  );
}
```

### Posts & Comments
```javascript
import { useCreatePost, useComments } from '../hooks/usePosts';

function PostCreator({ eventId, onSuccess }) {
  const { createNewPost, loading } = useCreatePost();
  const [content, setContent] = useState('');
  
  const handleSubmit = async () => {
    const result = await createNewPost(eventId, 'Title', content);
    if (result.success) {
      setContent('');
      onSuccess();
    }
  };
  
  return (
    <div>
      <textarea value={content} onChange={e => setContent(e.target.value)} />
      <button onClick={handleSubmit} disabled={loading}>Post</button>
    </div>
  );
}

function CommentBox({ postId, onSuccess }) {
  const { createComment, loading } = useComments();
  const [text, setText] = useState('');
  
  const handleComment = async () => {
    const result = await createComment(postId, text);
    if (result.success) {
      setText('');
      onSuccess();
    }
  };
  
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleComment} disabled={loading}>Comment</button>
    </div>
  );
}
```

---

## 🔐 Authentication Context

```javascript
import { useAuth } from '../contexts/AuthContext';

function LoginForm() {
  const { login, user } = useAuth();
  
  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // Auto-redirects based on role:
      // USER → /dashboard
      // EVENT_MANAGER → /manager/events
      // ADMIN → /admin/users
    } catch (error) {
      alert(error.message);
    }
  };
  
  return (
    <div>
      {user ? (
        <p>Welcome {user.username}! Role: {user.role}</p>
      ) : (
        <form onSubmit={handleLogin}>...</form>
      )}
    </div>
  );
}
```

---

## 🐛 Common Errors & Solutions

### Error: "Could not resolve placeholder 'JWT_SECRET'"
**Solution:**
```powershell
$env:JWT_SECRET="mySecretKeyForJWTTokenGenerationAndValidation2024VolunteerHub"
.\gradlew.bat bootRun
```

### Error: CORS blocked
**Solution:** Check `GlobalCorsConfig.java`:
```java
allowedOrigins: http://localhost:5173
```

### Error: 401 Unauthorized
**Solution:**
1. Check token exists: `localStorage.getItem('vh_access_token')`
2. Check header format: `Authorization: Bearer <token>`
3. Try refresh: `axiosClient.post('/auth/refresh')`

### Error: GraphQL "Cannot query field"
**Solution:** Verify query syntax in GraphiQL:
```
http://localhost:8080/graphiql
```

### Error: Empty data
**Solution:**
1. Create test data in backend first
2. Check network tab for response structure
3. Verify field mapping in service

---

## 📊 Data Structure Quick Reference

### Event
```javascript
{
  eventId: "773316679898759168",  // Snowflake ID
  title: "Volunteer Event",
  description: "Help the community",
  location: "Ha Noi",
  startAt: "2025-12-15T10:00:00Z",
  endAt: "2025-12-15T16:00:00Z",
  eventStatus: "APPROVED",  // PENDING, APPROVED, REJECTED, ONGOING, COMPLETED
  memberCount: 50,
  memberLimit: 100,
  postCount: 25,
  likeCount: 120,
  creatorInfo: {
    userId: "uuid-here",
    username: "john_doe",
    avatarId: "avatar.jpg"
  }
}
```

### Post
```javascript
{
  postId: "773316679898759168",
  eventId: "773316679898759168",
  content: "Great event!",
  createdAt: "2025-12-11T10:00:00Z",
  updatedAt: "2025-12-11T10:30:00Z",
  commentCount: 5,
  likeCount: 10,
  creatorInfo: { ... }
}
```

### Comment
```javascript
{
  commentId: "773316679898759168",
  postId: "773316679898759168",
  content: "I agree!",
  createdAt: "2025-12-11T10:05:00Z",
  likeCount: 2,
  creatorInfo: { ... }
}
```

### User Profile
```javascript
{
  userId: "d4e5f6a7-b8c9-0123-def0-4567890123cd",  // UUID
  username: "john_doe",
  email: "john@example.com",
  fullName: "John Doe",
  bio: "Volunteer enthusiast",
  avatarId: "avatar.jpg",
  role: "USER",  // USER, EVENT_MANAGER, ADMIN
  eventCount: 5,
  postCount: 10,
  commentCount: 25
}
```

---

## 🎯 Best Practices

### ✅ DO
- Use `axiosClient` for REST endpoints
- Use `graphqlClient` for data queries
- Use custom hooks for reusable logic
- Check `result.ok` for mutations
- Handle loading/error states
- Use `refetch()` to update UI after mutations
- Store only `accessToken` in localStorage
- Use String for all IDs (never parse to Number)

### ❌ DON'T
- Don't store user object in localStorage
- Don't parse Snowflake IDs to Number
- Don't call API directly in components
- Don't forget to handle errors
- Don't use mock data anymore
- Don't hardcode API URLs

---

## 🔗 Quick Links

**Backend:**
- API: http://localhost:8080/api
- GraphQL: http://localhost:8080/graphql
- GraphiQL: http://localhost:8080/graphiql

**Frontend:**
- Dev Server: http://localhost:5173

**Documentation:**
- Full Guide: ARCHITECTURE_COMPLETE.md
- Testing: TESTING_GUIDE.md
- API Spec: backend/volunteerhub_graphql_api.md

---

## 📞 Need Help?

1. Check ARCHITECTURE_COMPLETE.md for detailed info
2. Run test script: `frontend/graphql-integration-test.js`
3. Check browser Console for errors
4. Verify token in localStorage
5. Test in GraphiQL first

**Happy Coding! 🚀**
