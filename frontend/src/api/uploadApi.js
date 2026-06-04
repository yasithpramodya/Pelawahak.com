import axiosInstance from './axiosInstance';

// Image upload කරන්න
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await axiosInstance.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data; // { url, public_id }
};

// Image delete කරන්න
export const deleteImage = async (publicId) => {
  const encodedId = encodeURIComponent(publicId);
  const { data } = await axiosInstance.delete(`/upload/${encodedId}`);
  return data;
};