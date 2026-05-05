import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  
  return date.toLocaleDateString();
};

const AdCard = ({ ad }) => {
  const imageUrl = ad.images && ad.images.length > 0 
    ? getImageUrl(ad.images[0]) 
    : 'https://via.placeholder.com/600x400?text=Premium+Wedding+Service';

  return (
    <Link to={`/ad/${ad._id}`} className="group block glass-card rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row h-auto md:h-64 transition-all duration-700 hover:-translate-y-2">
      <div className="w-full md:w-80 h-64 md:h-full bg-gray-100 flex-shrink-0 relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={ad.title} 
          className="w-full h-full object-cover transition-transform duration-[1.5s] cubic-bezier(0.2, 0, 0, 1) group-hover:scale-110"
        />
        <div className="absolute top-5 left-5">
           <span className="bg-primary-rose text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-rose/30">
             {ad.category}
           </span>
        </div>
      </div>
      <div className="p-8 md:p-10 flex-1 flex flex-col justify-between relative">
        <div className="absolute top-0 right-0 p-8">
           <svg className="w-6 h-6 text-primary-rose/20 group-hover:text-primary-rose/60 transition-colors duration-500" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
           </svg>
        </div>
        
        <div>
          <div className="flex flex-col mb-4">
            <h3 className="text-2xl md:text-3xl font-serif font-black text-near-black group-hover:text-primary-rose transition-colors duration-500 tracking-tight leading-tight mb-2">
              {ad.title}
            </h3>
            <div className="flex items-center gap-3">
               {ad.price ? (
                 <span className="inline-flex items-center gap-1.5 bg-primary-rose/10 text-primary-rose px-4 py-1.5 rounded-full text-sm font-black tracking-tight">
                   <span className="text-[10px] opacity-60">Rs.</span>
                   {ad.price?.toLocaleString()}
                 </span>
               ) : (
                 <span className="inline-flex items-center bg-logo-gold/10 text-logo-gold px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Contact for Price</span>
               )}
            </div>
          </div>
          <p className="text-[10px] font-black text-dark-grey/50 uppercase tracking-[0.25em] mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-logo-gold rounded-full shadow-[0_0_8px_rgba(200,151,58,0.4)]"></span>
            {ad.district} • {ad.city}
          </p>
          <p className="text-sm text-dark-grey/60 line-clamp-2 leading-relaxed font-medium max-w-xl group-hover:text-dark-grey transition-colors duration-500">
            {ad.description}
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-light-grey/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-earth-gradient flex items-center justify-center text-[10px] font-black text-wedding-cream shadow-lg">
                {ad.user?.name ? ad.user.name.charAt(0) : 'P'}
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-near-black uppercase tracking-widest">{ad.user?.name}</span>
                <span className="text-[8px] font-bold text-dark-grey/40 uppercase tracking-widest">Verified Vendor</span>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[9px] font-black text-dark-grey/30 uppercase tracking-[0.2em] hidden md:block">{formatTimeAgo(ad.createdAt)}</span>
             <div className="bg-near-black text-wedding-cream px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest group-hover:bg-primary-rose transition-all duration-500 shadow-lg">
               View Details
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AdCard;
