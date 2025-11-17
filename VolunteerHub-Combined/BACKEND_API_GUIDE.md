# VolunteerHub Backend API Documentation

## 📋 Mục Lục
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Toast Notifications](#toast-notifications)

---

## 🚀 Installation

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env .env

# Start development server
npm run dev

# Or start production server
npm start
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Update API_BASE_URL in src/api/client.js if needed
# Start development server
npm run dev
```

---

## ⚙️ Configuration

### Backend .env Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/volunteer_hub

# JWT
JWT_SECRET=your_jwt_secret_key_here_min_32_chars_required
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:5173
```

### Database Setup

1. **Install MongoDB**:
   - Windows: Download từ https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: `sudo apt-get install mongodb`

2. **Start MongoDB**:
   ```bash
   # Windows
   mongod
   
   # Mac/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123",
  "phone": "0912345678",
  "role": "volunteer" // optional: volunteer, manager, admin
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "toastType": "success",
  "data": {
    "user": { ...user data },
    "token": "jwt_token_here"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "toastType": "success",
  "data": {
    "user": { ...user data },
    "token": "jwt_token_here"
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": { ...user data }
  }
}
```

#### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Name",
  "phone": "0987654321",
  "address": "123 Main St",
  "bio": "Volunteer bio",
  "avatar": "image_url"
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { ...updated user data }
  }
}
```

---

### Events (`/api/events`)

#### Get All Events
```
GET /api/events/all?page=1&limit=10&category=Education&search=health
Content-Type: application/json

Response (200):
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": {
    "events": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 5
    }
  }
}
```

#### Get Event by ID
```
GET /api/events/{eventId}

Response (200):
{
  "success": true,
  "message": "Event retrieved successfully",
  "data": {
    "event": { ...event data }
  }
}
```

#### Create Event
```
POST /api/events/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Event Title",
  "description": "Event description...",
  "category": "Education",
  "date": "2024-12-20",
  "startTime": "09:00",
  "endTime": "17:00",
  "location": "Hanoi, Vietnam",
  "capacity": 50,
  "image": "image_url",
  "skills": ["leadership", "teaching"],
  "requirements": ["age >= 18"],
  "impact": "Help 100 students"
}

Response (201):
{
  "success": true,
  "message": "Event created successfully",
  "toastType": "success",
  "data": {
    "event": { ...event data }
  }
}
```

#### Register for Event
```
POST /api/events/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "eventId": "507f1f77bcf86cd799439011"
}

Response (201):
{
  "success": true,
  "message": "Registered for event successfully",
  "toastType": "success",
  "data": {
    "registration": { ...registration data }
  }
}
```

#### Approve Event
```
POST /api/events/{eventId}/approve
Authorization: Bearer {token}
Content-Type: application/json

{
  "approvalStatus": "approved" // or "rejected"
}

Response (200):
{
  "success": true,
  "message": "Event approved successfully",
  "data": {
    "event": { ...updated event data }
  }
}
```

---

### Blood Donation (`/api/blood-donation`)

#### Register Donation
```
POST /api/blood-donation/register
Content-Type: application/json

{
  "donorName": "Nguyễn Văn B",
  "donorEmail": "donor@example.com",
  "donorPhone": "0923456789",
  "bloodType": "O+",
  "lastDonationDate": "2024-01-15",
  "preferredEventDate": "nov25"
}

Response (201):
{
  "success": true,
  "message": "Blood donation registration successful. We will contact you soon!",
  "toastType": "success",
  "data": {
    "donation": { ...donation data }
  }
}
```

#### Get Blood Statistics
```
GET /api/blood-donation/statistics

Response (200):
{
  "success": true,
  "message": "Blood statistics retrieved successfully",
  "data": {
    "statistics": [
      { _id: "O+", count: 25 },
      { _id: "A+", count: 15 }
    ],
    "totalDonors": 100,
    "completedDonations": 75
  }
}
```

---

### Membership (`/api/membership`)

#### Register Membership
```
POST /api/membership/register
Content-Type: application/json

