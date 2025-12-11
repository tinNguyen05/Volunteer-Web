import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { getAllBloodDonations, updateBloodDonationStatus } from '../../services/bloodDonationService';
import { showNotification } from '../../services/toastService';
import '../../assets/styles/events.css';

export default function BloodDonationManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || (user.role !== 'ADMIN' && user.role !== 'EVENT_MANAGER')) {
      navigate('/dashboard');
      return;
    }
    fetchDonations();
  }, [user, navigate]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await getAllBloodDonations();
      if (response.success) {
        setDonations(response.data.donations || []);
      } else {
        showNotification(response.error, 'error');
      }
    } catch (error) {
      showNotification('Không thể tải danh sách đăng ký hiến máu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (donationId, newStatus) => {
    try {
      const response = await updateBloodDonationStatus(donationId, newStatus);
      if (response.success) {
        showNotification(`Đã cập nhật trạng thái thành ${newStatus}`, 'success');
        fetchDonations();
      } else {
        showNotification(response.error, 'error');
      }
    } catch (error) {
      showNotification('Không thể cập nhật trạng thái', 'error');
    }
  };

  const filteredDonations = donations.filter(donation => {
    const matchesFilter = filter === 'all' || donation.status === filter;
    const matchesSearch = 
      donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.bloodType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'confirmed':
        return 'badge-info';
      case 'completed':
        return 'badge-success';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const bloodTypeStats = donations.reduce((acc, donation) => {
    acc[donation.bloodType] = (acc[donation.bloodType] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: '280px', padding: '32px', overflowY: 'auto', maxWidth: 'calc(100vw - 280px)' }}>
          <div className="loading-spinner">Đang tải...</div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '280px', padding: '32px', overflowY: 'auto', maxWidth: 'calc(100vw - 280px)' }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Quản lý hiến máu</h1>
            <p className="page-subtitle">Quản lý đăng ký và lịch sử hiến máu</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{donations.length}</div>
            <div className="stat-label">Tổng đăng ký</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {donations.filter(d => d.status === 'pending').length}
            </div>
            <div className="stat-label">Chờ xác nhận</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {donations.filter(d => d.status === 'confirmed').length}
            </div>
            <div className="stat-label">Đã xác nhận</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {donations.filter(d => d.status === 'completed').length}
            </div>
            <div className="stat-label">Hoàn thành</div>
          </div>
        </div>

        {/* Blood Type Distribution */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 className="card-title">Phân bố nhóm máu</h3>
          <div className="blood-type-grid">
            {Object.entries(bloodTypeStats).sort().map(([type, count]) => (
              <div key={type} className="blood-type-item">
                <span className="blood-type-label">{type}</span>
                <span className="blood-type-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, nhóm máu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              Tất cả ({donations.length})
            </button>
            <button
              className={filter === 'pending' ? 'active' : ''}
              onClick={() => setFilter('pending')}
            >
              Chờ xác nhận ({donations.filter(d => d.status === 'pending').length})
            </button>
            <button
              className={filter === 'confirmed' ? 'active' : ''}
              onClick={() => setFilter('confirmed')}
            >
              Đã xác nhận ({donations.filter(d => d.status === 'confirmed').length})
            </button>
            <button
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => setFilter('completed')}
            >
              Hoàn thành ({donations.filter(d => d.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Donations Table */}
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Người hiến</th>
                  <th>Email</th>
                  <th>SĐT</th>
                  <th>Nhóm máu</th>
                  <th>Ngày mong muốn</th>
                  <th>Ngày đăng ký</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                      Không có đăng ký nào
                    </td>
                  </tr>
                ) : (
                  filteredDonations.map((donation) => (
                    <tr key={donation._id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {donation.donorName[0].toUpperCase()}
                          </div>
                          <span>{donation.donorName}</span>
                        </div>
                      </td>
                      <td>{donation.donorEmail}</td>
                      <td>{donation.donorPhone}</td>
                      <td>
                        <span className="blood-type-badge">{donation.bloodType}</span>
                      </td>
                      <td>{new Date(donation.preferredEventDate).toLocaleDateString('vi-VN')}</td>
                      <td>{new Date(donation.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(donation.status)}`}>
                          {getStatusText(donation.status)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {donation.status === 'pending' && (
                            <>
                              <button
                                className="btn-icon btn-success"
                                onClick={() => handleStatusUpdate(donation._id, 'confirmed')}
                                title="Xác nhận"
                              >
                                ✓
                              </button>
                              <button
                                className="btn-icon btn-error"
                                onClick={() => handleStatusUpdate(donation._id, 'cancelled')}
                                title="Hủy"
                              >
                                ✕
                              </button>
                            </>
                          )}
                          {donation.status === 'confirmed' && (
                            <button
                              className="btn-icon btn-info"
                              onClick={() => handleStatusUpdate(donation._id, 'completed')}
                              title="Hoàn thành"
                            >
                              ✓✓
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <style jsx>{`
        .blood-type-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }
        .blood-type-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
        }
        .blood-type-label {
          font-size: 20px;
          font-weight: 700;
        }
        .blood-type-count {
          font-size: 24px;
          font-weight: 800;
          margin-top: 8px;
        }
        .blood-type-badge {
          display: inline-block;
          padding: 4px 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
        }
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        .btn-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          transition: all 0.3s ease;
        }
        .btn-success {
          background: #10b981;
          color: white;
        }
        .btn-success:hover {
          background: #059669;
        }
        .btn-error {
          background: #ef4444;
          color: white;
        }
        .btn-error:hover {
          background: #dc2626;
        }
        .btn-info {
          background: #3b82f6;
          color: white;
        }
        .btn-info:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
}
