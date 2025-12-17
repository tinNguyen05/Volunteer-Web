import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { getAllBloodDonations, updateBloodDonationStatus } from '../../services/bloodDonationService';
import { showNotification } from '../../services/toastService';
import { 
  Search, Calendar, Phone, Mail, Droplet, 
  Clock, CheckCircle, XCircle, AlertCircle, X, MoreVertical
} from 'lucide-react';
import '../../assets/styles/blood-donation-admin.css';

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
      console.log('✅ API Response:', response);
      
      // Backend trả về: { success: true, data: [...], totalElements: X }
      if (response.success && response.data) {
        setDonations(response.data);
        showNotification(`Đã tải ${response.data.length} đăng ký từ database`, 'success');
      } else if (response.data) {
        // Trường hợp chỉ có data mà không có success flag
        setDonations(response.data);
      } else if (Array.isArray(response)) {
        // Trường hợp API trả về array trực tiếp
        setDonations(response);
      } else {
        console.warn('⚠️ No data available:', response);
        setDonations([]);
        showNotification('Không có dữ liệu hiến máu', 'info');
      }
    } catch (error) {
      console.error('❌ Error fetching donations:', error);
      showNotification('Lỗi khi tải dữ liệu từ database', 'error');
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (donationId, newStatus) => {
    try {
      console.log(`🔄 Đang cập nhật trạng thái ID ${donationId} -> ${newStatus}`);
      
      const response = await updateBloodDonationStatus(donationId, newStatus);
      console.log("✅ API Response:", response);
      
      // 👇 LOGIC KIỂM TRA MỚI: Lỏng hơn & An toàn hơn
      // Chấp nhận thành công nếu:
      // 1. Có cờ success: true
      // 2. HOẶC: Có data trả về chứa đúng id và status mới (trường hợp backend trả raw entity)
      const isSuccess = response?.success === true || 
                        (response?.id === donationId && response?.status === newStatus) ||
                        (response?.data?.id === donationId);

      if (isSuccess) {
        const statusLabels = {
          'ACCEPTED': 'chấp nhận',
          'REJECTED': 'từ chối',
          'CONFIRMED': 'xác nhận',
          'CANCELLED': 'hủy',
          'PENDING': 'chờ xử lý'
        };
        showNotification(`Đã ${statusLabels[newStatus] || newStatus} đăng ký hiến máu`, 'success');
        fetchDonations(); // Load lại bảng ngay lập tức
      } else {
        // Lấy message lỗi chi tiết hơn
        const errorMsg = response?.message || response?.error || "Phản hồi không hợp lệ từ server";
        console.warn('⚠️ Update failed logic:', response);
        showNotification(`Lỗi: ${errorMsg}`, 'error');
      }
    } catch (error) {
      console.error("🔥 EXCEPTION:", error);
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Lỗi kết nối server";
      
      showNotification(`Lỗi cập nhật: ${errorMessage}`, 'error');
    }
  };

  const filteredDonations = donations.filter(donation => {
    const matchesFilter = filter === 'all' || (donation.status || 'PENDING').toUpperCase() === filter.toUpperCase();
    const matchesSearch = 
      (donation.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donorEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.bloodType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusBadgeClass = (status) => {
    const normalizedStatus = (status || 'PENDING').toUpperCase();
    switch (normalizedStatus) {
      case 'PENDING':
        return 'badge-warning';
      case 'ACCEPTED':
        return 'badge-info';
      case 'CONFIRMED':
        return 'badge-success';
      case 'REJECTED':
        return 'badge-danger';
      case 'CANCELLED':
        return 'badge-secondary';
      default:
        return 'badge-default';
    }
  };

  const getStatusText = (status) => {
    const normalizedStatus = (status || 'PENDING').toUpperCase();
    switch (normalizedStatus) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'ACCEPTED':
        return 'Đã chấp nhận';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'REJECTED':
        return 'Đã từ chối';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const bloodTypeStats = donations.reduce((acc, donation) => {
    const bloodType = donation.bloodType || donation.blood_type;
    if (bloodType) {
      acc[bloodType] = (acc[bloodType] || 0) + 1;
    }
    return acc;
  }, {});

  const stats = {
    total: donations.length,
    pending: donations.filter(d => d.status === 'pending' || !d.status).length,
    confirmed: donations.filter(d => d.status === 'confirmed').length,
    completed: donations.filter(d => d.status === 'completed').length
  };

  return (
    <div className="blood-donation-container">
      <Sidebar />
      
      <main className="blood-main-content">
        {/* Header */}
        <header className="blood-page-header">
          <div className="blood-page-header-title">
            <h1>
              <Droplet size={32} style={{ color: '#ef4444' }} />
              Quản Lý Hiến Máu
            </h1>
            <p>Quản lý đăng ký và theo dõi người hiến máu</p>
          </div>
        </header>

        {/* Statistics Section */}
        <section className="blood-stats-section">
          <div className="blood-stats-grid">
            <div className="blood-stat-card" style={{ '--accent-color': '#ef4444' }}>
              <div className="blood-stat-icon">🩸</div>
              <div className="blood-stat-content">
                <h3 className="blood-stat-value">{stats.total}</h3>
                <p className="blood-stat-label">Tổng đăng ký</p>
              </div>
            </div>

            <div className="blood-stat-card" style={{ '--accent-color': '#f59e0b' }}>
              <div className="blood-stat-icon">⏳</div>
              <div className="blood-stat-content">
                <h3 className="blood-stat-value">{stats.pending}</h3>
                <p className="blood-stat-label">Chờ xử lý</p>
              </div>
            </div>

            <div className="blood-stat-card" style={{ '--accent-color': '#10b981' }}>
              <div className="blood-stat-icon">✅</div>
              <div className="blood-stat-content">
                <h3 className="blood-stat-value">{stats.accepted}</h3>
                <p className="blood-stat-label">Đã chấp nhận</p>
              </div>
            </div>

            <div className="blood-stat-card" style={{ '--accent-color': '#3b82f6' }}>
              <div className="blood-stat-icon">✔️</div>
              <div className="blood-stat-content">
                <h3 className="blood-stat-value">{stats.confirmed}</h3>
                <p className="blood-stat-label">Đã xác nhận</p>
              </div>
            </div>

            <div className="blood-stat-card" style={{ '--accent-color': '#ef4444' }}>
              <div className="blood-stat-icon">❌</div>
              <div className="blood-stat-content">
                <h3 className="blood-stat-value">{stats.rejected}</h3>
                <p className="blood-stat-label">Đã từ chối</p>
              </div>
            </div>

            <div className="blood-stat-card" style={{ '--accent-color': '#6b7280' }}>
              <div className="blood-stat-icon">🚫</div>
              <div className="blood-stat-content">
                <h3 className="blood-stat-value">{stats.cancelled}</h3>
                <p className="blood-stat-label">Đã hủy</p>
              </div>
            </div>
          </div>
        </section>

        {/* Blood Type Distribution */}
        {Object.keys(bloodTypeStats).length > 0 && (
          <section className="blood-type-section">
            <h2>
              <Droplet size={24} style={{ color: '#ef4444' }} />
              Phân bố nhóm máu
            </h2>
            <div className="blood-type-grid">
              {Object.entries(bloodTypeStats).sort().map(([type, count]) => (
                <div key={type} className="blood-type-card">
                  <div className="blood-type-name">{type}</div>
                  <div className="blood-type-count">{count}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <div className="blood-filters-container">
          <div className="blood-search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, nhóm máu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="blood-filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="PENDING">⏳ Chờ xử lý</option>
            <option value="ACCEPTED">✅ Đã chấp nhận</option>
            <option value="CONFIRMED">✔️ Đã xác nhận</option>
            <option value="REJECTED">❌ Đã từ chối</option>
            <option value="CANCELLED">🚫 Đã hủy</option>
          </select>

          {(searchTerm || filter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              className="blood-btn-clear"
            >
              <X size={16} />
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Donations Table */}
        {loading ? (
          <div className="blood-loading-container">
            <div className="blood-loading-spinner"></div>
            <p className="blood-loading-text">Đang tải dữ liệu...</p>
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="blood-empty-state">
            <div className="blood-empty-icon">🩸</div>
            <h3 className="blood-empty-title">Không tìm thấy đăng ký</h3>
            <p className="blood-empty-text">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <div className="blood-table-container">
            <table className="blood-data-table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Người hiến máu</th>
                  <th style={{ width: '18%' }}>Liên hệ</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>Nhóm máu</th>
                  <th style={{ width: '15%' }}>Ngày đăng ký</th>
                  <th style={{ width: '20%' }}>Ghi chú sức khỏe</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>Trạng thái</th>
                  <th style={{ width: '7%', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation) => {
                  const donorName = donation.fullName || donation.full_name || 'Unknown';
                  const donorEmail = donation.email || '';
                  const donorPhone = donation.phoneNumber || donation.phone_number || '';
                  const bloodType = donation.bloodType || donation.blood_type || '';
                  const desiredDate = donation.desiredDate || donation.desired_date || donation.registrationDate || donation.registration_date || '';
                  const createdDate = donation.createdAt || donation.created_at || '';
                  const medicalHistory = donation.medicalHistory || donation.medical_history || donation.healthNote || donation.health_note || '';
                  const donationId = donation.id || donation._id;
                  const status = (donation.status || 'PENDING').toUpperCase();

                  return (
                    <tr key={donationId}>
                      {/* Donor Name with Avatar */}
                      <td>
                        <div className="blood-user-info">
                          <div className="blood-user-avatar">
                            {donorName.charAt(0).toUpperCase()}
                          </div>
                          <div className="blood-user-name">{donorName}</div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td>
                        <div className="blood-contact-info">
                          <div className="blood-contact-item">
                            <Mail size={14} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {donorEmail || '-'}
                            </span>
                          </div>
                          <div className="blood-contact-item">
                            <Phone size={14} />
                            <span>{donorPhone || '-'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Blood Type */}
                      <td style={{ textAlign: 'center' }}>
                        <div className="blood-type-badge">
                          {bloodType || '-'}
                        </div>
                      </td>

                      {/* Desired Date */}
                      <td>
                        <div className="blood-contact-info">
                          <div className="blood-contact-item">
                            <Calendar size={14} />
                            <span>{desiredDate ? new Date(desiredDate).toLocaleDateString('vi-VN') : '-'}</span>
                          </div>
                          <div className="blood-contact-item" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            <Clock size={12} />
                            <span>Tạo: {createdDate ? new Date(createdDate).toLocaleDateString('vi-VN') : '-'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Medical History */}
                      <td>
                        {medicalHistory ? (
                          <p style={{ 
                            fontSize: '0.875rem', 
                            color: '#475569', 
                            lineHeight: '1.4', 
                            margin: 0,
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            display: '-webkit-box', 
                            WebkitLineClamp: 2, 
                            WebkitBoxOrient: 'vertical' 
                          }} title={medicalHistory}>
                            {medicalHistory}
                          </p>
                        ) : (
                          <span style={{ fontSize: '0.875rem', color: '#cbd5e1', fontStyle: 'italic' }}>Không có</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td style={{ textAlign: 'center' }}>
                        <span className={`blood-status-badge ${status.toLowerCase()}`}>
                          {status === 'CONFIRMED' && <CheckCircle size={14} />}
                          {status === 'CANCELLED' && <XCircle size={14} />}
                          {status === 'REJECTED' && <XCircle size={14} />}
                          {status === 'ACCEPTED' && <CheckCircle size={14} />}
                          {status === 'PENDING' && <AlertCircle size={14} />}
                          {getStatusText(status)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                          {status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(donationId, 'ACCEPTED')}
                                className="blood-action-btn"
                                style={{ backgroundColor: '#d1fae5', color: '#10b981' }}
                                title="Chấp nhận"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(donationId, 'REJECTED')}
                                className="blood-action-btn"
                                style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}
                                title="Từ chối"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                          {status === 'ACCEPTED' && (
                            <button
                              onClick={() => handleStatusUpdate(donationId, 'CONFIRMED')}
                              className="blood-action-btn"
                              style={{ backgroundColor: '#dbeafe', color: '#3b82f6' }}
                              title="Xác nhận hoàn tất"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {(status === 'ACCEPTED' || status === 'CONFIRMED') && (
                            <button
                              onClick={() => handleStatusUpdate(donationId, 'CANCELLED')}
                              className="blood-action-btn"
                              style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
                              title="Hủy đăng ký"
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
