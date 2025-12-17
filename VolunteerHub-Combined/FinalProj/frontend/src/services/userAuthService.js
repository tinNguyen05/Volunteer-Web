/**
 * User Auth Service - GraphQL Integration
 * Quản lý user authentication từ database
 */
import graphqlClient from '../api/graphqlClient';

// Get all users from user_auth table
export const getAllUserAuth = async () => {
  try {
    const query = 'query { getAllUserAuth { userId email role status emailVerified } }';
    
    const data = await graphqlClient.query(query);
    return { success: true, data: data.getAllUserAuth || [] };
  } catch (error) {
    console.error('Get all user auth error:', error);
    return { success: false, data: [], error: error.message || 'Không thể tải danh sách người dùng' };
  }
};

// Approve user (admin only)
export const approveUser = async (userId) => {
  try {
    const mutation = 'mutation ApproveUser($userId: ID!) { approveUserAuth(userId: $userId) { ok message } }';
    
    const data = await graphqlClient.mutation(mutation, { userId });
    return { success: data.approveUserAuth.ok, message: data.approveUserAuth.message };
  } catch (error) {
    console.error('Approve user error:', error);
    return { success: false, error: error.message || 'Không thể phê duyệt người dùng' };
  }
};

// Ban user (admin only)
export const banUser = async (userId) => {
  try {
    const mutation = 'mutation BanUser($userId: ID!) { banUserAuth(userId: $userId) { ok message } }';
    
    const data = await graphqlClient.mutation(mutation, { userId });
    return { success: data.banUserAuth.ok, message: data.banUserAuth.message };
  } catch (error) {
    console.error('Ban user error:', error);
    return { success: false, error: error.message || 'Không thể khóa người dùng' };
  }
};

// Unban user (admin only)
export const unbanUser = async (userId) => {
  try {
    const mutation = 'mutation UnbanUser($userId: ID!) { unbanUserAuth(userId: $userId) { ok message } }';
    
    const data = await graphqlClient.mutation(mutation, { userId });
    return { success: data.unbanUserAuth.ok, message: data.unbanUserAuth.message };
  } catch (error) {
    console.error('Unban user error:', error);
    return { success: false, error: error.message || 'Không thể mở khóa người dùng' };
  }
};

// Delete user (admin only)
export const deleteUser = async (userId) => {
  try {
    const mutation = 'mutation DeleteUser($userId: ID!) { deleteUserAuth(userId: $userId) { ok message } }';
    
    const data = await graphqlClient.mutation(mutation, { userId });
    return { success: data.deleteUserAuth.ok, message: data.deleteUserAuth.message };
  } catch (error) {
    console.error('Delete user error:', error);
    return { success: false, error: error.message || 'Không thể xóa người dùng' };
  }
};
