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
          { key: 'blood-donations', label: 'Quản lý hiến máu', icon: '🩸', to: '/admin/blood-donations' },
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
          { key: 'blood-donations', label: 'Quản lý hiến máu', icon: '🩸', to: '/admin/blood-donations' },
          { key: 'export-data', label: 'Xuất dữ liệu', icon: '📊', to: '/admin/export' },
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

      {/* Footer */}
      <div className="sidebar-footer">
        <p>© 2025 Arise Hearts</p>
        <p className="sidebar-footer-sub">Kết nối - Cống hiến - Lan tỏa</p>
      </div>
    </aside>
  );
}

export default Sidebar;