import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import { getAllEvents, registerForEvent } from "../../services/eventService";
import { showNotification } from "../../services/toastService";
import '../../assets/styles/events.css'

export default function EventsVolunteer() {
  const navigate = useNavigate();
  const handlePosts = (eventId) => {
    navigate(`/eventPosts/${eventId}`);
  };
  
  const [activeTab, setActiveTab] = useState("upcoming");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  
  // Fetch events from backend
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getAllEvents({ status: 'approved' });
      if (response.success) {
        // Map backend data to frontend format
        const mappedEvents = response.data.events.map(event => ({
          id: event._id,
          title: event.title,
          date: new Date(event.date).toLocaleDateString('vi-VN'),
          location: event.location,
          desc: event.description,
          status: getEventStatus(event.date, event.status),
          attendees: event.registeredVolunteers?.length || 0,
          image: event.image,
          capacity: event.capacity
        }));
        setEvents(mappedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      showNotification('Không thể tải danh sách sự kiện', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Determine event status based on date
  const getEventStatus = (eventDate, dbStatus) => {
    if (dbStatus === 'completed') return 'completed';
    if (dbStatus === 'ongoing') return 'ongoing';
    
    const today = new Date();
    const eventDay = new Date(eventDate);
    
    if (eventDay > today) return 'upcoming';
    if (eventDay.toDateString() === today.toDateString()) return 'ongoing';
    return 'completed';
  };
  
  const filteredEvents = events.filter((e) => e.status === activeTab);
  
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = (event) => {
    setRegisteringEvent(event);
    setShowRegister(true);
  };

  const closeRegister = () => {
    setShowRegister(false);
    setRegisteringEvent(null);
  };

  const submitRegistration = async (e) => {
    e.preventDefault();
    if (!registeringEvent || submitting) return;
    
    try {
      setSubmitting(true);
      const response = await registerForEvent(registeringEvent.id);
      
      if (response.success) {
        showNotification('Đăng ký thành công! Chờ quản lý phê duyệt.', 'success');
        setRegisteredEventIds(prev => [...prev, registeringEvent.id]);
        closeRegister();
        // Refresh events to get updated attendee count
        fetchEvents();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng ký thất bại';
      showNotification(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const cancelRegistration = async (eventId) => {
    // TODO: Implement cancel registration API if needed
    alert("Chức năng hủy đăng ký sẽ được bổ sung sau.");
  };  return (
    <div className="EventsVolunteer-container">
      <Sidebar />
      <main className="main-content">
        <div className="events-header">
          <h2>Sự Kiện Tình Nguyện</h2>
        </div>

        <div className="tabs-row">
          <div className="events-tabs">
            <button
              className={`event-tab ${activeTab === "upcoming" ? "active" : ""}`}
              onClick={() => setActiveTab("upcoming")}
            >
              Sắp diễn ra
            </button>

            <button
              className={`event-tab ${activeTab === "ongoing" ? "active" : ""}`}
              onClick={() => setActiveTab("ongoing")}
            >
              Đang diễn ra
            </button>

            <button
              className={`event-tab ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              Đã hoàn thành
            </button>
          </div>
        </div>

        <div id="events-area">
          {loading ? (
            <div className="loading">Đang tải danh sách sự kiện...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="loading">Không có sự kiện nào.</div>
          ) : (
            <div className="event-list">
              {filteredEvents.map((event) => (
                <div key={event.id} className="event-card event-vol">
                  {event.image && (
                    <div style={{ marginBottom: '12px', borderRadius: '8px', overflow: 'hidden' }}>
                      <img 
                        src={event.image} 
                        alt={event.title}
                        style={{ 
                          width: '100%', 
                          height: '160px', 
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                    </div>
                  )}
                  <div className="event-title-row">
                    <a href="#" className="event-title" onClick={(e) => { e.preventDefault(); handlePosts(event.id); }}>
                      {event.title}
                    </a>
                    <span className="event-date">{event.date}</span>
                  </div>
                  <div className="event-location">📍 {event.location}</div>
                  <div className="event-desc">{event.desc}</div>
                  <div className="event-tags">
                    <span className={`event-status ${event.status}`}>
                      {event.status === "upcoming" ? "Sắp diễn ra"
                        : event.status === "ongoing" ? "Đang diễn ra"
                        : "Đã hoàn thành"}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#666', marginLeft: '8px' }}>
                      👥 {event.attendees}/{event.capacity || '∞'}
                    </span>
                  </div>

                  {event.status === "upcoming" && (
                    <div className="event-actions" style={{ marginTop: 12 }}>
                      {!registeredEventIds.includes(event.id) ? (
                        <button className="event-join-btn" onClick={() => handleRegister(event)} type="button">
                          Tham gia
                        </button>
                      ) : (
                        <button className="event-cancel-btn" onClick={() => cancelRegistration(event.id)} type="button">
                          Hủy tham gia
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showRegister && registeringEvent && (
        <div className="register-overlay"
          onClick={(e) => {
            if (e.target.className === "register-overlay") closeRegister();
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
            padding: 20,
          }}
        >
          <div className="register-panel"
            role="dialog"
            aria-modal="true"
            style={{
              width: "100%",
              maxWidth: 560,
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              boxShadow: "0 12px 40px rgba(23,43,77,0.2)",
            }}
          >
            <header
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>{registeringEvent.title}</h3>
                <div style={{ fontSize: 13, color: "#666" }}>
                  {registeringEvent.date} · {registeringEvent.location}
                </div>
              </div>
              <button onClick={closeRegister} aria-label="Close"
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </header>

            <form onSubmit={submitRegistration}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <div style={{ padding: '12px', background: '#f0f9ff', borderRadius: '8px', fontSize: '14px', color: '#0369a1' }}>
                ℹ️ Bạn đang đăng ký tham gia sự kiện này. Quản lý sẽ xem xét và phê duyệt đăng ký của bạn.
              </div>

              <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
                <strong>Sức chứa:</strong> {registeringEvent.capacity || 'Không giới hạn'} người
                <br />
                <strong>Đã đăng ký:</strong> {registeringEvent.attendees} người
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-end",
                  marginTop: 6,
                }}
              >
                <button type="button" onClick={closeRegister} className="share-btn" style={{ padding: "8px 12px" }} disabled={submitting}>
                  Hủy
                </button>

                <button type="submit" className="join-btn" style={{ padding: "8px 14px" }} disabled={submitting}>
                  {submitting ? 'Đang gửi...' : 'Xác nhận đăng ký'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