{
  "fullName": "Nguyễn Văn C",
  "email": "member@example.com",
  "phone": "0934567890",
  "address": "456 Oak Ave",
  "city": "Hanoi",
  "state": "Vietnam",
  "zipCode": "100000",
  "membershipType": "basic", // or premium, vip
  "interests": ["education", "environment"],
  "bio": "Passionate volunteer",
  "acceptTerms": true
}

Response (201):
{
  "success": true,
  "message": "Membership application submitted successfully! Check your email for verification.",
  "toastType": "success",
  "data": {
    "membership": { ...membership data }
  }
}
```

#### Get Membership Statistics
```
GET /api/membership/statistics

Response (200):
{
  "success": true,
  "message": "Membership statistics retrieved successfully",
  "data": {
    "stats": {
      "total": 100,
      "active": 85,
      "pending": 10,
      "inactive": 5
    },
    "typeStats": [
      { _id: "basic", count: 60 },
      { _id: "premium", count: 30 }
    ]
  }
}
```

---

## 🔐 Authentication

### JWT Token Usage

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Storage (Frontend)

```javascript
// In localStorage
localStorage.setItem('token', jwtToken)

// Retrieve when needed
const token = localStorage.getItem('token')
```

### Auto-logout on Token Expiration

```javascript
// Check token expiration
const isTokenExpired = () => {
  const token = localStorage.getItem('token')
  if (!token) return true
  
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]))
    return decoded.exp * 1000 < Date.now()
  } catch {
    return true
  }
}
```

---

## ⚠️ Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "toastType": "error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict
- **500**: Server Error

### Frontend Error Handling

```javascript
try {
  const result = await apiClient.login(email, password)
  if (result.success) {
    showToast(result.message, result.toastType)
  }
} catch (error) {
  showToast(error.message, error.toastType)
  if (error.errors) {
    console.log('Validation errors:', error.errors)
  }
}
```

---

## 🎯 Toast Notifications

### Types of Toasts

```javascript
// Success
showToast('Operation completed successfully', 'success')

// Error
showToast('An error occurred', 'error')

// Warning
showToast('Please check your input', 'warning')

// Info
showToast('Here is some information', 'info')
```

### Auto-dismiss Duration

```javascript
// Auto-dismiss after 3 seconds (default)
showToast(message, type)

// Auto-dismiss after custom duration
showToast(message, type, 5000)

// Manual dismiss only
showToast(message, type, 0)
```

### Using Toast Service

```javascript
import { useToast } from '@/components/Toast'
import apiClient from '@/api/client'

export default function MyComponent() {
  const { showToast } = useToast()

  const handleLogin = async (email, password) => {
    try {
      const result = await apiClient.login(email, password)
      showToast(result.message, result.toastType)
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  return (
    // component JSX
  )
}
```

---

## 🔗 Frontend Integration Example

### Using API Client in Components

```javascript
import { useState } from 'react'
import { useToast } from '@/components/Toast'
import apiClient from '@/api/client'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { showToast } = useToast()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const result = await apiClient.login(email, password)
      showToast(result.message, result.toastType, 3000)
      // Redirect to dashboard
    } catch (error) {
      showToast(error.message, error.toastType, 3000)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

---

## 📚 Role-Based Access Control

### Roles

- **volunteer**: Can register for events, view projects
- **manager**: Can create events, approve volunteers
- **admin**: Full access, can manage users and events

### Protected Routes

```javascript
import { authMiddleware, roleMiddleware } from '@/middlewares/auth'

// Admin only
app.get('/api/users', authMiddleware, roleMiddleware(['admin']), controller)

// Manager or Admin
app.post('/api/events/create', authMiddleware, roleMiddleware(['manager', 'admin']), controller)
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Make sure MongoDB is running on your machine.

### CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**: Update `CLIENT_URL` in backend `.env` file.

### Token Expired

```
Invalid or expired token
```

**Solution**: User needs to login again and get a new token.

### Validation Errors

```
{
  "success": false,
  "message": "Validation Error",
  "errors": [...]
}
```

**Solution**: Check the `errors` array for specific field validation failures.

---

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Last Updated**: November 15, 2025  
**Version**: 1.0.0
