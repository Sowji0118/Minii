import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage on initial load
    const savedUser = localStorage.getItem('vidyamitra_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const userData = apiLogin(username, password);
    if (userData) {
      setUser(userData);
      localStorage.setItem('vidyamitra_user', JSON.stringify(userData));
      return userData;
    }
    return null;
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    localStorage.removeItem('vidyamitra_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
