import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, role, email }
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  // Khởi tạo từ localStorage khi component mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('vh_user');
      if (raw) setUser(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const login = (userObj) => {
    setUser(userObj);
    localStorage.setItem('vh_user', JSON.stringify(userObj));
    setIsAuthOpen(false); // Đóng modal sau khi đăng nhập
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vh_user');
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
  };

  const switchMode = (mode) => {
    setAuthMode(mode);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser, 
        login, 
        logout,
        isAuthOpen,
        authMode,
        openAuth,
        closeAuth,
        switchMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}