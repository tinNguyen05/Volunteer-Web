/**
 * Authentication Service - REST API Integration
 * Handles login, signup, refresh token, and user profile
 */
import axiosClient from '../api/axiosClient';
import graphqlClient from '../api/graphqlClient';

// --- REST API (Authentication) ---

export const signup = async (email, password) => {
  try {
    const data = await axiosClient.post('/auth/signup', { email, password });
    return data;
  } catch (error) {
    throw new Error(error.message || 'Đăng ký thất bại');
  }
};

export const login = async (email, password) => {
  try {
    const data = await axiosClient.post('/auth/login', { email, password });
    
    // Server returns: { accessToken, tokenType, ... }
    if (data.accessToken) {
      localStorage.setItem('vh_access_token', data.accessToken);
    }
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(error.message || 'Đăng nhập thất bại');
  }
};

export const refreshToken = async () => {
  try {
    // RefreshToken stored in HttpOnly cookie, no need to send manually
    const data = await axiosClient.post('/auth/refresh');
    
    if (data.accessToken) {
      localStorage.setItem('vh_access_token', data.accessToken);
    }
    return data;
  } catch (error) {
    throw new Error(error.message || 'Không thể làm mới token');
  }
};

export const logout = () => {
  localStorage.removeItem('vh_access_token');
  localStorage.removeItem('vh_user');
};

// --- GRAPHQL API (User Profile) ---

export const getUserProfile = async (userId) => {
  const query = `
    query GetUserProfile($userId: ID!) {
      getUserProfile(userId: $userId) {
        userId
        username
        email
        bio
        fullName
        avatarId
        role
        eventCount
        postCount
      }
    }
  `;

  try {
    const data = await graphqlClient.query(query, { userId });
    // Trả về structure thống nhất
    return { data: data.getUserProfile };
  } catch (error) {
    console.error("Get Profile Error:", error);
    // Nếu chưa có profile (lỗi từ backend), trả về null hoặc flag để UI biết
    return { data: null, hasProfile: false };
  }
};