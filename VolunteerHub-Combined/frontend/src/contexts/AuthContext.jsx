import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, role, email, approved }
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [pendingManagers, setPendingManagers] = useState([]); // Managers waiting for approval
  const [registeredVolunteers, setRegisteredVolunteers] = useState([]); // Registered volunteers

  // Khởi tạo từ localStorage, sessionStorage, hoặc cookie khi component mount
  useEffect(() => {
    try {
      // Thử lấy từ localStorage trước
      let raw = localStorage.getItem('vh_user');
      
      // Nếu không có, thử sessionStorage
      if (!raw) {
        raw = sessionStorage.getItem('vh_session');
      }
      
      // Nếu vẫn không có, thử cookie
      if (!raw) {
        const cookies = document.cookie.split('; ');
        const authCookie = cookies.find(c => c.startsWith('vh_auth='));
        if (authCookie) {
          raw = authCookie.split('=')[1];
        }
      }
      
      if (raw) setUser(JSON.parse(raw));
      
      const pending = localStorage.getItem('vh_pending_managers');
      if (pending) setPendingManagers(JSON.parse(pending));
      
      const volunteers = localStorage.getItem('vh_volunteers');
      if (volunteers) setRegisteredVolunteers(JSON.parse(volunteers));
    } catch { /* ignore */ }
  }, []);

  const login = (userObj) => {
    setUser(userObj);
    
    // Lưu vào localStorage
    localStorage.setItem('vh_user', JSON.stringify(userObj));
    
    // Lưu vào sessionStorage
    sessionStorage.setItem('vh_session', JSON.stringify(userObj));
    
    // Lưu vào cookie (expires in 7 days)
    const expires = new Date();
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
    document.cookie = `vh_auth=${JSON.stringify(userObj)}; expires=${expires.toUTCString()}; path=/`;
    
    setIsAuthOpen(false); // Đóng modal sau khi đăng nhập
  };

  const logout = () => {
    setUser(null);
    
    // Xóa localStorage
    localStorage.removeItem('vh_user');
    
    // Xóa sessionStorage
    sessionStorage.removeItem('vh_session');
    
    // Xóa cookie
    document.cookie = 'vh_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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

  const addPendingManager = (managerData) => {
    const newPending = [...pendingManagers, { ...managerData, approved: false, createdAt: new Date().toISOString() }];
    setPendingManagers(newPending);
    localStorage.setItem('vh_pending_managers', JSON.stringify(newPending));
  };

  const approveManager = (managerId) => {
    const updated = pendingManagers.map(m => 
      m.id === managerId ? { ...m, approved: true } : m
    );
    setPendingManagers(updated);
    localStorage.setItem('vh_pending_managers', JSON.stringify(updated));
  };

  const addVolunteer = (volunteerData) => {
    const newVolunteers = [...registeredVolunteers, volunteerData];
    setRegisteredVolunteers(newVolunteers);
    localStorage.setItem('vh_volunteers', JSON.stringify(newVolunteers));
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
        switchMode,
        pendingManagers,
        addPendingManager,
        approveManager,
        registeredVolunteers,
        addVolunteer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}