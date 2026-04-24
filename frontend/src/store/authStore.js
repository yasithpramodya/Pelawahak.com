import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (userData, token) => {
        set({ user: userData, token });
        localStorage.setItem('token', token);
      },
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('token');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
