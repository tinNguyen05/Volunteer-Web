import React, { useState, useEffect } from "react";
import "../../assets/styles/user-list.css";
import "../../components/common/Sidebar";
import Sidebar from "../../components/common/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";

const UserList = () => {
  const { pendingManagers, approveManager } = useAuth();
  const { showNotification } = useNotification();
  const [users, setUsers] = useState([]);

  // Only show managers in this page
  useEffect(() => {
    const managersFromPending = pendingManagers.map(manager => ({
      id: manager.id,
      name: manager.name,
      email: manager.email,
      password: manager.password,
      phone: manager.phone,
      role: "Quản lý",
      status: manager.locked ? "Locked" : (manager.approved ? "Active" : "Pending"),
      joined: new Date(manager.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isManager: true
    }));
    
    setUsers(managersFromPending);
  }, [pendingManagers]);

  const handleApprove = (id) => {
    // Update manager's approved status in localStorage
    const updatedManagers = pendingManagers.map(m => 
      m.id === id ? { ...m, approved: true } : m
    );
    localStorage.setItem('vh_pending_managers', JSON.stringify(updatedManagers));
    
    approveManager(id);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "Active" } : u))
    );
    showNotification("Đã phê duyệt quản lý thành công!", "success");
    
    // Force reload to sync with context
    setTimeout(() => window.location.reload(), 500);
  };

  const handleLock = (id) => {
    const updatedManagers = pendingManagers.map(m => 
      m.id === id ? { ...m, locked: true } : m
    );
    localStorage.setItem('vh_pending_managers', JSON.stringify(updatedManagers));

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "Locked" } : u))
    );
    showNotification("Đã khóa tài khoản", "info");
    
    // Force reload to sync with context
    setTimeout(() => window.location.reload(), 500);
  };

  const handleUnlock = (id) => {
    const updatedManagers = pendingManagers.map(m => 
      m.id === id ? { ...m, locked: false } : m
    );
    localStorage.setItem('vh_pending_managers', JSON.stringify(updatedManagers));

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "Active" } : u))
    );
    showNotification("Đã mở khóa tài khoản", "success");
    
    // Force reload to sync with context
    setTimeout(() => window.location.reload(), 500);
  };

  const handleView = (id) => {
    const user = users.find((u) => u.id === id);
    alert(`Xem thông tin: ${user.name}\nEmail: ${user.email}\nSĐT: ${user.phone}\nVai trò: ${user.role}\nMật khẩu: ${user.password}`);
  };

  const handleDelete = (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    if (window.confirm(`Bạn có chắc muốn xóa quản lý ${user.name}?`)) {
      const updatedManagers = pendingManagers.filter(m => m.id !== id);
      localStorage.setItem('vh_pending_managers', JSON.stringify(updatedManagers));
      
      setUsers(prev => prev.filter(u => u.id !== id));
      showNotification('Đã xóa quản lý thành công!', 'success');
      
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
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="user-name">{user.name}</div>
                      <div className="user-joined">Joined {user.joined}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="contact-info">
                    <div>{user.email}</div>
                    <div className="phone">{user.phone}</div>
                  </div>
                </td>

                <td>
                  <div className="password-field">{user.password}</div>
                </td>

                <td>{user.role}</td>

                <td>
                  <span
                    className={`status-badge ${
                      user.status === "Active" ? "active" : user.status === "Pending" ? "pending" : "locked"
                    }`}
                  >
                    {user.status === "Pending" ? "Chờ duyệt" : user.status}
                  </span>
                </td>

                <td>
                  <div className="actions">
                    <button
                      className="view-btn"
                      onClick={() => handleView(user.id)}
                    >
                      Xem
                    </button>
                    {user.status === "Pending" ? (
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(user.id)}
                      >
                        Phê duyệt
                      </button>
                    ) : user.status === "Active" ? (
                      <button
                        className="lock-btn"
                        onClick={() => handleLock(user.id)}
                      >
                        Khóa
                      </button>
                    ) : (
                      <button
                        className="unlock-btn"
                        onClick={() => handleUnlock(user.id)}
                      >
                        Mở khóa
                      </button>
                    )}
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user.id)}
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

export default UserList;
