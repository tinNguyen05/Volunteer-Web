import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import { getDashboardStats, getTrendingEvents } from '../../services/dashboardService';
import '../../assets/styles/home.css';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.role]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const statsResponse = await getDashboardStats();
      if (statsResponse.success) {
        const data = statsResponse.data;
        
        // Map stats based on user role
        const mappedStats = [];
        
        if (user?.role === 'volunteer') {
          mappedStats.push(
            { id: 1, label: 'Sự kiện đã tham gia', value: data.myEventsCount || 0, icon: '📅', color: '#10b981' },
            { id: 2, label: 'Giờ tình nguyện', value: `${data.myHours || 0}h`, icon: '⏰', color: '#f59e0b' },
            { id: 3, label: 'Đang chờ duyệt', value: data.pendingRegistrations || 0, icon: '⏳', color: '#3b82f6' }
          );
        } else if (user?.role === 'manager') {
          mappedStats.push(
            { id: 1, label: 'Sự kiện quản lý', value: data.totalEvents || 0, icon: '📋', color: '#10b981' },
            { id: 2, label: 'Đăng ký mới', value: data.totalRegistrations || 0, icon: '👥', color: '#3b82f6' },
            { id: 3, label: 'Chờ phê duyệt', value: data.pendingApprovals || 0, icon: '⏳', color: '#f59e0b' }
          );
        } else if (user?.role === 'admin') {
          mappedStats.push(
            { id: 1, label: 'Tổng người dùng', value: data.totalUsers || 0, icon: '👥', color: '#10b981' },
            { id: 2, label: 'Tổng sự kiện', value: data.totalEvents || 0, icon: '📅', color: '#3b82f6' },
            { id: 3, label: 'Tổng đăng ký', value: data.totalRegistrations || 0, icon: '📝', color: '#f59e0b' }
          );
        }
        
        setStats(mappedStats);
        
        // Map recent activities
        if (data.recentActivities && data.recentActivities.length > 0) {
          const mapped = data.recentActivities.map((act, idx) => ({
            id: idx + 1,
            activity: act.activity || act.description,
            user: act.user?.name || 'N/A',
            date: new Date(act.createdAt || act.date).toLocaleDateString('vi-VN'),
            status: act.status || 'success'
          }));
          setRecentActivities(mapped);
        }
      }

      // Fetch approved upcoming events from backend
      const { getAllEvents } = await import('../../services/eventService');
      const eventsResponse = await getAllEvents({ status: 'approved' });
      if (eventsResponse.success && eventsResponse.data.events) {
        // Filter only upcoming events and take first 3
        const today = new Date();
        const upcoming = eventsResponse.data.events
          .filter(event => new Date(event.date) >= today)
          .slice(0, 3)
          .map(event => ({
            id: event._id,
            title: event.title,
            description: event.description?.substring(0, 60) + '...',
            attendees: event.registeredVolunteers?.length || 0,
            date: new Date(event.date).toLocaleDateString('vi-VN'),
            badge: 'Mới',
            location: event.location
          }));
        setUpcomingEvents(upcoming);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Keep mock data as fallback
      setStats([
        { id: 1, label: 'Tổng Tình Nguyện Viên', value: '500+', icon: '👥', color: '#10b981' },
        { id: 2, label: 'Dự Án Hoàn Thành', value: '100+', icon: '✅', color: '#3b82f6' },
        { id: 3, label: 'Giờ Tình Nguyện', value: '5,000+', icon: '⏰', color: '#f59e0b' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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
            <div className="user-dropdown">
              <button 
                className="btn-home-dropdown" 
                onClick={() => navigate('/')}
              >
                <span>🏠</span>
                <span>Quay về trang chủ</span>
              </button>
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
            <button className="view-all-btn" onClick={() => navigate('/history')}>Xem tất cả →</button>
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
            <button className="view-all-btn" onClick={() => navigate('/events')}>Xem tất cả →</button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Đang tải...
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="events-grid">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="event-card-modern">
                  <div className={`event-badge ${event.badge === 'Nổi bật' ? 'featured' : ''}`}>
                    {event.badge}
                  </div>
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                  <div className="event-meta">
                    <span className="meta-item">👥 {event.attendees} thành viên</span>
                    <span className="meta-item">📅 {event.date}</span>
                  </div>
                  <button 
                    className="event-join-btn"
                    onClick={() => navigate('/events')}
                  >
                    Tham gia ngay
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="events-grid">
              <div className="event-card-modern">
                <div className="event-badge">Mới</div>
                <h3 className="event-title">Mùa Hè Xanh 2025</h3>
                <p className="event-description">Chương trình tình nguyện hè dành cho sinh viên</p>
                <div className="event-meta">
                  <span className="meta-item">👥 45 thành viên</span>
                  <span className="meta-item">📅 20/12/2025</span>
                </div>
                <button className="event-join-btn" onClick={() => navigate('/events')}>
                  Tham gia ngay
                </button>
              </div>

              <div className="event-card-modern">
                <div className="event-badge featured">Nổi bật</div>
                <h3 className="event-title">Hiến Máu Nhân Đạo</h3>
                <p className="event-description">Giọt hồng chia sẻ - Yêu thương lan tỏa</p>
                <div className="event-meta">
                  <span className="meta-item">👥 120 thành viên</span>
                  <span className="meta-item">📅 15/12/2025</span>
                </div>
                <button className="event-join-btn" onClick={() => navigate('/events')}>
                  Tham gia ngay
                </button>
              </div>

              <div className="event-card-modern">
                <div className="event-badge">Mới</div>
                <h3 className="event-title">Biển Sạch</h3>
                <p className="event-description">Cùng nhau làm sạch bãi biển Việt Nam</p>
                <div className="event-meta">
                  <span className="meta-item">👥 80 thành viên</span>
                  <span className="meta-item">📅 10/12/2025</span>
                </div>
                <button className="event-join-btn" onClick={() => navigate('/events')}>
                  Tham gia ngay
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
