import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { initializePushNotifications } from '../services/pushService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // Khôi phục session khi reload trang - Dùng token thay vì localStorage user
  useEffect(() => {
    const loadUserFromStorage = async () => {
      const token = localStorage.getItem('vh_access_token');
      
      if (token) {
        try {
          // Decode token để lấy userId
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.user_id;
          
          // Fetch profile từ backend
          const profileResult = await authService.getUserProfile(userId);
          if (profileResult.data) {
            const userData = {
              id: userId,
              ...profileResult.data,
              role: profileResult.data.role || 'USER'
            };
            setUser(userData);
          }
        } catch (error) {
          console.error('Failed to restore session:', error);
          // Token invalid, xóa đi
          localStorage.removeItem('vh_access_token');
        }
      }
      setLoading(false);
    };
    loadUserFromStorage();
  }, []);

  const login = async (email, password) => {
    try {
      // 1. Gọi REST Login để lấy Token
      const loginResult = await authService.login(email, password);
      
      // 2. Decode token để lấy userId và roles
      const token = loginResult.accessToken || localStorage.getItem('vh_access_token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.user_id;
      const roles = payload.roles || [];

      // 3. Gọi GraphQL để lấy Profile chi tiết
      let userProfile = {};
      try {
        const profileResult = await authService.getUserProfile(userId);
        userProfile = profileResult.data || {};
      } catch (err) {
        console.warn("User has no profile yet or error fetching profile");
      }

      // 4. Merge data - Ưu tiên role từ JWT token
      const finalUserData = {
        id: userId,
        email: email,
        ...userProfile,
        role: roles[0] || userProfile.role || 'USER' // Lấy role đầu tiên từ JWT
      };

      // 5. Save state - CHỈ set state, KHÔNG dùng localStorage.setItem('vh_user')
      setUser(finalUserData);
      
      // 6. Setup Push Notification
      setupPushNotification();
      
      setIsAuthOpen(false);
      return finalUserData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthOpen(false);
  };

  const setupPushNotification = async () => {
     try {
        await initializePushNotifications();
     } catch (e) {
        console.log("Push init skipped");
     }
  };

  // UI Helpers
  const openAuth = (mode = 'login') => { setAuthMode(mode); setIsAuthOpen(true); };
  const closeAuth = () => setIsAuthOpen(false);
  const switchMode = (mode) => setAuthMode(mode);

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, 
      isAuthOpen, authMode, openAuth, closeAuth, switchMode, 
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}