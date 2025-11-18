import React, { useState, useEffect } from "react";
import "../../assets/styles/user-list.css";
import "../../components/common/Sidebar";
import Sidebar from "../../components/common/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";

const VolunteerList = () => {
  const { registeredVolunteers } = useAuth();
  const { showNotification } = useNotification();
  const [volunteers, setVolunteers] = useState([]);

  // Get volunteers list
  useEffect(() => {
    const volunteersFromStorage = registeredVolunteers.map(volunteer => ({
      id: volunteer.id,
      name: volunteer.name,
      email: volunteer.email,
      password: volunteer.password,
      phone: volunteer.phone || 'N/A',
      role: "Tình nguyện viên",
      status: volunteer.locked ? "Locked" : "Active",
      joined: new Date(volunteer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }));
    
    setVolunteers(volunteersFromStorage);
  }, [registeredVolunteers]);

  const handleLock = (id) => {
    const updatedVolunteers = registeredVolunteers.map(v => 
      v.id === id ? { ...v, locked: true } : v
    );
    localStorage.setItem('vh_volunteers', JSON.stringify(updatedVolunteers));

    setVolunteers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "Locked" } : v))
    );
    showNotification("Đã khóa tài khoản", "info");
    
    // Force reload to sync with context
    setTimeout(() => window.location.reload(), 500);
  };

  const handleUnlock = (id) => {
    const updatedVolunteers = registeredVolunteers.map(v => 
      v.id === id ? { ...v, locked: false } : v
    );
    localStorage.setItem('vh_volunteers', JSON.stringify(updatedVolunteers));

    setVolunteers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "Active" } : v))
    );
    showNotification("Đã mở khóa tài khoản", "success");
    
    // Force reload to sync with context
    setTimeout(() => window.location.reload(), 500);
  };

  const handleView = (id) => {
    const volunteer = volunteers.find((v) => v.id === id);
    alert(`Xem thông tin: ${volunteer.name}\nEmail: ${volunteer.email}\nSĐT: ${volunteer.phone}\nVai trò: ${volunteer.role}\nMật khẩu: ${volunteer.password}`);
  };

  const handleDelete = (id) => {
    const volunteer = volunteers.find((v) => v.id === id);
    if (!volunteer) return;

    if (window.confirm(`Bạn có chắc muốn xóa tình nguyện viên ${volunteer.name}?`)) {
      const updatedVolunteers = registeredVolunteers.filter(v => v.id !== id);
      localStorage.setItem('vh_volunteers', JSON.stringify(updatedVolunteers));
      
      setVolunteers(prev => prev.filter(v => v.id !== id));
      showNotification('Đã xóa tình nguyện viên thành công!', 'success');
      
      // Force reload to sync with context
      window.location.reload();
    }
  };

  return (
    <div className="UserManagement-container">
      <Sidebar />

      <div className="user-table-container">
        <button className="export">Xuất danh sách</button>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Password</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {volunteers.map((volunteer) => (
              <tr key={volunteer.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {volunteer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="user-name">{volunteer.name}</div>
                      <div className="user-joined">Joined {volunteer.joined}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="contact-info">
                    <div>{volunteer.email}</div>
                    <div className="phone">{volunteer.phone}</div>
                  </div>
                </td>

                <td>
                  <div className="password-field">{volunteer.password}</div>
                </td>

                <td>{volunteer.role}</td>

                <td>
                  <span
                    className={`status-badge ${
                      volunteer.status === "Active" ? "active" : "locked"
                    }`}
                  >
                    {volunteer.status}
                  </span>
                </td>

                <td>
                  <div className="actions">
                    <button
                      className="view-btn"
                      onClick={() => handleView(volunteer.id)}
                    >
                      Xem
                    </button>
                    {volunteer.status === "Active" ? (
                      <button
                        className="lock-btn"
                        onClick={() => handleLock(volunteer.id)}
                      >
                        Khóa
                      </button>
                    ) : (
                      <button
                        className="unlock-btn"
                        onClick={() => handleUnlock(volunteer.id)}
                      >
                        Mở khóa
                      </button>
                    )}
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(volunteer.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolunteerList;
