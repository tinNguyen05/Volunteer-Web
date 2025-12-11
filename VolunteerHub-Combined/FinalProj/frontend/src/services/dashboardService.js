import client from '../api/client';

/**
 * Get dashboard statistics based on user role
 * @returns {Promise<Object>} Dashboard stats
 */
export const getDashboardStats = async () => {
  try {
    const response = await client.get('/api/dashboard/stats');
    return { success: true, data: response.data.data || response.data };
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return { success: false, error: error.response?.data?.message || 'Không thể tải thống kê' };
  }
};

/**
 * Get trending events
 * @param {number} limit - Number of events to return
 * @returns {Promise<Object>} Trending events array
 */
export const getTrendingEvents = async (limit = 5) => {
  try {
    const response = await client.get('/api/dashboard/trending-events', {
      params: { limit },
    });
    return { success: true, data: response.data.data || response.data };
  } catch (error) {
    console.error('Get trending events error:', error);
    return { success: false, error: error.response?.data?.message || 'Không thể tải sự kiện nổi bật' };
  }
};

/**
 * Get recent posts
 * @param {number} limit - Number of posts to return
 * @returns {Promise<Object>} Recent posts array
 */
export const getRecentPosts = async (limit = 10) => {
  try {
    const response = await client.get('/api/dashboard/recent-posts', {
      params: { limit },
    });
    return { success: true, data: response.data.data || response.data };
  } catch (error) {
    console.error('Get recent posts error:', error);
    return { success: false, error: error.response?.data?.message || 'Không thể tải bài viết gần đây' };
  }
};
