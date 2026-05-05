import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-earth-gradient pt-24 pb-12 text-wedding-cream mt-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-deep-rose/30"></div>
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="block mb-8">
              <div className="flex items-center gap-2">
                <svg className="w-10 h-10 text-logo-gold drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-serif font-black tracking-widest text-wedding-cream uppercase leading-none">
                    Pelawahak<span className="text-primary-rose">.lk</span>
                  </span>
                  <span className="text-[7px] md:text-[8px] font-bold text-wedding-cream/60 uppercase tracking-[0.3em] mt-1">
                    Your Wedding, Your Way
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-wedding-cream/70 text-sm font-medium leading-relaxed mb-10">
              Sri Lanka's premier wedding marketplace and matrimonial hub. Designed with elegance to help you create unforgettable moments.
            </p>
            <div className="flex gap-4">
              {['FB', 'IG', 'TW', 'YT'].map((social) => (
                <a key={social} href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[11px] font-black hover:bg-gold-gradient hover:text-near-black transition-all border border-white/10 group">
                  <span className="group-hover:scale-110 transition-transform">{social}</span>
                </a>
              ))}
            </div>
          </div>
 
          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-black text-primary-rose uppercase tracking-[0.3em] mb-10">Navigation</h3>
            <ul className="space-y-5">
              <li><Link to="/" className="text-sm font-bold text-wedding-cream/80 hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-deep-rose rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Marketplace Home</Link></li>
              <li><Link to="/partner" className="text-sm font-bold text-wedding-cream/80 hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-deep-rose rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Find a Partner</Link></li>
              <li><Link to="/post-ad" className="text-sm font-bold text-wedding-cream/80 hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-deep-rose rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Post Your Ad</Link></li>
              <li><Link to="/chat" className="text-sm font-bold text-wedding-cream/80 hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-deep-rose rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Messages & Chat</Link></li>
            </ul>
          </div>
 
          {/* Legal & Support */}
          <div>
            <h3 className="text-[10px] font-black text-primary-rose uppercase tracking-[0.3em] mb-10">Support & Trust</h3>
            <ul className="space-y-5">
              <li><a href="#" className="text-sm font-bold text-wedding-cream/80 hover:text-white transition-colors">Safety Tips</a></li>
              <li><a href="#" className="text-sm font-bold text-wedding-cream/80 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm font-bold text-wedding-cream/80 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm font-bold text-wedding-cream/80 hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>
 
          {/* Contact Section */}
          <div>
            <h3 className="text-[10px] font-black text-primary-rose uppercase tracking-[0.3em] mb-10">Get In Touch</h3>
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-glass flex items-center justify-center text-2xl shadow-inner border border-white/5">📍</div>
                <p className="text-sm font-bold text-wedding-cream/90 uppercase tracking-tight">Colombo, Sri Lanka</p>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-glass flex items-center justify-center text-2xl shadow-inner border border-white/5">📧</div>
                <p className="text-sm font-bold text-wedding-cream/90 underline underline-offset-8 decoration-primary-rose/30">info@pelawahak.com</p>
              </div>
            </div>
          </div>
 
        </div>
 
        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black text-wedding-cream/40 uppercase tracking-[0.5em]">
            © 2026 PELAWAHAK.LK MATCHMAKING. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-12 items-center">
            <span className="text-[10px] font-black text-wedding-cream/30 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full">Premium UI by YPM</span>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-[10px] font-black text-primary-rose uppercase tracking-widest">Global Service</span>
            </div>
          </div>
        </div>
 
      </div>
    </footer>
  );
};

export default Footer;
