import React, { useState } from 'react';
import Sidebar from "../../components/common/Sidebar";
import { exportData } from '../../services/exportService';
import { showNotification as showToast } from '../../services/toastService';
import '../../assets/styles/events.css';

export default function ExportData() {
  const [exportType, setExportType] = useState('events');
  const [format, setFormat] = useState('csv');
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'all'
  });

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
        
        showToast(`✅ Đã xuất dữ liệu thành công: ${fileName}`, 'success');
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

  return (
    <div className="EventsVolunteer-container">
      <Sidebar />
      <div className="events-container">
        <main className="main-content">
          <div className="events-header">
            <h2>Xuất dữ liệu hệ thống</h2>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {/* Export Type Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                marginBottom: '8px',
                color: '#374151'
              }}>
                Loại dữ liệu
              </label>
              <select 
                value={exportType} 
                onChange={(e) => setExportType(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '10px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'white'
                }}
              >
                <option value="events">📅 Sự kiện</option>
                <option value="users">👥 Người dùng</option>
                <option value="registrations">📝 Đăng ký tham gia</option>
                <option value="posts">📰 Bài viết</option>
                <option value="comments">💬 Bình luận</option>
                <option value="notifications">🔔 Thông báo</option>
              </select>
            </div>

            {/* Format Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 600, 
                marginBottom: '8px',
                color: '#374151'
              }}>
                Định dạng file
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label style={{ 
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  border: `2px solid ${format === 'csv' ? '#3b82f6' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: format === 'csv' ? '#eff6ff' : 'white'
                }}>
                  <input 
                    type="radio" 
                    name="format" 
                    value="csv" 
                    checked={format === 'csv'}
                    onChange={(e) => setFormat(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontWeight: 500 }}>📊 CSV</span>
                </label>
                
                <label style={{ 
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  border: `2px solid ${format === 'json' ? '#3b82f6' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: format === 'json' ? '#eff6ff' : 'white'
                }}>
                  <input 
                    type="radio" 
                    name="format" 
                    value="json" 
                    checked={format === 'json'}
                    onChange={(e) => setFormat(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontWeight: 500 }}>📄 JSON</span>
                </label>
              </div>
            </div>

            {/* Filters */}
            <div style={{ 
              background: '#f9fafb', 
              padding: '16px', 
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#374151' }}>
                Bộ lọc (tùy chọn)
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                    Từ ngày
                  </label>
                  <input 
                    type="date" 
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    style={{ 
                      width: '100%',
                      padding: '8px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px',
                      fontSize: '13px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                    Đến ngày
                  </label>
                  <input 
                    type="date" 
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    style={{ 
                      width: '100%',
                      padding: '8px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              {exportType === 'events' && (
                <div>
                  <label style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                    Trạng thái
                  </label>
                  <select 
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    style={{ 
                      width: '100%',
                      padding: '8px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px',
                      fontSize: '13px'
                    }}
                  >
                    <option value="all">Tất cả</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="pending">Chờ duyệt</option>
                    <option value="completed">Đã hoàn thành</option>
                  </select>
                </div>
              )}

              {exportType === 'registrations' && (
                <div>
                  <label style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                    Trạng thái
                  </label>
                  <select 
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    style={{ 
                      width: '100%',
                      padding: '8px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px',
                      fontSize: '13px'
                    }}
                  >
                    <option value="all">Tất cả</option>
                    <option value="pending">Chờ duyệt</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="rejected">Từ chối</option>
                  </select>
                </div>
              )}
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={exporting}
              style={{
                width: '100%',
                padding: '12px',
                background: exporting ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: exporting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {exporting ? (
                <>
                  <span>⏳</span>
                  <span>Đang xuất dữ liệu...</span>
                </>
              ) : (
                <>
                  <span>⬇️</span>
                  <span>Xuất dữ liệu</span>
                </>
              )}
            </button>

            {/* Info Box */}
            <div style={{ 
              marginTop: '20px',
              padding: '12px',
              background: '#eff6ff',
              borderLeft: '3px solid #3b82f6',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#1e40af'
            }}>
              <strong>ℹ️ Lưu ý:</strong> Dữ liệu được xuất sẽ tuân theo bộ lọc đã chọn. 
              Nếu không chọn bộ lọc, tất cả dữ liệu sẽ được xuất.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}