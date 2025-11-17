import React, { useState } from "react";
import "../../assets/styles/user-list.css";
import "../../components/common/Sidebar";
import Sidebar from "../../components/common/Sidebar";

const UserList = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "vana@example.com",
      phone: "0123456789",
      role: "Tình nguyện viên",
      status: "Active",
      joined: "Apr 18, 2025",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "thib@example.com",
      phone: "0987654321",
      role: "Quản lý",
      status: "Locked",
      joined: "Apr 20, 2025",
    },
  ]);

  const handleLock = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "Locked" } : u))
    );
  };

  const handleUnlock = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "Active" } : u))
    );
  };

  const handleView = (id) => {
    const user = users.find((u) => u.id === id);
    alert(`Xem thông tin: ${user.name}`);
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

                <td>{user.role}</td>

                <td>
                  <span
                    className={`status-badge ${
                      user.status === "Active" ? "active" : "locked"
                    }`}
                  >
                    {user.status}
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
                    {user.status === "Active" ? (
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
