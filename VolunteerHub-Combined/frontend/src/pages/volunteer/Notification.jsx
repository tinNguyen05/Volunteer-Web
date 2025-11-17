import React from 'react';
import Sidebar from "../../components/common/Sidebar";
import '../../assets/styles/events.css';

export default function Notification() {
  const notifications = [
    { id: 1, title: 'Trạng thái đăng ký', time: '3 ngày trước', body: 'Bạn đã đăng ký tham gia sự kiện "Dọn rác bãi biển".' },
  ];

  return (
    <div className="EventsVolunteer-container">
      <Sidebar />
      <div className="events-container">
        <main className="main-content">
          <div className="events-header">
            <h2>Thông báo</h2>
          </div>

          {notifications.length === 0 ? (
            <div className="loading">Không có thông báo.</div>
          ) : (
            <div className="event-list">
              {notifications.map((n) => (
                <div key={n.id} className="event-card event-vol" style={{ cursor: 'default' }}>
                  <div className="event-title-row">
                    <a href="#" className="event-title" onClick={(e) => e.preventDefault()}>{n.title}</a>
                    <span className="event-date">{n.time}</span>
                  </div>

                  <div className="event-desc" style={{ marginTop: 6 }}>{n.body}</div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}