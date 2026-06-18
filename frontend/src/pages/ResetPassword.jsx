import React, { useState } from 'react';
import api from '../services/api';
import { useParams, Link } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data?.message || 'Your password has been successfully reset.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-surface-gradient">
      <title>Reset Password | Pelawahak.com</title>
      <meta name="description" content="Set a new password for your Pelawahak.com account." />
      <meta name="robots" content="noindex, nofollow" />
      
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-light-grey/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
           <span className="text-8xl font-black text-primary-rose">✦</span>
        </div>
        
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
             <span className="w-10 h-[1px] bg-deep-rose"></span>
             <span className="text-[10px] font-black text-primary-rose uppercase tracking-[0.5em]">Create New Password</span>
             <span className="w-10 h-[1px] bg-deep-rose"></span>
          </div>
          <h2 className="text-4xl font-black text-near-black uppercase tracking-tighter leading-none mb-2">New <br /><span className="text-gold-gradient">Password</span></h2>
          <p className="text-[11px] font-black text-dark-grey/70 uppercase tracking-widest italic">Choose a secure password</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 text-[10px] font-black uppercase tracking-widest text-center animate-shake">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-2xl mb-8 text-[10px] font-black uppercase tracking-widest text-center">
            {message}
          </div>
        )}

        {message ? (
          <div className="text-center mt-6">
            <Link 
              to="/login" 
              className="w-full inline-block text-center bg-primary-rose text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-deep-rose hover:scale-[1.02] transition-all shadow-xl shadow-primary-rose/30 active:scale-95"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-dark-grey/60 uppercase tracking-widest ml-2">New Password</label>
              <input 
                type="password" 
                className="w-full bg-warm-white border-none rounded-2xl p-5 text-xs font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                disabled={loading}
              />
            </div>
            
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-dark-grey/60 uppercase tracking-widest ml-2">Confirm Password</label>
              <input 
                type="password" 
                className="w-full bg-warm-white border-none rounded-2xl p-5 text-xs font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all" 
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary-rose text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-deep-rose hover:scale-[1.02] transition-all shadow-xl shadow-primary-rose/30 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Resetting Password...' : 'Update Password'} <span>→</span>
            </button>
          </form>
        )}

        <div className="mt-10 text-center">
          <p className="text-dark-grey/60 font-black uppercase tracking-widest text-[9px]">
            Cancel and <Link to="/login" className="text-primary-rose hover:text-black transition-colors underline decoration-primary-rose/30 underline-offset-4">Return to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
