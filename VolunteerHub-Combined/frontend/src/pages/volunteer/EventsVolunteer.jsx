import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import '../../assets/styles/events.css'

export default function EventsVolunteer() {
  const navigate = useNavigate();
    const handlePosts = () => {
      navigate("/eventPosts");
    };
    const [activeTab, setActiveTab] = useState("upcoming");
  
    const events = [
      {
        id: 1,
        title: "Dọn rác bãi biển",
        date: "20/11/2025",
        location: "Đà Nẵng",
        desc: "Cùng nhau làm sạch bãi biển Mỹ Khê.",
        status: "upcoming",
        attendees: "45",
        image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&fit=crop"
      },
      {
        id: 2,
        title: "Trồng cây xanh tại trường",
        date: "15/11/2025",
        location: "Hà Nội",
        desc: "Chương trình trồng 500 cây xanh.",
        status: "upcoming",
        attendees: "120",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&fit=crop"
      },
      {
        id: 3,
        title: "Phát quà cho trẻ em",
        date: "01/10/2025",
        location: "TP. Hồ Chí Minh",
        desc: "Tặng quà trung thu cho trẻ em khó khăn.",
        status: "completed",
        attendees: "80",
        image: "https://images.unsplash.com/photo-1469571486292-0ba52a96ae4a?w=400&fit=crop"
      },
    ];
  
    const filteredEvents = events.filter((e) => e.status === activeTab);
  
    const [registeringEvent, setRegisteringEvent] = useState(null);
    const [showRegister, setShowRegister] = useState(false);
    const [form, setForm] = useState({
      name: "",
      email: "",
      phone: "",
      note: "",
    });
    const [registrations, setRegistrations] = useState({});
    const [registeredEvents, setRegisteredEvents] = useState([]);
  
    const handleRegister = (event) => {
      setRegisteringEvent(event);
      setForm({ name: "", email: "", phone: "", note: "" });
      setShowRegister(true);
    };
  
    const closeRegister = () => {
      setShowRegister(false);
      setRegisteringEvent(null);
    };
  
    const onFormChange = (e) => {
      setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };
  
    const submitRegistration = (e) => {
      e.preventDefault();
      if (!registeringEvent) return;
      const payload = {
        ...form,
        eventId: registeringEvent.id,
        submittedAt: new Date().toISOString(),
      };
      setRegistrations((r) => {
        const list = (r[registeringEvent.id] || []).concat(payload);
        return { ...r, [registeringEvent.id]: list };
      });
      setRegisteredEvents((prev) =>
        prev.includes(registeringEvent.id) ? prev : [...prev, registeringEvent.id]
      );
      alert("Đăng ký đã gửi. Cảm ơn bạn!");
      closeRegister();
    };
  
    const cancelRegistration = (eventId) => {
      setRegisteredEvents((prev) => prev.filter((id) => id !== eventId));
      setRegistrations((r) => {
        const list = (r[eventId] || []).slice(0, -1);
        return { ...r, [eventId]: list };
      });
      alert("Bạn đã hủy tham gia.");
      if (registeringEvent && registeringEvent.id === eventId) closeRegister();
    };
    
  return (
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
          {filteredEvents.length === 0 ? (
            <div className="loading">Không có sự kiện nào.</div>
          ) : (
            <div className="event-list">
              {filteredEvents.map((event) => (
                <div key={event.id} className="event-card event-vol">
                  <div className="event-title-row">
                    <a href="#" className="event-title" onClick={handlePosts}>
                      {event.title}
                    </a>
                    <span className="event-date">{event.date}</span>
                  </div>
                  <div className="event-location">{event.location}</div>
                  <div className="event-desc">{event.desc}</div>
                  <div className="event-tags">
                    <span className={`event-status ${event.status}`}>
                      {event.status === "upcoming" ? "Sắp diễn ra"
                        : event.status === "ongoing" ? "Đang diễn ra"
                        : "Đã hoàn thành"}
                    </span>
                  </div>

                  {event.status === "upcoming" && (
                    <div className="event-actions" style={{ marginTop: 12 }}>
                      {!registeredEvents.includes(event.id) ? (
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
              <input name="name" required placeholder="Họ và tên" value={form.name} onChange={onFormChange}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                }}
              />

              <input name="email" placeholder="Email" type="email" value={form.email} onChange={onFormChange}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                }}
              />

              <input name="phone" placeholder="Số điện thoại" value={form.phone} onChange={onFormChange}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                }}
              />

              <textarea name="note" placeholder="Ghi chú (tùy chọn)" rows={3} value={form.note} onChange={onFormChange}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-end",
                  marginTop: 6,
                }}
              >
                <button type="button" onClick={closeRegister} className="share-btn" style={{ padding: "8px 12px" }}>
                  Hủy
                </button>

                <button type="submit" className="join-btn" style={{ padding: "8px 14px" }}>
                  Gửi đăng ký
                </button>
              </div>
            </form>

            <div style={{ marginTop: 14, fontSize: 13, color: "#555" }}>
              Đã có {(registrations[registeringEvent.id] || []).length} đăng ký trước.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
