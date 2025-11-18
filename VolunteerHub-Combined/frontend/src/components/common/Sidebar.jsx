import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../assets/styles/home.css';
import { useAuth } from '../../contexts/AuthContext';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role || 'volunteer';

  const menuGroups = {
    volunteer: [
      {
        title: 'TRANG CHÍNH',
        items: [
          { key: 'dashboard', label: 'Dashboard', icon: '🏠', to: '/dashboard' },
          { key: 'events', label: 'Sự kiện', icon: '📅', to: '/events' },
          { key: 'my-events', label: 'Lịch sử tham gia', icon: '📋', to: '/history' },
        ]
      },
      {
        title: 'KHÁC',
        items: [
          { key: 'notifications', label: 'Thông báo', icon: '🔔', to: '/notification' },
        ]
      }
    ],
    manager: [
      {
        title: 'TRANG CHÍNH',
        items: [
          { key: 'dashboard', label: 'Dashboard', icon: '🏠', to: '/dashboard' },
          { key: 'events', label: 'Quản lý sự kiện', icon: '🛠️', to: '/manager/events' },
        ]
      }
    ],
    admin: [
      {
        title: 'TRANG CHÍNH',
        items: [
          { key: 'dashboard', label: 'Dashboard', icon: '🏠', to: '/dashboard' },
          { key: 'events', label: 'Quản lý sự kiện', icon: '🛠️', to: '/admin/events' },
        ]
      },
      {
        title: 'QUẢN TRỊ',
        items: [
          { key: 'user-management', label: 'Quản lý Manager', icon: '👥', to: '/admin/users' },
          { key: 'volunteer-management', label: 'Quản lý Volunteer', icon: '👤', to: '/admin/volunteers' },
        ]
      }
    ],
  };

  const groups = menuGroups[role] || menuGroups.volunteer;

  const handleNavigate = (to) => {
    navigate(to);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-header" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div className="logo-text">
            <div className="logo-main">Arise Hearts</div>
            <div className="logo-sub">Volunteer Club</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {groups.map((group, idx) => (
          <div key={idx} className="nav-group">
            <p className="nav-group-title">{group.title}</p>
            <ul className="nav-items">
              {group.items.map((item) => (
                <li 
                  key={item.key} 
                  className={`nav-item ${isActive(item.to) ? 'active' : ''}`}
                  onClick={() => handleNavigate(item.to)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Info Section */}
      <div className="sidebar-user">
        <div className="user-card">
          <div className="user-avatar-sidebar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || 'U'
            )}
          </div>
          <div className="user-info-sidebar">
            <p className="user-name-sidebar">{user?.name || 'Người dùng'}</p>
            <p className="user-email-sidebar">{user?.email || ''}</p>
            <p className="user-role-sidebar">
              {user?.role === 'volunteer' ? 'Tình nguyện viên' : 
               user?.role === 'manager' ? 'Quản lý' : 
               user?.role === 'admin' ? 'Quản trị viên' : 'Tình nguyện viên'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <button 
          className="btn-home" 
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '12px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>🏠</span>
          <span>Quay về trang chủ</span>
        </button>
        <p>© 2025 Arise Hearts</p>
        <p className="sidebar-footer-sub">Kết nối - Cống hiến - Lan tỏa</p>
      </div>
    </aside>
  );
}

export default Sidebar;