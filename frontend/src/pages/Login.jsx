import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-surface-gradient">
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-light-grey/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
           <span className="text-8xl font-black text-primary-rose">✦</span>
        </div>
        
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
             <span className="w-10 h-[1px] bg-deep-rose"></span>
             <span className="text-[10px] font-black text-primary-rose uppercase tracking-[0.5em]">Welcome Back</span>
             <span className="w-10 h-[1px] bg-deep-rose"></span>
          </div>
          <h2 className="text-4xl font-black text-near-black uppercase tracking-tighter leading-none mb-2">Login to <br /><span className="text-gold-gradient">Pelawahak</span></h2>
          <p className="text-[11px] font-black text-dark-grey/70 uppercase tracking-widest italic">Sri Lanka's Premium Wedding Hub</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 text-[10px] font-black uppercase tracking-widest text-center animate-shake">
            {error}
          </div>
        )}

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
            />
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-dark-grey/60 uppercase tracking-widest ml-2">Private Password</label>
            <input 
              type="password" 
              className="w-full bg-warm-white border-none rounded-2xl p-5 text-xs font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="w-full bg-primary-rose text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-deep-rose hover:scale-[1.02] transition-all shadow-xl shadow-primary-rose/30 active:scale-95 flex items-center justify-center gap-3">
            Sign In <span>→</span>
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-dark-grey/60 font-black uppercase tracking-widest text-[9px]">
            New to the registry? <Link to="/register" className="text-primary-rose hover:text-black transition-colors underline decoration-primary-rose/30 underline-offset-4">Create Membership</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
