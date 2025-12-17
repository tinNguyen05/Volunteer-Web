import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import { getAllEvents, getDashboardEvents } from '../../services/eventService';
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
      
      // Fetch upcoming events using GraphQL
      const eventsResponse = await getDashboardEvents(6);
      if (eventsResponse.success) {
        const events = eventsResponse.data;
        
        // Calculate stats from events data
        const totalEvents = events.length;
        const totalMembers = events.reduce((sum, e) => sum + (e.memberCount || 0), 0);
        const totalPosts = events.reduce((sum, e) => sum + (e.postCount || 0), 0);
        
        // Map stats based on user role
        const mappedStats = [];
        
        if (user?.role === 'USER' || user?.role === 'volunteer') {
          mappedStats.push(
            { id: 1, label: 'Sự kiện khả dụng', value: totalEvents, icon: '📅', color: '#10b981' },
            { id: 2, label: 'Tổng thành viên', value: totalMembers, icon: '👥', color: '#f59e0b' },
            { id: 3, label: 'Bài viết', value: totalPosts, icon: '📝', color: '#3b82f6' }
          );
        } else if (user?.role === 'EVENT_MANAGER' || user?.role === 'manager') {
          mappedStats.push(
            { id: 1, label: 'Sự kiện quản lý', value: totalEvents, icon: '📋', color: '#10b981' },
            { id: 2, label: 'Thành viên', value: totalMembers, icon: '👥', color: '#3b82f6' },
            { id: 3, label: 'Bài viết', value: totalPosts, icon: '📝', color: '#f59e0b' }
          );
        } else if (user?.role === 'ADMIN') {
          mappedStats.push(
            { id: 1, label: 'Tổng sự kiện', value: totalEvents, icon: '📅', color: '#10b981' },
            { id: 2, label: 'Tổng thành viên', value: totalMembers, icon: '👥', color: '#3b82f6' },
            { id: 3, label: 'Tổng bài viết', value: totalPosts, icon: '📝', color: '#f59e0b' }
          );
        }
        
        setStats(mappedStats);
        
        // Map upcoming events (take first 3)
        const upcoming = events.slice(0, 3).map(event => ({
          id: event.eventId,
          title: event.eventName || 'Sự kiện',
          description: event.eventDescription?.substring(0, 60) + '...' || 'Không có mô tả',
          attendees: event.memberCount || 0,
          date: new Date(event.createdAt).toLocaleDateString('vi-VN'),
          badge: 'Mới',
          location: event.eventLocation || 'Chưa xác định'
        }));
        setUpcomingEvents(upcoming);
        
        // Generate recent activities from events
        const activities = events.slice(0, 5).map((event, idx) => ({
          id: idx + 1,
          activity: `Sự kiện "${event.eventName || 'Sự kiện'}" được tạo`,
          user: event.creatorInfo?.username || 'Anonymous',
          date: new Date(event.createdAt).toLocaleDateString('vi-VN'),
          status: 'success'
        }));
        setRecentActivities(activities);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to basic stats
      setStats([
        { id: 1, label: 'Tổng Sự Kiện', value: '0', icon: '📅', color: '#10b981' },
        { id: 2, label: 'Thành Viên', value: '0', icon: '👥', color: '#3b82f6' },
        { id: 3, label: 'Bài Viết', value: '0', icon: '📝', color: '#f59e0b' },
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
                 user?.role === 'ADMIN' ? 'Quản trị viên' : 'Tình nguyện viên'}
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
