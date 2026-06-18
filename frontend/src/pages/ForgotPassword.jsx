import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data?.message || 'A password reset link has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-surface-gradient">
      <title>Forgot Password | Pelawahak.com</title>
      <meta name="description" content="Request a password reset link for your Pelawahak.com account." />
      <meta name="robots" content="noindex, nofollow" />
      
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-light-grey/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
           <span className="text-8xl font-black text-primary-rose">✦</span>
        </div>
        
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
             <span className="w-10 h-[1px] bg-deep-rose"></span>
             <span className="text-[10px] font-black text-primary-rose uppercase tracking-[0.5em]">Recovery</span>
             <span className="w-10 h-[1px] bg-deep-rose"></span>
          </div>
          <h2 className="text-4xl font-black text-near-black uppercase tracking-tighter leading-none mb-2">Reset <br /><span className="text-gold-gradient">Password</span></h2>
          <p className="text-[11px] font-black text-dark-grey/70 uppercase tracking-widest italic">Forgot your credentials?</p>
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

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-dark-grey/60 uppercase tracking-widest ml-2">Secure Email Address</label>
              <input 
                type="email" 
                className="w-full bg-warm-white border-none rounded-2xl p-5 text-xs font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all" 
                placeholder="e.g. elegance@wedding.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary-rose text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-deep-rose hover:scale-[1.02] transition-all shadow-xl shadow-primary-rose/30 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Sending Request...' : 'Send Reset Link'} <span>→</span>
            </button>
          </form>
        )}

        <div className="mt-10 text-center">
          <p className="text-dark-grey/60 font-black uppercase tracking-widest text-[9px]">
            Remembered details? <Link to="/login" className="text-primary-rose hover:text-black transition-colors underline decoration-primary-rose/30 underline-offset-4">Return to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
