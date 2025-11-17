import React, { useState } from 'react';
import '../../assets/styles/login_register.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// import backgroundImg from '../../assets/images/background.webp'

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('volunteer');
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleRoleClick = (role) => {
    setSelectedRole(role);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullname || !formData.email || !formData.password || !formData.confirmPassword) {
      alert('Vui lòng điền tất cả các trường');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu không khớp');
      return;
    }

    const roleMap = { 'volunteer': 'volunteer', 'manager': 'manager' };
    const role = roleMap[selectedRole] || 'volunteer';

    const userObj = {
      id: Date.now(),
      name: formData.fullname,
      email: formData.email,
      role,
    };

    login(userObj);
    navigate('/dashboard');
  };

  const handleLogin = () => {
    navigate('/login');
  }

  const handleBackHome = () => {
    navigate('/');
  }

  return (
    <div className="register-page">
      <div className="background-overlay"></div>
      <div className="register-container">
        <button 
          className="back-home-btn" 
          onClick={handleBackHome}
          style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}
        >
          ← Back to Home
        </button>
        <h1 className="main-title">VolunteerHub</h1>
        <p className="subtitle">Tạo tài khoản của bạn</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="fullname">Họ Tên</label>
          <input 
            type="text" 
            id="fullname" 
            name="fullname" 
            required 
            value={formData.fullname}
            onChange={handleInputChange}
          />

          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            value={formData.email}
            onChange={handleInputChange}
          />

          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            value={formData.password}
            onChange={handleInputChange}
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword" 
            required 
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />

          <label className="role-label">Đăng ký với chức năng:</label>
          <div className="role-selector">
            {['volunteer', 'manager'].map((role) => (
              <button
                key={role}
                type="button"
                className={`role-btn ${selectedRole === role ? 'selected' : ''}`}
                onClick={() => handleRoleClick(role)}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          <button type="submit" className="create-account-btn">Đăng ký</button>
        </form>

        <p className="bottom-text">
          Bạn đã có tài khoản?{' '}
          <a onClick={handleLogin} className="link">Đăng nhập tại đây</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
