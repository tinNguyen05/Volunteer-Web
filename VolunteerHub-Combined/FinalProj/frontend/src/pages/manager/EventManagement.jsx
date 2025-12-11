import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/common/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useEvents } from "../../contexts/EventContext";
import { useNotification } from "../../contexts/NotificationContext";
import { completeEvent } from '../../services/eventService';
import "../../assets/styles/events.css";

export default function EventManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { approvedEvents, pendingEvents, createEvent, updateEvent, deleteEvent } = useEvents();
  const { showNotification } = useNotification();

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

  // Combine approved and pending events for manager view
  // Show status: approved or pending
  const managerEvents = [
    ...approvedEvents
      .filter(e => e.createdBy === user?.id || user?.role === 'ADMIN')
      .map(e => ({ ...e, approvalStatus: 'approved' })),
    ...pendingEvents
      .filter(e => e.createdBy === user?.id || user?.role === 'ADMIN')
      .map(e => ({ ...e, approvalStatus: 'pending' }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({
    title: '', date: '', location: '', description: '', image: '', attendees: '0'
  });

  // Filter by approval status
  const filtered = activeTab === "all" 
    ? managerEvents 
    : managerEvents.filter((e) => e.approvalStatus === activeTab);

  const handleCreate = () => {
    setEditingEvent(null);
    setForm({ title: '', date: '', location: '', description: '', image: '', attendees: '0' });
    setShowModal(true);
  };

  const handleEdit = (e, ev) => {
    e.preventDefault();
    if (ev.approvalStatus === 'pending') {
      showNotification('Không thể chỉnh sửa sự kiện đang chờ phê duyệt!', 'error');
      return;
    }
    setEditingEvent(ev);
    setForm({ 
      title: ev.title, 
      date: ev.date, 
      location: ev.location || '', 
      description: ev.description, 
      image: ev.image,
      attendees: ev.attendees || '0'
    });
    setShowModal(true);
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
      const result = deleteEvent(id, user?.role);
      if (result.success) {
        showNotification(result.message, 'success');
      } else {
        showNotification(result.message, 'error');
      }
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
      const result = updateEvent(editingEvent.id, form, user?.role);
      showNotification(result.message, result.success ? 'success' : 'error');
    } else {
      const result = createEvent(form, user?.role, user?.id);
      showNotification(result.message, result.success ? 'success' : 'info');
    }
    closeModal();
  };

  const handleComplete = async (e, event) => {
    e.preventDefault();
    
    if (!window.confirm(`Xác nhận đánh dấu sự kiện "${event.title}" đã hoàn thành?`)) {
      return;
    }

    try {
      const response = await completeEvent(event.id);
      if (response.success) {
        showNotification('✅ Đã đánh dấu sự kiện hoàn thành và gửi thông báo cho tình nguyện viên', 'success');
        // Optionally refresh events or update local state
        window.location.reload(); // Simple refresh for now
      } else {
        showNotification(response.error || 'Không thể hoàn thành sự kiện', 'error');
      }
    } catch (error) {
      showNotification('Lỗi khi hoàn thành sự kiện', 'error');
    }
  };

  const isEventPast = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  };

  const canCompleteEvent = (event) => {
    return event.approvalStatus === 'approved' && 
           isEventPast(event.date) && 
           !event.isCompleted;
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
              <button className={`event-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>Tất cả</button>
              <button className={`event-tab ${activeTab === "approved" ? "active" : ""}`} onClick={() => setActiveTab("approved")}>Đã duyệt</button>
              <button className={`event-tab ${activeTab === "pending" ? "active" : ""}`} onClick={() => setActiveTab("pending")}>Chờ duyệt</button>
            </div>
          </div>

          <div id="events-area">
            {filtered.length === 0 ? (
              <div className="loading">Không có sự kiện.</div>
            ) : (
              <div className="event-list">
                {filtered.map((event) => (
                  <div key={event.id} className="event-card event-vol">
                    {event.image && (
                      <div style={{ marginBottom: '16px', borderRadius: '8px', overflow: 'hidden' }}>
                        <img 
                          src={event.image} 
                          alt={event.title}
                          style={{ 
                            width: '100%', 
                            height: '200px', 
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                      </div>
                    )}
                    <div className="event-title-row">
                      <a href="#" className="event-title" onClick={handlePosts}>{event.title}</a>
                      <span className="event-date">{event.date}</span>
                    </div>
                    <div className="event-location">📍 {event.location || 'Chưa cập nhật'}</div>
                    <div className="event-desc">{event.description}</div>
                    <div className="event-tags">
                      <span className={`event-status ${event.approvalStatus === 'approved' ? 'ongoing' : 'upcoming'}`}>
                        {event.approvalStatus === 'approved' ? '✓ Đã duyệt' : '⏳ Chờ duyệt'}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#666', marginLeft: '8px' }}>
                        {event.attendees || 0} người tham gia
                      </span>
                    </div>

                    <div className="event-actions">
                      {event.isCompleted ? (
                        <span style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 500 }}>
                          ✓ Đã hoàn thành
                        </span>
                      ) : user?.role === 'ADMIN' || event.approvalStatus === 'approved' ? (
                        <>
                          {canCompleteEvent(event) && (
                            <button 
                              className="join-btn" 
                              onClick={(e) => handleComplete(e, event)}
                              style={{ 
                                marginRight: '8px',
                                background: '#10b981',
                                fontSize: '0.85rem',
                                padding: '6px 12px'
                              }}
                            >
                              ✓ Hoàn thành
                            </button>
                          )}
                          <button className="event-edit-btn" onClick={(e) => handleEdit(e, event)}>Sửa</button>
                          <button className="event-delete-btn" onClick={(e) => handleDelete(e, event.id)}>Xóa</button>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.9rem', color: '#999', fontStyle: 'italic' }}>
                          Đang chờ admin phê duyệt...
                        </span>
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
              <textarea name="description" placeholder="Mô tả sự kiện" rows={3} value={form.description} onChange={handleFormChange} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
              <input name="image" placeholder="Link ảnh sự kiện" value={form.image} onChange={handleFormChange} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
              <input name="attendees" type="number" min="0" placeholder="Số lượng người tham gia dự kiến" value={form.attendees} onChange={handleFormChange} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />

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
