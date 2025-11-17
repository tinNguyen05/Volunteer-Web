import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import '../../assets/styles/home.css';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  // Mock data for statistics
  const stats = [
    { id: 1, label: 'Tổng Tình Nguyện Viên', value: '500+', icon: '👥', color: '#10b981' },
    { id: 2, label: 'Dự Án Hoàn Thành', value: '100+', icon: '✅', color: '#3b82f6' },
    { id: 3, label: 'Giờ Tình Nguyện', value: '5,000+', icon: '⏰', color: '#f59e0b' },
  ];

  // Mock data for recent activities
  const recentActivities = [
    { id: 1, activity: 'Đăng ký sự kiện "Mùa hè xanh"', user: 'Nguyễn Văn A', date: '2025-11-14', status: 'success' },
    { id: 2, activity: 'Hoàn thành "Biển sạch"', user: 'Trần Thị B', date: '2025-11-13', status: 'completed' },
    { id: 3, activity: 'Đăng ký "Hiến máu nhân đạo"', user: 'Lê Văn C', date: '2025-11-13', status: 'success' },
    { id: 4, activity: 'Hủy tham gia "Trồng cây"', user: 'Phạm Thị D', date: '2025-11-12', status: 'cancelled' },
    { id: 5, activity: 'Hoàn thành "Dọn rác bãi biển"', user: 'Hoàng Văn E', date: '2025-11-11', status: 'completed' },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content" id="main-content">
        {/* Header with user info */}
        <header className="main-header">
          <div>
            <h1 className="dashboard-title">Chào mừng trở lại, {user?.name || 'bạn'}! 👋</h1>
            <p className="dashboard-subtitle">Tổng quan hoạt động tình nguyện của bạn</p>
          </div>

          <div className="user-info">
            <span className="user-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || 'U'
              )}
            </span>
            <div className="user-details">
              <span className="user-name">{user?.name || 'Người dùng'}</span>
              <span className="user-role">
                {user?.role === 'volunteer' ? 'Tình nguyện viên' : 
                 user?.role === 'manager' ? 'Quản lý' : 
                 user?.role === 'admin' ? 'Quản trị viên' : 'Tình nguyện viên'}
              </span>
            </div>
          </div>
        </header>

        {/* Statistics Cards - Grid Layout */}
        <section className="stats-section">
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.id} className="stat-card" style={{ '--accent-color': stat.color }}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activities Table */}
        <section className="activities-section">
          <div className="section-header">
            <h2 className="section-title">Hoạt Động Gần Đây</h2>
            <button className="view-all-btn">Xem tất cả →</button>
          </div>

          <div className="table-container">
            <table className="activities-table">
              <thead>
                <tr>
                  <th>Hoạt Động</th>
                  <th>Người Dùng</th>
                  <th>Ngày</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="activity-name">{activity.activity}</td>
                    <td className="user-cell">
                      <span className="user-avatar-sm">{activity.user.charAt(0)}</span>
                      {activity.user}
                    </td>
                    <td className="date-cell">{activity.date}</td>
                    <td>
                      <span className={`status-badge status-${activity.status}`}>
                        {activity.status === 'success' && '✓ Đã đăng ký'}
                        {activity.status === 'completed' && '🎉 Hoàn thành'}
                        {activity.status === 'cancelled' && '✕ Đã hủy'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="events-section">
          <div className="section-header">
            <h2 className="section-title">Sự Kiện Sắp Diễn Ra</h2>
            <button className="view-all-btn">Xem tất cả →</button>
          </div>

          <div className="events-grid">
            <div className="event-card-modern">
              <div className="event-badge">Mới</div>
              <h3 className="event-title">Mùa Hè Xanh 2025</h3>
              <p className="event-description">Chương trình tình nguyện hè dành cho sinh viên</p>
              <div className="event-meta">
                <span className="meta-item">👥 45 thành viên</span>
                <span className="meta-item">📅 20/12/2025</span>
              </div>
              <button className="event-join-btn">Tham gia ngay</button>
            </div>

            <div className="event-card-modern">
              <div className="event-badge featured">Nổi bật</div>
              <h3 className="event-title">Hiến Máu Nhân Đạo</h3>
              <p className="event-description">Giọt hồng chia sẻ - Yêu thương lan tỏa</p>
              <div className="event-meta">
                <span className="meta-item">👥 120 thành viên</span>
                <span className="meta-item">📅 15/12/2025</span>
              </div>
              <button className="event-join-btn">Tham gia ngay</button>
            </div>

            <div className="event-card-modern">
              <div className="event-badge">Mới</div>
              <h3 className="event-title">Biển Sạch</h3>
              <p className="event-description">Cùng nhau làm sạch bãi biển Việt Nam</p>
              <div className="event-meta">
                <span className="meta-item">👥 80 thành viên</span>
                <span className="meta-item">📅 10/12/2025</span>
              </div>
              <button className="event-join-btn">Tham gia ngay</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
