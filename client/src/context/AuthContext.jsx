import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const getRoleRedirectPath = (role) => {
  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return '/admin';
    case 'STUDENT':
    default:
      return '/student';
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('foundit_token'));
  const [loading, setLoading] = useState(true);

  // Restore authenticated session on initial load
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('foundit_token');
      const storedUser = localStorage.getItem('foundit_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend silently
          const res = await api.getMe();
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem('foundit_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid, logging out.');
          logout();
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('foundit_token', data.token);
      localStorage.setItem('foundit_user', JSON.stringify(data.user));
      return data.user;
    }
    throw new Error('Authentication failed');
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('foundit_token', data.token);
      localStorage.setItem('foundit_user', JSON.stringify(data.user));
      return data.user;
    }
    throw new Error('Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('foundit_token');
    localStorage.removeItem('foundit_user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
