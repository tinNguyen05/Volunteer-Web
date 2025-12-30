import client from '../api/client';

/**
 * Export data as CSV or JSON with filters
 * @param {Object} params - Export parameters (type, format, filters)
 * @returns {Promise<Object>} Blob data for download
 */
export const exportData = async (params) => {
  try {
    const { type, format = 'csv', ...filters } = params;
    
    const response = await client.get('/api/dashboard/export', {
      params: { type, format, ...filters },
      responseType: 'blob',
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Export failed:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Không thể xuất dữ liệu' 
    };
  }
};

/**
 * Export events with optional filters
 * @param {string} format - File format ('csv' or 'json')
 * @param {Object} filters - Filter options (startDate, endDate, status)
 * @returns {Promise<Object>}
 */
export const exportEvents = (format = 'csv', filters = {}) => 
  exportData({ type: 'events', format, ...filters });

/**
 * Export users with optional filters
 * @param {string} format - File format ('csv' or 'json')
 * @param {Object} filters - Filter options (role, startDate, endDate)
 * @returns {Promise<Object>}
 */
export const exportUsers = (format = 'csv', filters = {}) => 
  exportData({ type: 'users', format, ...filters });

/**
 * Export registrations with optional filters
 * @param {string} format - File format ('csv' or 'json')
 * @param {Object} filters - Filter options (status, eventId, startDate, endDate)
 * @returns {Promise<Object>}
 */
export const exportRegistrations = (format = 'csv', filters = {}) => 
  exportData({ type: 'registrations', format, ...filters });

/**
 * Export posts with optional filters
 * @param {string} format - File format ('csv' or 'json')
 * @param {Object} filters - Filter options (eventId, startDate, endDate)
 * @returns {Promise<Object>}
 */
export const exportPosts = (format = 'csv', filters = {}) => 
  exportData({ type: 'posts', format, ...filters });

/**
 * Export comments with optional filters
 * @param {string} format - File format ('csv' or 'json')
 * @param {Object} filters - Filter options (postId, startDate, endDate)
 * @returns {Promise<Object>}
 */
export const exportComments = (format = 'csv', filters = {}) => 
  exportData({ type: 'comments', format, ...filters });

/**
 * Export notifications with optional filters
 * @param {string} format - File format ('csv' or 'json')
 * @param {Object} filters - Filter options (type, isRead, startDate, endDate)
 * @returns {Promise<Object>}
 */
export const exportNotifications = (format = 'csv', filters = {}) => 
  exportData({ type: 'notifications', format, ...filters });
