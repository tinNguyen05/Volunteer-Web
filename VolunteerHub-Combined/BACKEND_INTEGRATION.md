# 🔌 Backend Integration Guide

## Chuẩn Bị Kết Nối Backend

Hướng dẫn này giúp bạn kết nối ứng dụng với backend API thực.

---

## 📋 Hiện Tại (Mock Data - Development)

```javascript
// AuthContext.jsx - Current Mock Implementation
const login = (userObj) => {
  setUser(userObj);
  localStorage.setItem('vh_user', JSON.stringify(userObj));
};

// Input: Mock user object
// Output: Saved to localStorage
// No API call
```

---

## 🎯 Mục Tiêu (Real Backend)

```javascript
// AuthContext.jsx - Real Implementation
const login = async (credentials) => {
  const response = await loginAPI(credentials);  // API call
  const user = response.data.user;               // Get user
  const token = response.data.token;             // Get JWT token
  
  setUser(user);
  localStorage.setItem('vh_user', JSON.stringify(user));
  localStorage.setItem('auth_token', token);     // Store JWT
};
```

---

## 🔧 Step-by-Step Integration

### Step 1: Setup API Folder

Backend API calls already organized in `src/api/`:

```
src/api/
├── authApi.js        ← Login/Register endpoints
├── userApi.js        ← User management
├── eventApi.js       ← Event operations
├── dashboardApi.js   ← Dashboard data
├── axiosClient.js    ← Axios instance
```

### Step 2: Configure Axios Client

File: `src/api/axiosClient.js`

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
axiosClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle responses
axiosClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired, logout
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
```

### Step 3: Update Auth API

File: `src/api/authApi.js`

```javascript
import axiosClient from './axiosClient';

// Login
export const loginUser = async (email, password, role) => {
  const response = await axiosClient.post('/auth/login', {
    email,
    password,
    role,
  });
  return response.data;
};

// Register/Signup
export const registerUser = async (email, password, name, role) => {
  const response = await axiosClient.post('/auth/register', {
    email,
    password,
    name,
    role,
  });
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await axiosClient.get('/auth/me');
  return response.data;
};

// Logout
export const logoutUser = async () => {
  await axiosClient.post('/auth/logout');
};
```

### Step 4: Update AuthContext

File: `src/contexts/AuthContext.jsx`

```javascript
import { loginUser, registerUser, getCurrentUser } from '../api/authApi';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData.user);
        } catch (err) {
          console.error('Failed to load user:', err);
          localStorage.clear();
        }
      }
    };
    loadUser();
  }, []);

  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(email, password, role);
      
      // Save user and token
      setUser(response.user);
      localStorage.setItem('vh_user', JSON.stringify(response.user));
      localStorage.setItem('auth_token', response.token);
      
      setIsAuthOpen(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerUser(email, password, name, role);
      
      // Save user and token
      setUser(response.user);
      localStorage.setItem('vh_user', JSON.stringify(response.user));
      localStorage.setItem('auth_token', response.token);
      
      setIsAuthOpen(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  // ... rest of context
}
```

### Step 5: Update Components to Use New Auth

File: `src/components/AuthModal.jsx`

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  setIsLoading(true);
  
  try {
    if (authMode === 'signup') {
      await login(formData.email, formData.password, formData.fullname, selectedRole);
    } else {
      await login(formData.email, formData.password, selectedRole);
    }
    
    setFormData({ email: '', password: '', confirmPassword: '', agreeTerms: false });
    navigate('/dashboard');
  } catch (err) {
    setErrors({ submit: err.message });
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🌐 Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=VolunteerHub
VITE_APP_VERSION=1.0.0
```

Use in code:

```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## 📊 Expected Backend Response Format

### Login Response

```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "volunteer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid credentials",
  "code": "AUTH_FAILED"
}
```

---

## 🔐 JWT Token Management

### Storing Token

```javascript
localStorage.setItem('auth_token', response.token);
```

### Sending Token in Requests

```javascript
// Automatically added by interceptor
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

### Refreshing Token

```javascript
// Add token refresh logic
axiosClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const response = await axiosClient.post('/auth/refresh');
        localStorage.setItem('auth_token', response.data.token);
        return axiosClient(originalRequest);
      } catch (err) {
        // Logout user
        localStorage.clear();
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);
```

---

## 📝 Implementation Checklist

### Before Integration
- [ ] Backend API endpoints ready
- [ ] API documentation reviewed
- [ ] Response format confirmed
- [ ] JWT implementation planned
- [ ] Database models created

### During Integration
- [ ] Update `axiosClient.js`
- [ ] Update `authApi.js`
- [ ] Update `AuthContext.jsx`
- [ ] Update `AuthModal.jsx`
- [ ] Update `Login.jsx`
- [ ] Update `Register.jsx`

### Testing
- [ ] Test login with real credentials
- [ ] Test register new user
- [ ] Test token storage
- [ ] Test logout
- [ ] Test expired token
- [ ] Test API error handling

### After Integration
- [ ] Remove mock data
- [ ] Add loading states
- [ ] Add error notifications
- [ ] Test all flows
- [ ] Deploy to staging

---

## 🛠️ Common Backend Endpoints

Your backend should provide:

```
POST   /api/auth/login          → Login user
POST   /api/auth/register       → Register user
POST   /api/auth/logout         → Logout
GET    /api/auth/me             → Get current user
POST   /api/auth/refresh        → Refresh token

GET    /api/users               → Get all users
GET    /api/users/:id           → Get user
PUT    /api/users/:id           → Update user
DELETE /api/users/:id           → Delete user

GET    /api/events              → Get all events
POST   /api/events              → Create event
GET    /api/events/:id          → Get event
PUT    /api/events/:id          → Update event
DELETE /api/events/:id          → Delete event

GET    /api/dashboard           → Get dashboard data
```

---

## 🐛 Error Handling

```javascript
// Global error handler in axiosClient
axiosClient.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || error.message;
    const status = error.response?.status;
    
    console.error(`Error [${status}]:`, message);
    
    if (status === 401) {
      // Unauthorized - redirect to login
    } else if (status === 403) {
      // Forbidden - no access
    } else if (status === 404) {
      // Not found
    } else if (status >= 500) {
      // Server error
    }
    
    return Promise.reject(error);
  }
);
```

---

## ✅ Final Steps

1. **Replace Mock Login**
   - Replace `AuthModal.jsx` handleSubmit to use real API

2. **Remove localStorage Mock**
   - Remove mock user creation
   - Use real API responses

3. **Test Everything**
   - Login with real credentials
   - Test all protected routes
   - Test error scenarios

4. **Add Loading States**
   - Show loading during API calls
   - Disable buttons during loading

5. **Deploy**
   - Update API URL in `.env`
   - Build and deploy

---

## 📚 Additional Resources

- [Axios Documentation](https://axios-http.com/)
- [JWT.io](https://jwt.io/)
- [React Context API](https://react.dev/reference/react/useContext)
- [HTTP Status Codes](https://httpwg.org/specs/rfc9110.html)

---

## 🎯 Timeline Example

| Phase | Duration | Tasks |
|-------|----------|-------|
| Setup | 1 day | Configure API, Environment |
| Integration | 2-3 days | Update Auth, Test flows |
| Testing | 1-2 days | QA, Bug fixes |
| Deployment | 1 day | Deploy to production |

---

**Ready to connect to backend! 🚀**

For questions or issues, refer to API documentation or backend team.
