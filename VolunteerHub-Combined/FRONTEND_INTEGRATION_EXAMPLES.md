/**
 * Example: How to Use Backend API with Toast Notifications
 * in React Components
 */

import { useState } from 'react'
import { useToast, ToastContainer } from '@/components/Toast'
import apiClient from '@/api/client'

// ============================================
// EXAMPLE 1: Login Component
// ============================================
export function LoginExample() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { toasts, showToast, removeToast } = useToast()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await apiClient.login(email, password)
      
      if (result.success) {
        showToast(result.message, result.toastType, 3000)
        // Redirect to dashboard
        window.location.href = '/dashboard'
      }
    } catch (error) {
      showToast(error.message, error.toastType, 4000)
      console.error('Login errors:', error.errors)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </>
  )
}

// ============================================
// EXAMPLE 2: Event Registration Component
// ============================================
export function EventRegistrationExample() {
  const [loading, setLoading] = useState(false)
  const { toasts, showToast, removeToast } = useToast()

  const handleRegisterEvent = async (eventId) => {
    setLoading(true)

    try {
      const result = await apiClient.registerForEvent(eventId)
      
      showToast(result.message, result.toastType, 3000)
      
      if (result.success) {
        // Refresh event list or update UI
        console.log('Registered:', result.data)
      }
    } catch (error) {
      showToast(error.message, error.toastType, 4000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <button onClick={() => handleRegisterEvent('event_id')} disabled={loading}>
        {loading ? 'Đang đăng ký...' : 'Đăng ký sự kiện'}
      </button>
    </>
  )
}

// ============================================
// EXAMPLE 3: Blood Donation Registration
// ============================================
export function BloodDonationExample() {
  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    bloodType: 'O+',
    lastDonationDate: '',
    preferredEventDate: 'nov25'
  })
  const [loading, setLoading] = useState(false)
  const { toasts, showToast, removeToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await apiClient.registerBloodDonation(formData)
      
      showToast(result.message, result.toastType, 3000)
      
      if (result.success) {
        // Reset form
        setFormData({
          donorName: '',
          donorEmail: '',
          donorPhone: '',
          bloodType: 'O+',
          lastDonationDate: '',
          preferredEventDate: 'nov25'
        })
      }
    } catch (error) {
      showToast(error.message, error.toastType, 4000)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="donorName"
          value={formData.donorName}
          onChange={handleChange}
          placeholder="Họ tên"
          required
        />
        <input
          type="email"
          name="donorEmail"
          value={formData.donorEmail}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="tel"
          name="donorPhone"
          value={formData.donorPhone}
          onChange={handleChange}
          placeholder="Điện thoại"
          required
        />
        <select
          name="bloodType"
          value={formData.bloodType}
          onChange={handleChange}
        >
          <option>O+</option>
          <option>O-</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>AB+</option>
          <option>AB-</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Đăng ký hiến máu'}
        </button>
      </form>
    </>
  )
}

// ============================================
// EXAMPLE 4: Membership Registration
// ============================================
export function MembershipExample() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    membershipType: 'basic',
    interests: [],
    acceptTerms: false
  })
  const [loading, setLoading] = useState(false)
  const { toasts, showToast, removeToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.acceptTerms) {
      showToast('Vui lòng chấp nhận điều khoản', 'warning', 3000)
      return
    }

    setLoading(true)

    try {
      const result = await apiClient.registerMembership(formData)
      
      showToast(result.message, result.toastType, 3000)
      
      if (result.success) {
        // Reset or redirect
        console.log('Membership registered:', result.data)
      }
    } catch (error) {
      showToast(error.message, error.toastType, 4000)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Họ tên"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Điện thoại"
          required
        />
        <select
          name="membershipType"
          value={formData.membershipType}
          onChange={handleChange}
        >
          <option value="basic">Cơ bản</option>
          <option value="premium">Premium</option>
          <option value="vip">VIP</option>
        </select>
        <label>
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
          />
          Tôi chấp nhận điều khoản
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Đăng ký thành viên'}
        </button>
      </form>
    </>
  )
}

// ============================================
// EXAMPLE 5: Fetch Events List
// ============================================
export function EventListExample() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const { toasts, showToast, removeToast } = useToast()

  const fetchEvents = async () => {
    setLoading(true)

    try {
      const result = await apiClient.getAllEvents(1, 10, { category: 'Education' })
      
      if (result.success) {
        setEvents(result.data.events)
        showToast('Tải danh sách thành công', 'success', 2000)
      } else {
        showToast(result.message, 'error', 3000)
      }
    } catch (error) {
      showToast(error.message, 'error', 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <button onClick={fetchEvents} disabled={loading}>
        {loading ? 'Đang tải...' : 'Tải danh sách'}
      </button>
      <div>
        {events.map(event => (
          <div key={event._id} className="event-card">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
          </div>
        ))}
      </div>
    </>
  )
}

// ============================================
// EXAMPLE 6: Update User Profile
// ============================================
export function UpdateProfileExample() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    bio: ''
  })
  const [loading, setLoading] = useState(false)
  const { toasts, showToast, removeToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await apiClient.updateProfile(formData)
      
      showToast(result.message, result.toastType, 3000)
      
      if (result.success) {
        console.log('Profile updated:', result.data.user)
      }
    } catch (error) {
      showToast(error.message, error.toastType, 4000)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tên"
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Điện thoại"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Địa chỉ"
        />
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tiểu sử"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
        </button>
      </form>
    </>
  )
}

// ============================================
// EXAMPLE 7: Use Toast Everywhere
// ============================================
export function GlobalToastExample() {
  const { showToast } = useToast()

  const demonstrateToasts = () => {
    showToast('✅ Thành công!', 'success', 3000)
    setTimeout(() => {
      showToast('❌ Lỗi xảy ra', 'error', 3000)
    }, 1000)
    setTimeout(() => {
      showToast('⚠️ Cảnh báo', 'warning', 3000)
    }, 2000)
    setTimeout(() => {
      showToast('ℹ️ Thông tin', 'info', 3000)
    }, 3000)
  }

  return (
    <button onClick={demonstrateToasts}>
      Demo Toast
    </button>
  )
}

export default {
  LoginExample,
  EventRegistrationExample,
  BloodDonationExample,
  MembershipExample,
  EventListExample,
  UpdateProfileExample,
  GlobalToastExample
}
