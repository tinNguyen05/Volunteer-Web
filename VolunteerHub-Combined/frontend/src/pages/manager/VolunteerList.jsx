import React, { useState } from "react";
import "../../assets/styles/user-list.css";
import Sidebar from "../../components/common/Sidebar";

const VolunteerList = () => {
  const [volunteers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "vana@example.com",
      phone: "0123456789",
      status: "Đã duyệt",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "thib@example.com",
      phone: "0987654321",
      status: "Đã duyệt",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@example.com",
      phone: "0911222333",
      status: "Đã duyệt",
    },
  ]);

  return (
    <div className="UserManagement-container">
      <Sidebar />

      <div className="user-table-container">
        <h2 style={{ marginBottom: "10px" }}>
          Danh sách tình nguyện viên sự kiện đang diễn ra
        </h2>

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
                  <span className="status-badge approved">
                    {vol.status}
                  </span>
                </td>

                <td>
                  <div className="actions">--</div>
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
