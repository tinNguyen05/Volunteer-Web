import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import '../styles/Auth.css'

export default function AuthModal() {
  const { isAuthOpen, authMode, closeAuth, switchMode, login, addPendingManager, pendingManagers, addVolunteer, registeredVolunteers } = useAuth()
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState('volunteer')
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    // Manager only field
    phone: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Fullname validation (signup only)
    if (authMode === 'signup' && !formData.fullname) {
      newErrors.fullname = 'Họ tên là bắt buộc'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    // Confirm password validation (signup only)
    if (authMode === 'signup') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu không khớp'
      }

      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản'
      }

      // Manager-specific validation
      if (selectedRole === 'manager') {
        if (!formData.phone) newErrors.phone = 'Số điện thoại là bắt buộc'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      if (authMode === 'signup') {
        if (selectedRole === 'volunteer') {
          // Volunteer registration - save account
          const volunteerData = {
            id: Date.now(),
            name: formData.fullname,
            email: formData.email,
            password: formData.password,
            role: 'volunteer',
            approved: true,
            createdAt: new Date().toISOString()
          }
          
          addVolunteer(volunteerData)
          
          // Clear form
          setFormData({
            fullname: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeTerms: false,
            phone: ''
          })
          
          showNotification('Đăng ký thành công! Vui lòng đăng nhập.', 'success')
          setIsLoading(false)
          switchMode('login')
          
        } else if (selectedRole === 'manager') {
          // Manager registration - needs approval
          const managerData = {
            id: Date.now(),
            name: formData.fullname,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            role: 'manager',
            approved: false,
            createdAt: new Date().toISOString()
          }
          
          addPendingManager(managerData)
          
          // Clear form
          setFormData({
            fullname: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeTerms: false,
            phone: ''
          })
          
          showNotification('Đơn đăng ký của bạn đã được gửi. Vui lòng đợi admin phê duyệt.', 'success')
          setIsLoading(false)
          closeAuth()
        }
      } else {
        // Login - Check role and validate credentials
        if (selectedRole === 'admin') {
          // Admin login - only allow admin account
          if (formData.email !== 'admin@gmail.com' || formData.password !== '123123') {
            setErrors({ email: 'Email hoặc mật khẩu không đúng', password: 'Email hoặc mật khẩu không đúng' })
            setIsLoading(false)
            return
          }
          
          const userObj = {
            id: 'admin-001',
            name: 'Administrator',
            email: formData.email,
            role: 'admin',
            approved: true
          }
          
          login(userObj)
          showNotification('Đăng nhập thành công!', 'success')
          setIsLoading(false)
          closeAuth()
          
        } else if (selectedRole === 'manager') {
          // Manager login - check if account exists and is approved
          const manager = pendingManagers.find(m => 
            m.email === formData.email && 
            m.password === formData.password
          );
          
          if (!manager) {
            setErrors({ email: 'Email hoặc mật khẩu không đúng', password: 'Email hoặc mật khẩu không đúng' });
            setIsLoading(false);
            return;
          }
          
          if (manager.locked) {
            setErrors({ email: 'Tài khoản đã bị khóa' });
            setIsLoading(false);
            return;
          }
          
          if (!manager.approved) {
            setErrors({ email: 'Tài khoản chưa được admin phê duyệt' });
            setIsLoading(false);
            return;
          }
          
          const userObj = {
            id: manager.id,
            name: manager.name,
            email: manager.email,
            phone: manager.phone,
            role: 'manager',
            approved: true
          }
          
          login(userObj)
          showNotification('Đăng nhập thành công!', 'success')
          setIsLoading(false)
          closeAuth()
          
        } else {
          // Volunteer login - check if account exists
          const volunteer = registeredVolunteers.find(v => 
            v.email === formData.email && 
            v.password === formData.password
          );
          
          if (!volunteer) {
            setErrors({ email: 'Email hoặc mật khẩu không đúng', password: 'Email hoặc mật khẩu không đúng' });
            setIsLoading(false);
            return;
          }
          
          if (volunteer.locked) {
            setErrors({ email: 'Tài khoản đã bị khóa' });
            setIsLoading(false);
            return;
          }
          
          const userObj = {
            id: volunteer.id,
            name: volunteer.name,
            email: volunteer.email,
            role: 'volunteer',
            approved: true
          }
          
          login(userObj)
          showNotification('Đăng nhập thành công!', 'success')
          setIsLoading(false)
          closeAuth()
        }
      }
    }, 1000)
  }

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`)
    // Implement social login logic
  }

  return (
    <>
      {isAuthOpen && (
        <div
          className="auth-overlay"
          onClick={closeAuth}
        >
          <div
            className="auth-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Column - Info & Image */}
            <div className="auth-left">
              <div className="auth-left-content">
                <h2 className="auth-title">
                  Bạn có quan tâm đến
                  <span className="highlight-green"> tình nguyện</span> trồng cây?
                </h2>

                <ul className="auth-checklist">
                  <li>Có lịch trống vào ngày bạn chọn</li>
                  <li>Đủ điều kiện tham gia dự án tình nguyện</li>
                  <li><strong>Không yêu cầu kinh nghiệm tình nguyện trước đó</strong></li>
                </ul>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="auth-right">
              <button className="auth-close" onClick={closeAuth}>✕</button>

              <form onSubmit={handleSubmit} className="auth-form">
                <h3 className="auth-form-title">
                  {authMode === 'signup' ? 'Tạo tài khoản' : 'Chào mừng trở lại'}
                </h3>

                {/* Fullname Input (Signup Only) */}
                {authMode === 'signup' && (
                  <div className="form-group">
                    <input
                      type="text"
                      name="fullname"
                      placeholder="Họ và tên"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      className={`form-input ${errors.fullname ? 'error' : ''}`}
                    />
                    {errors.fullname && <span className="error-text">{errors.fullname}</span>}
                  </div>
                )}

                {/* Email Input */}
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Nhập email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                {/* Password Input */}
                <div className="form-group">
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Nhập mật khẩu"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                {/* Confirm Password (Signup Only) */}
                {authMode === 'signup' && (
                  <div className="form-group">
                    <div className="password-wrapper">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Xác nhận mật khẩu"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                  </div>
                )}

                {/* Role Selector - For both Signup and Login */}
                <div className="form-group">
                  <label className="form-label">
                    {authMode === 'signup' ? 'Đăng ký với vai trò:' : 'Đăng nhập với vai trò:'}
                  </label>
                  <div className="role-selector">
                    <button
                      type="button"
                      className={`role-btn ${selectedRole === 'volunteer' ? 'active' : ''}`}
                      onClick={() => setSelectedRole('volunteer')}
                    >
                      Volunteer
                    </button>
                    <button
                      type="button"
                      className={`role-btn ${selectedRole === 'manager' ? 'active' : ''}`}
                      onClick={() => setSelectedRole('manager')}
                    >
                      Manager
                    </button>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        className={`role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
                        onClick={() => setSelectedRole('admin')}
                      >
                        Admin
                      </button>
                    )}
                  </div>
                </div>

                {/* Manager-specific fields - only phone number */}
                {authMode === 'signup' && selectedRole === 'manager' && (
                  <div className="form-group">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Số điện thoại"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                )}

                {/* Terms & Conditions (Signup Only) */}
                {authMode === 'signup' && (
                  <div className="form-group checkbox-group">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className={`form-checkbox ${errors.agreeTerms ? 'error' : ''}`}
                    />
                    <label htmlFor="agreeTerms" className="checkbox-label">
                      Bằng việc đăng ký, bạn đồng ý với
                      <a href="#terms" className="link-primary"> điều khoản sử dụng</a> và
                      <a href="#privacy" className="link-primary"> chính sách bảo mật</a> của chúng tôi.
                    </label>
                  </div>
                )}
                {errors.agreeTerms && <span className="error-text">{errors.agreeTerms}</span>}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-signup"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang xử lý...' : authMode === 'signup' ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP'}
                </button>

                {/* Social Logins */}
                <div className="social-divider">
                  <span>Hoặc {authMode === 'signup' ? 'đăng ký' : 'đăng nhập'} với</span>
                </div>

                <div className="social-buttons">
                  <a
                    href="http://localhost:5000/api/auth/google"
                    className="btn-social btn-google"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </a>
                </div>

                {/* Switch Mode Link */}
                <div className="auth-switch">
                  {authMode === 'signup' ? (
                    <>
                      Đã có tài khoản?{' '}
                      <button
                        type="button"
                        className="link-switch"
                        onClick={() => switchMode('login')}
                      >
                        Đăng nhập
                      </button>
                    </>
                  ) : (
                    <>
                      Chưa có tài khoản?{' '}
                      <button
                        type="button"
                        className="link-switch"
                        onClick={() => switchMode('signup')}
                      >
                        Đăng ký
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>

            {/* Right Sidebar */}
            <div className="auth-sidebar"></div>
          </div>
        </div>
      )}
    </>
  )
}
