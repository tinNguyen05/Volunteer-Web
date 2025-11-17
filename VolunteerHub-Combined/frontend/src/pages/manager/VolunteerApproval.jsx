import React, { useState } from "react";
import "../../assets/styles/user-list.css";
import Sidebar from "../../components/common/Sidebar";

const VolunteerApprove = () => {
  const [volunteers, setVolunteers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "vana@example.com",
      phone: "0123456789",
      status: "Chờ duyệt",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "thib@example.com",
      phone: "0987654321",
      status: "Đã duyệt",
    },
  ]);

  // ✅ Duyệt tình nguyện viên
  const handleApprove = (id) => {
    setVolunteers((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: "Đã duyệt" } : v
      )
    );
    alert("✅ Tình nguyện viên đã được duyệt!");
  };

  // 🗑️ Xóa tình nguyện viên
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tình nguyện viên này không?")) {
      setVolunteers((prev) => prev.filter((v) => v.id !== id));
      alert("🗑️ Đã xóa tình nguyện viên.");
    }
  };

  return (
    <div className="UserManagement-container">
      <Sidebar />

      <div className="user-table-container">
        <h2 style={{ marginBottom: "10px" }}>Phê duyệt tình nguyện viên</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {volunteers.map((vol) => (
              <tr key={vol.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {vol.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="user-name">{vol.name}</div>
                  </div>
                </td>

                <td>
                  <div className="contact-info">
                    <div>{vol.email}</div>
                    <div className="phone">{vol.phone}</div>
                  </div>
                </td>

                <td>
                  <span
                    className={`status-badge ${
                      vol.status === "Đã duyệt" ? "approved" : "pending"
                    }`}
                  >
                    {vol.status}
                  </span>
                </td>

                <td>
                  <div className="actions">
                    {vol.status === "Chờ duyệt" ? (
                      <button
                        className="approve"
                        onClick={() => handleApprove(vol.id)}
                      >
                        Duyệt
                      </button>
                    ) : (
                      <button
                        className="delete"
                        onClick={() => handleDelete(vol.id)}
                      >
                        Xóa
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

export default VolunteerApprove;
