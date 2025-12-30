import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Check, X, Trash2, Lock, Unlock, Search, Filter, 
  UserCheck, Clock, Ban, Users, AlertCircle, 
  Mail, Calendar, Shield 
} from 'lucide-react';
import Sidebar from "../../components/common/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { getAllUserAuth, approveUser, banUser, unbanUser, deleteUser } from "../../services/userAuthService";

const UserManagementBankDash = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const getRoleDisplay = (role) => {
    const roleMap = {
      USER: "Volunteer",
      EVENT_MANAGER: "Manager",
      ADMIN: "Admin"
    };
    return roleMap[role] || role;
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      PENDING: "Chờ duyệt",
      ACTIVE: "Hoạt động",
      LOCKED: "Đã khóa",
      DISABLED: "Vô hiệu hóa"
    };
    return statusMap[status] || status;
  };

  const getRoleBadgeStyle = (role) => {
    const styleMap = {
      USER: { bg: '#E0F2FE', text: '#0369A1', icon: '👤' },
      EVENT_MANAGER: { bg: '#DDD6FE', text: '#5B21B6', icon: '👨‍💼' },
      ADMIN: { bg: '#FEE2E2', text: '#991B1B', icon: '👑' }
    };
    return styleMap[role] || styleMap.USER;
  };

  const getStatusBadgeStyle = (status) => {
    const styleMap = {
      PENDING: { bg: '#FEF3C7', text: '#92400E', icon: '⏳' },
      ACTIVE: { bg: '#D1FAE5', text: '#065F46', icon: '✅' },
      LOCKED: { bg: '#FEE2E2', text: '#991B1B', icon: '🔒' },
      DISABLED: { bg: '#F3F4F6', text: '#6B7280', icon: '🚫' }
    };
    return styleMap[status] || styleMap.DISABLED;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUserAuth();
      
      if (response.success && response.data) {
        const mapped = response.data.map(userAuth => ({
          id: userAuth.userId,
          username: userAuth.email.split('@')[0],
          email: userAuth.email,
          role: userAuth.role,
          status: userAuth.status,
          emailVerified: userAuth.emailVerified,
          createdAt: userAuth.createdAt || new Date().toISOString()
        }));
        setAllUsers(mapped);
      } else {
        setAllUsers([]);
        setError(response.error || "Không thể tải danh sách người dùng");
      }
    } catch (error) {
      setAllUsers([]);
      setError(error.message || "Đã xảy ra lỗi khi tải dữ liệu");
      showNotification("Không thể tải danh sách người dùng", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (user.role !== "ADMIN") {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;
    fetchUsers();
  }, [user]);

  const filteredUsers = () => {
    let filtered = allUsers;
    
    if (roleFilter !== "ALL") {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(u => u.status === statusFilter);
    }
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleApprove = async (userId) => {
    try {
      const response = await approveUser(userId);
      if (response.success) {
        showNotification("Đã duyệt tài khoản thành công", "success");
        fetchUsers();
      } else {
        showNotification(response.error || "Không thể duyệt tài khoản", "error");
      }
    } catch (error) {
      showNotification("Đã xảy ra lỗi khi duyệt tài khoản", "error");
    }
  };

  const handleBan = async (userId) => {
    if (!window.confirm("Bạn có chắc muốn khóa tài khoản này?")) return;
    
    try {
      const response = await banUser(userId);
      if (response.success) {
        showNotification("Đã khóa tài khoản", "success");
        fetchUsers();
      } else {
        showNotification(response.error || "Không thể khóa tài khoản", "error");
      }
    } catch (error) {
      showNotification("Đã xảy ra lỗi khi khóa tài khoản", "error");
    }
  };

  const handleUnban = async (userId) => {
    try {
      const response = await unbanUser(userId);
      if (response.success) {
        showNotification("Đã mở khóa tài khoản", "success");
        fetchUsers();
      } else {
        showNotification(response.error || "Không thể mở khóa tài khoản", "error");
      }
    } catch (error) {
      showNotification("Đã xảy ra lỗi khi mở khóa tài khoản", "error");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("⚠️ Bạn có chắc muốn XÓA VĨNH VIỄN tài khoản này?\n\nHành động này KHÔNG THỂ HOÀN TÁC!")) return;
    
    try {
      const response = await deleteUser(userId);
      if (response.success) {
        showNotification("Đã xóa tài khoản", "success");
        fetchUsers();
      } else {
        showNotification(response.error || "Không thể xóa tài khoản", "error");
      }
    } catch (error) {
      showNotification("Đã xảy ra lỗi khi xóa tài khoản", "error");
    }
  };

  const stats = {
    total: allUsers.length,
    pending: allUsers.filter(u => u.status === 'PENDING').length,
    active: allUsers.filter(u => u.status === 'ACTIVE').length,
    locked: allUsers.filter(u => u.status === 'LOCKED').length
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        {/* Page Header */}
        <header className="page-header">
          <div className="page-header-title">
            <h1 className="page-title">Quản Lý Người Dùng 👥</h1>
            <p className="page-subtitle">Duyệt, khóa và quản lý tài khoản người dùng hệ thống</p>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card" style={{ '--accent-color': '#10b981' }}>
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.total}</h3>
                <p className="stat-label">Tổng người dùng</p>
              </div>
            </div>

            <div className="stat-card" style={{ '--accent-color': '#f59e0b' }}>
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.pending}</h3>
                <p className="stat-label">Chờ duyệt</p>
              </div>
            </div>

            <div className="stat-card" style={{ '--accent-color': '#10b981' }}>
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.active}</h3>
                <p className="stat-label">Hoạt động</p>
              </div>
            </div>

            <div className="stat-card" style={{ '--accent-color': '#ef4444' }}>
              <div className="stat-icon">🔒</div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.locked}</h3>
                <p className="stat-label">Đã khóa</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="filters-container">
          <div className="search-box">
            <Search className="w-5 h-5" style={{ color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Tìm kiếm email, username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="USER">👤 Volunteer</option>
            <option value="EVENT_MANAGER">👨‍💼 Manager</option>
            <option value="ADMIN">👑 Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">⏳ Chờ duyệt</option>
            <option value="ACTIVE">✅ Hoạt động</option>
            <option value="LOCKED">🔒 Đã khóa</option>
          </select>

          {(searchTerm || roleFilter !== "ALL" || statusFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("ALL");
                setStatusFilter("ALL");
              }}
              className="btn-secondary btn-sm"
            >
              <X className="w-4 h-4" />
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Table */}
        <div className="table-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <div className="empty-state-icon">⚠️</div>
              <h3 className="empty-state-title">Đã xảy ra lỗi</h3>
              <p className="empty-state-text">{error}</p>
            </div>
          ) : filteredUsers().length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h3 className="empty-state-title">Không tìm thấy người dùng</h3>
              <p className="empty-state-text">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers().map((u) => {
                  const roleBadge = getRoleBadgeStyle(u.role);
                  const statusBadge = getStatusBadgeStyle(u.status);
                  
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {u.username[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="user-details">
                            <span className="user-name">{u.username}</span>
                            <span className="user-meta">
                              <Mail className="w-3 h-3" style={{ display: 'inline', marginRight: '4px' }} />
                              {u.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: roleBadge.bg, color: roleBadge.text }}
                        >
                          <span>{roleBadge.icon}</span>
                          {getRoleDisplay(u.role)}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: statusBadge.bg, color: statusBadge.text }}
                        >
                          <span>{statusBadge.icon}</span>
                          {getStatusDisplay(u.status)}
                        </span>
                      </td>
                      <td className="user-meta">
                        <Calendar className="w-4 h-4" style={{ display: 'inline', marginRight: '4px' }} />
                        {formatDate(u.createdAt)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          {u.status === 'PENDING' && (
                            <button
                              onClick={() => handleApprove(u.id)}
                              className="btn-sm"
                              style={{ background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer' }}
                              title="Duyệt"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {u.status === 'ACTIVE' && u.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleBan(u.id)}
                              className="btn-sm"
                              style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer' }}
                              title="Khóa"
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          )}
                          {u.status === 'LOCKED' && (
                            <button
                              onClick={() => handleUnban(u.id)}
                              className="btn-sm"
                              style={{ background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer' }}
                              title="Mở khóa"
                            >
                              <Unlock className="w-4 h-4" />
                            </button>
                          )}
                          {u.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleDelete(u.id)}
                              className="btn-sm"
                              style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer' }}
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Help Section */}
        <div className="alert alert-info">
          <AlertCircle className="w-5 h-5" />
          <div>
            <strong>Hướng dẫn:</strong> Mật khẩu mặc định <code style={{ background: '#dbeafe', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>123456789abc</code> cho tài khoản mới. Manager cần duyệt trước khi đăng nhập. Volunteer kích hoạt ngay.
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagementBankDash;
