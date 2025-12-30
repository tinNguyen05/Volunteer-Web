// ===========================
// OFFLINE MOCK MODE: ON
// Bypass API calls completely to avoid 500 errors during frontend development
// ===========================

// ===========================
// MOCK DATA - User Profiles with New Schema
// ===========================
const MOCK_USER_PROFILES = {
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890': { 
    userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 
    fullName: 'System Administrator',
    bio: 'Administrator của hệ thống VolunteerHub',
    phoneNumber: '0901234567',
    address: '123 Nguyễn Huệ, Q.1, TP.HCM',
    avatarUrl: null,
    dateOfBirth: '1990-01-15',
    createdAt: '2025-11-01T16:57:01.502615',
    updatedAt: '2025-11-01T16:57:01.502615'
  },
  'b2c3d4e5-f6a7-8901-bcde-f2345678901a': { 
    userId: 'b2c3d4e5-f6a7-8901-bcde-f2345678901a', 
    fullName: 'Nguyễn Văn Quản Lý',
    bio: 'Quản lý sự kiện tình nguyện',
    phoneNumber: '0912345678',
    address: '456 Lê Lợi, Q.1, TP.HCM',
    avatarUrl: null,
    dateOfBirth: '1988-05-20',
    createdAt: '2025-11-01T16:57:01.502615',
    updatedAt: '2025-11-01T16:57:01.502615'
  },
  'f6a7b8c9-d0e1-2345-f012-6789012345ef': { 
    userId: 'f6a7b8c9-d0e1-2345-f012-6789012345ef', 
    fullName: 'Hoàng Anh Tuấn',
    bio: 'Tình nguyện viên nhiệt huyết',
    phoneNumber: '0923456789',
    address: '789 Trần Hưng Đạo, Q.5, TP.HCM',
    avatarUrl: null,
    dateOfBirth: '1995-08-10',
    createdAt: '2025-11-01T16:57:01.502615',
    updatedAt: '2025-11-01T16:57:01.502615'
  },
  'd4e5f6a7-b8c9-0123-def0-4567890123cd': { 
    userId: 'd4e5f6a7-b8c9-0123-def0-4567890123cd', 
    fullName: 'Lê Hoàng Minh',
    bio: null,
    phoneNumber: '0934567890',
    address: null,
    avatarUrl: null,
    dateOfBirth: '1997-03-25',
    createdAt: '2025-11-01T16:57:01.502615',
    updatedAt: '2025-11-11T00:13:05.000000'
  },
  'c3d4e5f6-a7b8-9012-cdef-3456789012bc': { 
    userId: 'c3d4e5f6-a7b8-9012-cdef-3456789012bc', 
    fullName: 'Trần Thị Vân',
    bio: 'Tình nguyện viên tích cực',
    phoneNumber: '0945678901',
    address: '321 Võ Thị Sáu, Q.3, TP.HCM',
    avatarUrl: null,
    dateOfBirth: '1996-11-12',
    createdAt: '2025-11-01T16:57:01.502615',
    updatedAt: '2025-11-01T16:57:01.502615'
  },
  'e5f6a7b8-c9d0-1234-ef01-5678901234de': { 
    userId: 'e5f6a7b8-c9d0-1234-ef01-5678901234de', 
    fullName: 'Phạm Thị Lan',
    bio: null,
    phoneNumber: '0956789012',
    address: null,
    avatarUrl: null,
    dateOfBirth: '1998-07-30',
    createdAt: '2025-11-01T16:57:01.502615',
    updatedAt: '2025-11-01T16:57:01.502615'
  }
};

// ===========================
// SERVICE FUNCTIONS - OFFLINE MOCK MODE
// ===========================

/**
 * Get current user's profile
 * MOCK MODE: Returns data directly without API call
 */
export const getMyProfile = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const profile = MOCK_USER_PROFILES[userId] || null;
      
      if (profile) {
        console.log('👤 My Profile Loaded (Offline Mode)');
        resolve({
          success: true,
          data: profile
        });
      } else {
        console.log('❌ Profile Not Found (Mock)');
        resolve({
          success: false,
          error: 'Profile not found'
        });
      }
    }, 500);
  });
};

/**
 * Update current user's profile
 * MOCK MODE: Simulates successful update without API call
 */
export const updateMyProfile = async (userId, profileData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const profile = MOCK_USER_PROFILES[userId];
      
      if (profile) {
        // Update profile data
        Object.assign(profile, profileData, { 
          updatedAt: new Date().toISOString() 
        });
        
        console.log('✏️ Profile Updated (Mock):', profile);
        resolve({ 
          success: true, 
          data: profile,
          message: 'Cập nhật thông tin thành công'
        });
      } else {
        resolve({
          success: false,
          error: 'Profile not found'
        });
      }
    }, 700);
  });
};

/**
 * Delete user profile
 * MOCK MODE: Simulates deletion without API call
 */
export const deleteUserProfile = async (userId) => {
  try {
    const mutation = `
      mutation BanUser($userId: ID!) {
        banUser(userId: $userId) {
          ok
          message
        }
      }
    `;
    
    const data = await graphqlClient.mutation(mutation, { userId });
    return { success: data.banUser.ok, message: data.banUser.message, data: data.banUser };
  } catch (error) {
    console.error('Delete user profile error:', error);
    return { success: false, error: error.message || 'Không thể xóa người dùng' };
  }
};
