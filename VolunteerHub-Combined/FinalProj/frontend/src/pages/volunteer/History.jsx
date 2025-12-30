import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import { getParticipationHistory } from "../../services/eventService";
import { showNotification } from "../../services/toastService";
import "../../assets/styles/events.css";

export default function History() {
  const navigate = useNavigate();
  const handlePosts = (eventId) => {
    navigate(`/eventPosts/${eventId}`);
  };

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalEvents: 0, totalHours: 0 });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getParticipationHistory();
      
      if (response.success) {
        // Map backend data to frontend format
        const mappedHistory = response.data.registrations.map(reg => ({
          id: reg._id,
          title: reg.event?.title || 'Sự kiện không xác định',
          date: reg.event?.date ? new Date(reg.event.date).toLocaleDateString('vi-VN') : 'N/A',
          location: reg.event?.location || 'N/A',
          desc: reg.event?.description || '',
          status: 'completed',
          hoursWorked: reg.hoursWorked || 0,
          rating: reg.rating,
          feedback: reg.feedback,
          completionDate: reg.completionDate ? new Date(reg.completionDate).toLocaleDateString('vi-VN') : null
        }));
        
        setHistory(mappedHistory);
        setStats({
          totalEvents: response.data.totalEvents || 0,
          totalHours: response.data.totalHours || 0
        });
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      showNotification('Không thể tải lịch sử tham gia', 'error');
    } finally {
      setLoading(false);
    }
  };

  const myEvents = history;

  return (
    <div className="EventsVolunteer-container">
      <Sidebar />
      <div className="events-container">
        <main className="main-content">
          <div className="events-header">
            <h2>Lịch sử tham gia</h2>
          </div>

          {/* Stats Summary */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px', 
            marginBottom: '24px' 
          }}>
            <div style={{ 
              padding: '16px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              borderRadius: '12px', 
              color: 'white' 
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Tổng sự kiện</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>
                {stats.totalEvents}
              </div>
            </div>
            <div style={{ 
              padding: '16px', 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
              borderRadius: '12px', 
              color: 'white' 
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Tổng giờ tình nguyện</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>
                {stats.totalHours} giờ
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading">Đang tải lịch sử...</div>
          ) : myEvents.length === 0 ? (
            <div className="loading">Bạn chưa hoàn thành sự kiện nào.</div>
          ) : (
            <div className="event-list">
              {myEvents.map((event) => (
                <div key={event.id} className="event-card event-vol">
                  <div className="event-title-row">
                    <a href="#" className="event-title" onClick={(e) => { e.preventDefault(); handlePosts(event.id); }}>
                      {event.title}
                    </a>
                    <span className="event-date">{event.date}</span>
                  </div>

                  <div className="event-location">📍 {event.location}</div>
                  <div className="event-desc">{event.desc}</div>

                  <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '13px' }}>
                    <span style={{ color: '#10b981', fontWeight: 500 }}>
                      ✓ Đã hoàn thành
                    </span>
                    {event.hoursWorked > 0 && (
                      <span style={{ color: '#666' }}>
                        ⏱ {event.hoursWorked} giờ
                      </span>
                    )}
                    {event.rating && (
                      <span style={{ color: '#f59e0b' }}>
                        ⭐ {event.rating}/5
                      </span>
                    )}
                    {event.completionDate && (
                      <span style={{ color: '#666' }}>
                        📅 Hoàn thành: {event.completionDate}
                      </span>
                    )}
                  </div>

                  {event.feedback && (
                    <div style={{ 
                      marginTop: '12px', 
                      padding: '12px', 
                      background: '#f9fafb', 
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontStyle: 'italic'
                    }}>
                      💬 "{event.feedback}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
