import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import "../../assets/styles/events.css";

export default function History() {
  const navigate = useNavigate();
  const handlePosts = () => {
    navigate("/eventPosts");
  };

  const events = [
    {
      id: 1,
      title: "Dọn rác bãi biển",
      date: "20/11/2025",
      location: "Đà Nẵng",
      desc: "Cùng nhau làm sạch bãi biển Mỹ Khê.",
      status: "upcoming",
    },
    {
      id: 2,
      title: "Trồng cây xanh tại trường",
      date: "15/11/2025",
      location: "Hà Nội",
      desc: "Chương trình trồng 500 cây xanh.",
      status: "ongoing",
    },
    {
      id: 3,
      title: "Phát quà cho trẻ em",
      date: "01/10/2025",
      location: "TP. Hồ Chí Minh",
      desc: "Tặng quà trung thu cho trẻ em khó khăn.",
      status: "completed",
    },
  ];

  // giả định các event đã đăng ký (chỉ để hiển thị mẫu)
  const myEvents = [events[0], events[1]]; // sửa nếu muốn mẫu khác

  return (
    <div className="EventsVolunteer-container">
      <Sidebar />
      <div className="events-container">
        <main className="main-content">
          <div className="events-header">
            <h2>Sự kiện của tôi</h2>
          </div>

          {myEvents.length === 0 ? (
            <div className="loading">Bạn chưa đăng ký sự kiện nào.</div>
          ) : (
            <div className="event-list">
              {myEvents.map((event) => (
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

                  <div className="event-actions" style={{ marginTop: 12 }}>
                    {event.status === "upcoming" && (
                      <button className="event-cancel-btn" onClick={(e) => e.preventDefault()} type="button">
                        Hủy tham gia
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
