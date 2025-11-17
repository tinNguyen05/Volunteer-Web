import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../../assets/styles/events.css";
import Sidebar from "../../components/common/Sidebar";

function EventApproval() {
    const navigate = useNavigate();
      const handlePosts = () => {
        navigate('/eventPosts');
      };

  const [activeTab, setActiveTab] = useState("pending");

  // Danh sách sự kiện mẫu
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Dọn rác bãi biển",
      date: "20/11/2025",
      location: "Đà Nẵng",
      desc: "Cùng nhau làm sạch bãi biển Mỹ Khê.",
      status: "pending",
    },
    {
      id: 2,
      title: "Trồng cây xanh tại trường",
      date: "15/11/2025",
      location: "Hà Nội",
      desc: "Chương trình trồng 500 cây xanh.",
      status: "approved",
    },
    {
      id: 3,
      title: "Phát quà cho trẻ em",
      date: "01/10/2025",
      location: "TP. Hồ Chí Minh",
      desc: "Tặng quà trung thu cho trẻ em khó khăn.",
      status: "approved",
    },
  ]);

  // Lọc sự kiện theo tab hiện tại
  const filteredEvents = events.filter((e) =>
    activeTab === "all" ? true : e.status === activeTab
  );

  // Xử lý phê duyệt
  const handleApprove = (eventId) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: "approved" } : e))
    );
    alert("✅ Sự kiện đã được phê duyệt!");
  };

  // Xử lý xóa sự kiện
  const handleDelete = (eventId) => {
    if (window.confirm("Bạn có chắc muốn xóa sự kiện này không?")) {
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      alert("🗑️ Sự kiện đã bị xóa.");
    }
  };

  return (
    <div className="EventApproval-container">
      <Sidebar />
      <div className="events-container">
        <main className="main-content">
          <div className="events-header">
            <h2>Phê Duyệt Sự Kiện</h2>
          </div>

          <div className="tabs-row">
            <div className="events-tabs">
              <button
                className={`event-tab ${
                  activeTab === "pending" ? "active" : ""
                }`}
                onClick={() => setActiveTab("pending")}
              >
                Chưa phê duyệt
              </button>
              <button
                className={`event-tab ${
                  activeTab === "approved" ? "active" : ""
                }`}
                onClick={() => setActiveTab("approved")}
              >
                Đã phê duyệt
              </button>
              <button
                className={`event-tab ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                Tất cả
              </button>
            </div>
          </div>

          <div id="events-area">
            {filteredEvents.length === 0 ? (
              <div className="loading">Không có sự kiện nào.</div>
            ) : (
              <div className="event-list">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="event-card event-admin">
                    <div className="event-title-row">
                      <a href="#" className="event-title" onClick={handlePosts}>{event.title}</a>
                      <span className="event-date">{event.date}</span>
                    </div>
                    <div className="event-location">{event.location}</div>
                    <div className="event-desc">{event.desc}</div>
                    <div className="event-tags">
                      <span className={`event-status ${event.status}`}>
                        {event.status === "pending"
                          ? "Chưa phê duyệt"
                          : "Đã phê duyệt"}
                      </span>
                    </div>

                    <div className="event-actions" style={{ marginTop: 12 }}>
                      {event.status === "pending" ? (
                        <button
                          className="event-approve-btn"
                          onClick={() => handleApprove(event.id)}
                        >
                          Phê duyệt
                        </button>
                      ) : (
                        <button
                          className="event-delete-btn"
                          onClick={() => handleDelete(event.id)}
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default EventApproval;
