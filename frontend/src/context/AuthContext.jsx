import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from local storage token
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    const userData = {
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
      freeAdsRemaining: res.data.freeAdsRemaining,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const register = async (name, email, password, role) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    localStorage.setItem('token', res.data.token);
    const userData = {
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
      freeAdsRemaining: res.data.freeAdsRemaining,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      // Assuming a GET /api/auth/me route exists, or we use a basic fetch if not.
      // Alternatively, we can just take updated user data passed to this function.
    } catch (error) {
      console.error('Error refreshing user', error);
    }
  };

  const updateUserState = (newUserData) => {
    const updated = { ...user, ...newUserData };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading, updateUserState }}>
      {children}
    </AuthContext.Provider>
  );
};
