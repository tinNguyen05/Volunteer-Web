import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/common/Sidebar";
import "../../assets/styles/events.css";

export default function EventManagement() {
  const navigate = useNavigate();

  const handlePosts = () => {
    navigate('/eventPosts');
  };

  const handleApprove = () => {
    navigate('/manager/approve');
  };

  const handleViewList = () => {
    navigate('/manager/volunteerList');
  };

  const handleViewCompleted = () => {
    navigate('/manager/volunteerCompleted');
  };

  const [events, setEvents] = useState([
    { id: 1, title: "Dọn rác bãi biển", date: "2025-11-20", location: "Đà Nẵng", desc: "Cùng nhau làm sạch bãi biển Mỹ Khê.", status: "upcoming", image: "" },
    { id: 2, title: "Trồng cây xanh tại trường", date: "2025-11-15", location: "Hà Nội", desc: "Chương trình trồng 500 cây xanh.", status: "ongoing", image: "" },
    { id: 3, title: "Phát quà cho trẻ em", date: "2025-10-01", location: "TP. Hồ Chí Minh", desc: "Tặng quà trung thu cho trẻ em khó khăn.", status: "completed", image: "" },
  ]);

  const [activeTab, setActiveTab] = useState("upcoming");
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({
    title: '', date: '', location: '', desc: '', status: 'upcoming', image: ''
  });

  const filtered = events.filter((e) => e.status === activeTab);

  const handleCreate = () => {
    setEditingEvent(null);
    setForm({ title: '', date: '', location: '', desc: '', status: 'upcoming', image: '' });
    setShowModal(true);
  };

  const handleEdit = (e, ev) => {
    e.preventDefault();
    setEditingEvent(ev);
    setForm({ ...ev });
    setShowModal(true);
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
      setEvents(events.filter((ev) => ev.id !== id));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEvent) {
      setEvents(events.map(ev => ev.id === editingEvent.id ? { ...editingEvent, ...form } : ev));
      alert("Cập nhật sự kiện thành công!");
    } else {
      const newEvent = { ...form, id: Date.now() };
      setEvents([...events, newEvent]);
      alert("Tạo sự kiện mới thành công!");
    }
    closeModal();
  };

  return (
    <div className="EventsVolunteer-container">
      <Sidebar />
      <div className="events-container">
        <main className="main-content">
          <div className="events-header-row">
            <div className="events-header">
              <h2>Quản lý sự kiện</h2>
            </div>
            <button onClick={handleCreate} className="add-event-btn">Tạo sự kiện</button>
          </div>

          <div className="tabs-row">
            <div className="events-tabs">
              <button className={`event-tab ${activeTab === "upcoming" ? "active" : ""}`} onClick={() => setActiveTab("upcoming")}>Sắp diễn ra</button>
              <button className={`event-tab ${activeTab === "ongoing" ? "active" : ""}`} onClick={() => setActiveTab("ongoing")}>Đang diễn ra</button>
              <button className={`event-tab ${activeTab === "completed" ? "active" : ""}`} onClick={() => setActiveTab("completed")}>Đã hoàn thành</button>
            </div>
          </div>

          <div id="events-area">
            {filtered.length === 0 ? (
              <div className="loading">Không có sự kiện.</div>
            ) : (
              <div className="event-list">
                {filtered.map((event) => (
                  <div key={event.id} className="event-card event-vol">
                    <div className="event-title-row">
                      <a href="#" className="event-title" onClick={handlePosts}>{event.title}</a>
                      <span className="event-date">{event.date}</span>
                    </div>
                    <div className="event-location">{event.location}</div>
                    <div className="event-desc">{event.desc}</div>
                    <div className="event-tags">
                      <span className={`event-status ${event.status}`}>
                        {event.status === "upcoming"
                          ? "Sắp diễn ra"
                          : event.status === "ongoing"
                          ? "Đang diễn ra"
                          : "Đã hoàn thành"}
                      </span>
                    </div>

                    <div className="event-actions">
                      {event.status === "upcoming" && (
                        <>
                          <button className="event-edit-btn" onClick={(e) => handleEdit(e, event)}>Sửa</button>
                          <button className="event-delete-btn" onClick={(e) => handleDelete(e, event.id)}>Xóa</button>
                          <button className="event-approve-btn" onClick={handleApprove}>Duyệt thành viên</button>
                        </>
                      )}

                      {(event.status === "ongoing") && (
                        <button className="event-view-btn" onClick={handleViewList}>Xem danh sách</button>
                      )}

                      {(event.status === "completed") && (
                        <button className="event-view-btn" onClick={handleViewCompleted}>Xem danh sách</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="register-overlay"
          onClick={(e) => { if (e.target.className === 'register-overlay') closeModal(); }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: 20
          }}
        >
          <div
            className="register-panel"
            style={{
              width: '100%',
              maxWidth: 560,
              background: '#fff',
              borderRadius: 12,
              padding: 20,
              boxShadow: '0 12px 40px rgba(23,43,77,0.2)',
            }}
          >
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>{editingEvent ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}</h3>
              <button onClick={closeModal} aria-label="Close" style={{ border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </header>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input name="title" required placeholder="Tên sự kiện" value={form.title} onChange={handleFormChange} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
              <input name="date" required type="date" value={form.date} onChange={handleFormChange} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
              <input name="location" placeholder="Địa điểm" value={form.location} onChange={handleFormChange} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
              <textarea name="desc" placeholder="Mô tả sự kiện" rows={3} value={form.desc} onChange={handleFormChange} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
              <input name="image" placeholder="Link ảnh sự kiện" value={form.image} onChange={handleFormChange} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                <button type="button" onClick={closeModal} className="share-btn" style={{ padding: '8px 12px' }}>Hủy</button>
                <button type="submit" className="join-btn" style={{ padding: '8px 14px' }}>{editingEvent ? "Lưu thay đổi" : "Tạo mới"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
