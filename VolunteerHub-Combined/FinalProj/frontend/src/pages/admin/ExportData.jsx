import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/common/Sidebar";
import { useAuth } from '../../contexts/AuthContext';
import { exportData } from '../../services/exportService';
import { showNotification as showToast } from '../../services/toastService';
import { Download, Calendar, Filter, FileText, Database } from 'lucide-react';
import '../../assets/styles/unified-dashboard.css';

export default function ExportData() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exportType, setExportType] = useState('events');
  const [format, setFormat] = useState('csv');
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'all'
  });

  // Check if user has admin role
  useEffect(() => {
    if (!user) return;
    if (user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const handleExport = async () => {
    try {
      setExporting(true);
      
      const params = {
        type: exportType,
        format: format,
        ...filters
      };

      const response = await exportData(params);
      
      if (response.success) {
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `${exportType}_${timestamp}.${format}`;
        link.setAttribute('download', fileName);
        
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        showToast(`Đã xuất dữ liệu thành công: ${fileName}`, 'success');
      } else {
        showToast(response.error || 'Không thể xuất dữ liệu', 'error');
      }
    } catch (error) {
      console.error('Export error:', error);
      showToast('Lỗi khi xuất dữ liệu', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const exportOptions = [
    { value: 'events', label: 'Sự kiện', icon: '📅' },
    { value: 'users', label: 'Người dùng', icon: '👥' },
    { value: 'registrations', label: 'Đăng ký tham gia', icon: '📝' },
    { value: 'posts', label: 'Bài viết', icon: '📰' },
    { value: 'comments', label: 'Bình luận', icon: '💬' },
    { value: 'blood-donations', label: 'Hiến máu', icon: '🩸' }
  ];

  // Show loading while checking auth
  if (!user) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Đang tải...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        {/* Header */}
        <header className="page-header">
          <div className="page-header-title">
            <h1 className="page-title">Xuất Dữ Liệu Hệ Thống 📊</h1>
            <p className="page-subtitle">Tải xuống dữ liệu dưới dạng CSV hoặc JSON</p>
          </div>
        </header>

        <div className="content-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Export Type Selection */}
          <div className="form-group">
            <label className="form-label">
              <Database className="w-4 h-4" style={{ display: 'inline', marginRight: '0.5rem' }} />
              Loại dữ liệu
            </label>
            <select 
              value={exportType} 
              onChange={(e) => setExportType(e.target.value)}
              className="form-select"
            >
              {exportOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Format Selection */}
          <div className="form-group">
            <label className="form-label">
              <FileText className="w-4 h-4" style={{ display: 'inline', marginRight: '0.5rem' }} />
              Định dạng file
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: `2px solid ${format === 'csv' ? '#10b981' : '#e2e8f0'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                backgroundColor: format === 'csv' ? '#ecfdf5' : 'white',
                transition: 'all 0.2s'
              }}>
                <input 
                  type="radio" 
                  name="format" 
                  value="csv" 
                  checked={format === 'csv'}
                  onChange={(e) => setFormat(e.target.value)}
                  style={{ 
                    marginRight: '0.75rem',
                    width: '18px',
                    height: '18px',
                    accentColor: '#10b981'
                  }}
                />
                <span style={{ fontWeight: 500, fontSize: '0.95rem', color: '#0f172a' }}>📊 CSV</span>
              </label>
              
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: `2px solid ${format === 'json' ? '#10b981' : '#e2e8f0'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                backgroundColor: format === 'json' ? '#ecfdf5' : 'white',
                transition: 'all 0.2s'
              }}>
                <input 
                  type="radio" 
                  name="format" 
                  value="json" 
                  checked={format === 'json'}
                  onChange={(e) => setFormat(e.target.value)}
                  style={{ 
                    marginRight: '0.75rem',
                    width: '18px',
                    height: '18px',
                    accentColor: '#10b981'
                  }}
                />
                <span style={{ fontWeight: 500, fontSize: '0.95rem', color: '#0f172a' }}>📄 JSON</span>
              </label>
            </div>
          </div>

          {/* Filters */}
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '1.5rem', 
            borderRadius: '12px',
            marginTop: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ 
              fontSize: '0.95rem', 
              fontWeight: 600, 
              marginBottom: '1rem', 
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Filter className="w-4 h-4" />
              Bộ lọc (tùy chọn)
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <Calendar className="w-3.5 h-3.5" style={{ display: 'inline', marginRight: '0.5rem' }} />
                  Từ ngày
                </label>
                <input 
                  type="date" 
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="form-input"
                  style={{ fontSize: '0.875rem' }}
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <Calendar className="w-3.5 h-3.5" style={{ display: 'inline', marginRight: '0.5rem' }} />
                  Đến ngày
                </label>
                <input 
                  type="date" 
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="form-input"
                  style={{ fontSize: '0.875rem' }}
                />
              </div>
            </div>

            {(exportType === 'events' || exportType === 'registrations') && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Trạng thái
                </label>
                <select 
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="form-select"
                  style={{ fontSize: '0.875rem' }}
                >
                  <option value="all">Tất cả</option>
                  {exportType === 'events' && (
                    <>
                      <option value="approved">Đã duyệt</option>
                      <option value="pending">Chờ duyệt</option>
                      <option value="ongoing">Đang diễn ra</option>
                      <option value="completed">Đã hoàn thành</option>
                    </>
                  )}
                  {exportType === 'registrations' && (
                    <>
                      <option value="pending">Chờ duyệt</option>
                      <option value="approved">Đã duyệt</option>
                      <option value="rejected">Từ chối</option>
                    </>
                  )}
                </select>
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              backgroundColor: exporting ? '#94a3b8' : '#10b981',
              cursor: exporting ? 'not-allowed' : 'pointer'
            }}
          >
            {exporting ? (
              <>
                <span style={{ fontSize: '1.25rem' }}>⏳</span>
                <span>Đang xuất dữ liệu...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Xuất dữ liệu</span>
              </>
            )}
          </button>

          {/* Info Box */}
          <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
            <strong>ℹ️ Lưu ý:</strong> Dữ liệu được xuất sẽ tuân theo bộ lọc đã chọn. 
            Nếu không chọn bộ lọc, tất cả dữ liệu sẽ được xuất.
          </div>
        </div>
      </main>
    </div>
  );
}