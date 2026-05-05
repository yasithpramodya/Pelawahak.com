import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

const PartnerCard = ({ partner }) => {
  const imageUrl = partner.images && partner.images.length > 0 
    ? getImageUrl(partner.images[0]) 
    : 'https://via.placeholder.com/400x600?text=Premium+Partner+Profile';

  return (
    <Link to={`/partner/${partner._id}`} className="group glass-card rounded-[3rem] overflow-hidden flex flex-col md:flex-row h-auto md:h-80 transition-all duration-700 hover:-translate-y-2">
      {/* Image Container */}
      <div className="w-full md:w-64 h-80 md:h-full overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={partner.title} 
          className="w-full h-full object-cover transition-transform duration-[1.5s] cubic-bezier(0.2, 0, 0, 1) group-hover:scale-110"
        />
        <div className="absolute top-5 left-5">
           <span className="bg-near-black/60 backdrop-blur-md text-white border border-white/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl">
             {partner.gender}
           </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-near-black/80 to-transparent md:hidden">
           <h3 className="text-2xl font-serif font-black text-white uppercase tracking-tight">{partner.title}</h3>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-8 md:p-10 flex-1 flex flex-col relative">
        <div className="absolute top-0 right-0 p-8 hidden md:block">
           <div className="flex flex-col items-end">
              <span className="text-5xl font-serif font-black text-primary-rose leading-none">{partner.age}</span>
              <span className="text-[9px] font-black text-dark-grey/40 uppercase tracking-[0.3em] mt-1">Years</span>
           </div>
        </div>

        <div className="mb-6">
           <h3 className="text-2xl md:text-3xl font-serif font-black text-near-black group-hover:text-primary-rose transition-colors duration-500 uppercase tracking-tight mb-2 hidden md:block">
             {partner.title}
           </h3>
           <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-black text-primary-rose uppercase tracking-[0.2em]">{partner.religion}</span>
              <span className="w-1.5 h-1.5 bg-logo-gold/30 rounded-full"></span>
              <span className="text-[10px] font-black text-dark-grey/60 uppercase tracking-[0.2em]">{partner.district}</span>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
           <div className="flex items-center gap-4 bg-white/40 p-4 rounded-2xl border border-white/60">
              <span className="text-xl">💼</span>
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-dark-grey/40 uppercase tracking-widest">Profession</span>
                 <span className="text-[11px] font-bold text-near-black uppercase tracking-tight">{partner.profession}</span>
              </div>
           </div>
           <div className="flex items-center gap-4 bg-white/40 p-4 rounded-2xl border border-white/60">
              <span className="text-xl">🎓</span>
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-dark-grey/40 uppercase tracking-widest">Education</span>
                 <span className="text-[11px] font-bold text-near-black uppercase tracking-tight truncate max-w-[120px]">{partner.education || 'Private'}</span>
              </div>
           </div>
        </div>

        <div className="mt-auto pt-6 border-t border-light-grey/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-near-black flex items-center justify-center text-[10px] font-black text-wedding-cream shadow-xl">
                 {partner.user?.name ? partner.user.name.charAt(0) : 'U'}
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-near-black uppercase tracking-widest italic opacity-40">Profile ID: {partner._id.slice(-6)}</span>
                  <span className="text-[10px] font-black text-near-black uppercase tracking-widest">Verified Member</span>
               </div>
            </div>
            <div className="bg-near-black text-wedding-cream px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all group-hover:bg-primary-rose group-hover:scale-105 active:scale-95 shadow-xl shadow-near-black/10">
              Engage Profile
            </div>
        </div>
      </div>
    </Link>
  );
};

export default PartnerCard;

