import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cs_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('cs_token');
      const storedUser = localStorage.getItem('cs_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Refresh user data from server in background
          const response = await authService.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
            localStorage.setItem('cs_user', JSON.stringify(response.data));
          }
        } catch (error) {
          console.warn('Session expired or invalid token:', error.message);
          // If 401 or invalid, clear token
          if (error.status === 401 || error.status === 403) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    if (response.success && response.data) {
      const userData = response.data;
      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('cs_token', userData.token);
      localStorage.setItem('cs_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(response.message || 'Login failed');
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    if (response.success && response.data) {
      const registeredUser = response.data;
      setUser(registeredUser);
      setToken(registeredUser.token);
      localStorage.setItem('cs_token', registeredUser.token);
      localStorage.setItem('cs_user', JSON.stringify(registeredUser));
      return registeredUser;
    }
    throw new Error(response.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cs_token');
    localStorage.removeItem('cs_user');
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedData };
      localStorage.setItem('cs_user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const isAuthenticated = Boolean(user && token);
  const isAdmin = Boolean(user && user.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
