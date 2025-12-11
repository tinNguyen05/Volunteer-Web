import React, { useState, useEffect } from "react";
import "../../assets/styles/user-list.css";
import Sidebar from "../../components/common/Sidebar";
import { getRegistrationsByEvent, updateRegistrationStatus } from '../../services/eventService';
import { showNotification as showToast } from '../../services/toastService';

const VolunteerApprove = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

  useEffect(() => {
    fetchManagerEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchRegistrations(selectedEvent);
    }
  }, [selectedEvent, filter]);

  const fetchManagerEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events/manager', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        const eventsData = data.data || [];
        setEvents(eventsData);
        if (eventsData.length > 0) {
          setSelectedEvent(eventsData[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      showToast('Không thể tải danh sách sự kiện', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async (eventId) => {
    try {
      setLoading(true);
      const response = await getRegistrationsByEvent(eventId);
      
      if (response.success) {
        let regs = response.data.registrations || [];
        
        // Apply filter
        if (filter !== 'all') {
          regs = regs.filter(r => r.status === filter);
        }
        
        const mapped = regs.map(reg => ({
          id: reg._id,
          userId: reg.user._id,
          name: reg.user.name,
          email: reg.user.email,
          phone: reg.user.phone || 'N/A',
          status: reg.status,
          registeredAt: new Date(reg.registeredAt).toLocaleDateString('vi-VN'),
          motivation: reg.motivation,
          skills: reg.skills
        }));
        
        setRegistrations(mapped);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      showToast('Không thể tải danh sách đăng ký', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Duyệt tình nguyện viên
  const handleApprove = async (registrationId) => {
    try {
      const response = await updateRegistrationStatus(registrationId, 'approved');
      
      if (response.success) {
        setRegistrations(prev =>
          prev.map(r =>
            r.id === registrationId ? { ...r, status: 'approved' } : r
          )
        );
        showToast('✅ Đã duyệt tình nguyện viên', 'success');
      } else {
        showToast(response.error || 'Không thể duyệt đăng ký', 'error');
      }
    } catch (error) {
      showToast('Lỗi khi duyệt đăng ký', 'error');
    }
  };

  // ❌ Từ chối tình nguyện viên
  const handleReject = async (registrationId) => {
    if (window.confirm("Bạn có chắc muốn từ chối đăng ký này?")) {
      try {
        const response = await updateRegistrationStatus(registrationId, 'rejected');
        
        if (response.success) {
          setRegistrations(prev =>
            prev.map(r =>
              r.id === registrationId ? { ...r, status: 'rejected' } : r
            )
          );
          showToast('❌ Đã từ chối đăng ký', 'success');
        } else {
          showToast(response.error || 'Không thể từ chối đăng ký', 'error');
        }
      } catch (error) {
        showToast('Lỗi khi từ chối đăng ký', 'error');
      }
    }
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      'pending': 'Chờ duyệt',
      'approved': 'Đã duyệt',
      'rejected': 'Từ chối'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved': return 'approved';
      case 'rejected': return 'rejected';
      default: return 'pending';
    }
  };

  return (
    <div className="UserManagement-container">
      <Sidebar />

      <div className="user-table-container">
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ marginBottom: "10px" }}>Phê duyệt tình nguyện viên</h2>
          
          {/* Event Selector */}
          {events.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
              <label style={{ fontWeight: 500 }}>Sự kiện:</label>
              <select 
                value={selectedEvent || ''} 
                onChange={(e) => setSelectedEvent(e.target.value)}
                style={{ 
                  padding: '8px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px',
                  fontSize: '14px',
                  minWidth: '250px'
                }}
              >
                {events.map(event => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>

              {/* Filter */}
              <label style={{ fontWeight: 500, marginLeft: '20px' }}>Lọc:</label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                style={{ 
                  padding: '8px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Đang tải...
          </div>
        ) : registrations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            {events.length === 0 ? 'Bạn chưa có sự kiện nào.' : 'Không có đăng ký nào.'}
          </div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Tình nguyện viên</th>
                <th>Liên hệ</th>
                <th>Ngày đăng ký</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {reg.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="user-name">{reg.name}</div>
                        {reg.motivation && (
                          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                            {reg.motivation.substring(0, 50)}{reg.motivation.length > 50 ? '...' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="contact-info">
                      <div>{reg.email}</div>
                      <div className="phone">{reg.phone}</div>
                    </div>
                  </td>

                  <td>{reg.registeredAt}</td>

                  <td>
                    <span className={`status-badge ${getStatusClass(reg.status)}`}>
                      {getStatusDisplay(reg.status)}
                    </span>
                  </td>

                  <td>
                    <div className="actions">
                      {reg.status === 'pending' ? (
                        <>
                          <button
                            className="approve"
                            onClick={() => handleApprove(reg.id)}
                            style={{ marginRight: '8px' }}
                          >
                            ✓ Duyệt
                          </button>
                          <button
                            className="delete"
                            onClick={() => handleReject(reg.id)}
                          >
                            ✗ Từ chối
                          </button>
                        </>
                      ) : reg.status === 'approved' ? (
                        <button
                          className="delete"
                          onClick={() => handleReject(reg.id)}
                        >
                          ✗ Hủy duyệt
                        </button>
                      ) : (
                        <button
                          className="approve"
                          onClick={() => handleApprove(reg.id)}
                        >
                          ✓ Duyệt lại
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VolunteerApprove;
