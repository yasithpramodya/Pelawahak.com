import { useState } from 'react';
import { uploadImage } from '../api/uploadApi';

const ImageUpload = ({ onUploadSuccess, currentImage }) => {
  const [preview, setPreview] = useState(currentImage || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File size check (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Preview දෙන්න
    setPreview(URL.createObjectURL(file));
    setError('');
    setLoading(true);

    try {
      const data = await uploadImage(file);
      onUploadSuccess(data.url, data.public_id);
      setLoading(false);
    } catch (err) {
      setError('Upload failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Preview */}
      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Upload Button */}
      <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
        {loading ? 'Uploading...' : 'Choose Image'}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          disabled={loading}
        />
      </label>

      {/* Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default ImageUpload;