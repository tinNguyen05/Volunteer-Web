import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, role, email, approved }
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [pendingManagers, setPendingManagers] = useState([]); // Managers waiting for approval
  const [registeredVolunteers, setRegisteredVolunteers] = useState([]); // Registered volunteers

  // Khởi tạo từ localStorage khi component mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('vh_user');
      if (raw) setUser(JSON.parse(raw));
      
      const pending = localStorage.getItem('vh_pending_managers');
      if (pending) setPendingManagers(JSON.parse(pending));
      
      const volunteers = localStorage.getItem('vh_volunteers');
      if (volunteers) setRegisteredVolunteers(JSON.parse(volunteers));
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