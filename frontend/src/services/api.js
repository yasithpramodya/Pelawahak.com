import axiosInstance from '../api/axiosInstance';

export const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/400x600?text=No+Image';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default axiosInstance;