import React, { createContext, useState } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize synchronously from localStorage — avoids setState-in-effect warning
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (storedUser && token) return JSON.parse(storedUser);
    } catch {
      // ignore malformed stored data
    }
    return null;
  });
  // loading is false immediately because initialization is synchronous
  const [loading] = useState(false);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    const userData = {
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
      freeAdsRemaining: res.data.freeAdsRemaining,
      paidAdsRemaining: res.data.paidAdsRemaining,
      subscriptionPlan: res.data.subscriptionPlan,
      subscriptionEndsAt: res.data.subscriptionEndsAt,
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
      paidAdsRemaining: res.data.paidAdsRemaining,
      subscriptionPlan: res.data.subscriptionPlan,
      subscriptionEndsAt: res.data.subscriptionEndsAt,
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
