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
    } catch (_err) {
      setError('Upload failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] w-full max-w-sm mx-auto transition-all duration-500 hover:shadow-[0_12px_48px_rgba(184,92,110,0.1)]">
      {/* Header */}
      <div className="text-center">
        <h4 className="text-lg font-serif font-black text-near-black uppercase tracking-widest mb-1">Upload Photo</h4>
        <p className="text-[10px] font-bold text-dark-grey/50 uppercase tracking-[0.2em]">Max 5MB (JPG, PNG, WEBP)</p>
      </div>

      {/* Preview */}
      <div className="relative group w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-warm-white to-light-grey/30 flex items-center justify-center transition-transform duration-500 hover:scale-105">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-dark-grey/40">
            <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[9px] font-black uppercase tracking-widest">No Image</span>
          </div>
        )}
        
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary-rose/30 border-t-primary-rose rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <label className={`relative overflow-hidden cursor-pointer w-full text-center py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-lg ${loading ? 'bg-light-grey/20 text-dark-grey/40 pointer-events-none' : 'bg-near-black text-wedding-cream hover:bg-black hover:-translate-y-1 hover:shadow-xl'}`}>
        <span className="relative z-10">{loading ? 'Uploading...' : 'Choose Image'}</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          disabled={loading}
        />
        {!loading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]"></div>
        )}
      </label>

      {/* Error */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest text-center w-full animate-fadeIn">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;