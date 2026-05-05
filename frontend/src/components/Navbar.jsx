import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const NavLinks = () => {
    const links = [
      { path: '/', label: 'Home' },
      { path: '/partner', label: 'Find Partner' },
    ];

    if (user) {
      if (user.role === 'admin') {
        links.push({ path: '/admin', label: 'Admin' });
      } else {
        links.push({ path: '/dashboard', label: 'Dashboard' });
      }
      links.push({ path: '/chat', label: 'Messages', hasPulse: true });
    }

    return (
      <>
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link 
              key={link.path}
              to={link.path} 
              onClick={() => setIsMenuOpen(false)} 
              className={`relative text-[13px] font-bold uppercase tracking-[0.1em] transition-all duration-300 group ${
                isActive ? 'text-primary-rose' : 'text-dark-grey/70 hover:text-primary-rose'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {link.label}
                {link.hasPulse && (
                  <span className="w-1.5 h-1.5 bg-deep-rose rounded-full animate-pulse shadow-[0_0_8px_rgba(184,92,110,0.5)]"></span>
                )}
              </span>
              <span className={`absolute -bottom-1.5 left-0 h-0.5 bg-primary-rose transition-all duration-500 rounded-full ${
                isActive ? 'w-full' : 'w-0 group-hover:w-1/2'
              }`}></span>
            </Link>
          );
        })}
        
        {user ? (
          <>
            <Link to="/post-ad" onClick={() => setIsMenuOpen(false)} className="bg-near-black text-wedding-cream px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-xl shadow-near-black/10">
               Post Ad
            </Link>
            <button onClick={handleLogout} className="text-[12px] font-black text-red-500/70 hover:text-red-600 uppercase tracking-widest transition-colors text-left ml-2">Logout</button>
          </>
        ) : (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 w-full md:w-auto">
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-[13px] font-bold text-dark-grey/70 hover:text-primary-rose uppercase tracking-[0.1em] transition-all">Sign In</Link>
            <Link to="/register" className="bg-primary-rose text-white px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all hover:bg-deep-rose hover:scale-105 active:scale-95 shadow-xl shadow-primary-rose/20 text-center">
              Register
            </Link>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[2000] transition-all duration-500 ${
        isScrolled 
          ? 'h-16 bg-white/80 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-b border-white/60' 
          : 'h-24 bg-white/30 backdrop-blur-sm border-b border-white/10'
      }`}>
        <div className="container mx-auto px-6 h-full">
          <div className="flex justify-between items-center h-full">
            <Link to="/" className="z-[2100] flex items-center gap-3 group">
              <svg className="w-10 h-10 text-logo-gold drop-shadow-sm transition-transform duration-500 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-serif font-black tracking-[0.15em] text-near-black uppercase leading-none">
                  Pelawahak<span className="text-primary-rose">.com</span>
                </span>
                <span className="text-[7px] md:text-[8px] font-bold text-dark-grey/60 uppercase tracking-[0.4em] mt-1.5 transition-all group-hover:tracking-[0.5em]">
                  Sri Lanka's Premium Wedding Circle
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10">
              <NavLinks />
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden z-[2100] w-12 h-12 flex flex-col items-center justify-center gap-1.5 focus:outline-none bg-white/50 backdrop-blur-md rounded-full shadow-lg border border-white/20"
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-0.5 bg-near-black transition-all duration-500 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-4 h-0.5 bg-near-black transition-all duration-500 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-near-black transition-all duration-500 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 bg-warm-white/95 backdrop-blur-2xl z-[1500] flex flex-col transition-all duration-700 cubic-bezier(0.2, 0, 0, 1) md:hidden ${
        isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}>
         <div className="flex flex-col p-12 pt-36 space-y-12 h-full overflow-y-auto">
            <div className="flex flex-col space-y-10 items-start">
               <NavLinks />
            </div>
            
            <div className="mt-auto border-t border-light-grey/10 pt-12 text-center pb-12">
               <p className="text-[10px] font-black text-dark-grey/30 uppercase tracking-[0.5em]">The Ultimate Wedding Experience</p>
            </div>
         </div>
      </div>
    </>
  );
};

export default Navbar;

