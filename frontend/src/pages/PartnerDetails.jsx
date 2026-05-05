import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';

const PartnerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const [showNumber, setShowNumber] = useState(false);

  useEffect(() => {
    const fetchPartner = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/partners/${id}`);
        setPartner(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
        if (err.response?.status === 404) {
          setError('This profile has been removed or does not exist.');
        } else if (err.response?.status === 400) {
          setError('Invalid profile ID format. Please check the link and try again.');
        } else {
          setError('Could not connect to the server. Please check your internet and try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPartner();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-grey mb-4"></div>
      <p className="text-near-black font-black uppercase tracking-widest text-xs">Fetching Profile...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-2xl mx-auto mt-20 p-12 bg-warm-white border border-light-grey/20 rounded-[3rem] shadow-2xl text-center">
      <div className="text-6xl mb-6">💍</div>
      <h2 className="text-2xl font-black text-near-black uppercase mb-4 tracking-tighter">Profile Unavailable</h2>
      <p className="text-dark-grey/60 font-medium mb-10 leading-relaxed px-10">{error}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={() => navigate(-1)} className="bg-near-black text-wedding-cream px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-near-black/20">Go Back</button>
        <button onClick={() => navigate('/partner')} className="bg-white text-primary-rose border-2 border-light-grey/20 px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-light-grey transition-all">All Partners</button>
      </div>
    </div>
  );

  if (!partner) return (
    <div className="text-center py-20">
      <p className="mb-4 font-black uppercase tracking-widest text-xs text-dark-grey/40">Profile not found.</p>
      <button onClick={() => navigate('/partner')} className="text-primary-rose font-black uppercase tracking-widest text-xs">Back to all partners</button>
    </div>
  );

  const images = partner.images && Array.isArray(partner.images) && partner.images.length > 0 
      ? partner.images.map(img => getImageUrl(img))
      : ['https://via.placeholder.com/600x800?text=Profile+Image'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-fadeIn">
      <div className="bg-white rounded-[2rem] md:rounded-[4rem] shadow-2xl overflow-hidden border border-light-grey/10">
        <div className="flex flex-col lg:flex-row">

          
          {/* IMAGE SECTION */}
          <div className="w-full lg:w-1/2 p-6 lg:p-12 bg-warm-white border-r border-light-grey/10 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 -z-0">
               <span className="text-[20rem] font-black text-near-black">PELA</span>
            </div>
            <div className="aspect-[3/4] w-full max-w-md mx-auto bg-black rounded-[3rem] overflow-hidden flex items-center justify-center shadow-[0_30px_60px_-15px_rgba(141,110,99,0.3)] group relative border-[12px] border-white z-10">
              <img 
                src={images[mainImageIndex]} 
                alt={partner.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute bottom-8 left-8 right-8">
                 <div className="bg-black/30 backdrop-blur-xl p-5 rounded-2xl border border-white/20 text-white shadow-2xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Official Profile Photo</p>
                    <p className="text-sm font-black uppercase tracking-widest">IMAGE {mainImageIndex + 1} OF {images.length}</p>
                 </div>
              </div>
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 mt-12 justify-center z-10">
                {images.map((img, index) => (
                  <button 
                    key={index} 
                    onClick={() => setMainImageIndex(index)}
                    className={`h-24 w-20 flex-shrink-0 cursor-pointer border-4 rounded-[1.5rem] overflow-hidden transition-all duration-500 ${mainImageIndex === index ? 'border-light-grey ring-8 ring-primary-rose/5 scale-110' : 'border-white hover:border-light-grey/20'}`}
                  >
                    <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS SECTION */}
          <div className="w-full lg:w-1/2 p-6 md:p-12 lg:p-16 flex flex-col bg-white relative">
            <div className="mb-10 md:mb-12 relative z-10">
              <div className="flex justify-between items-center mb-8">
                <span className="bg-deep-rose/10 text-near-black px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-light-grey/20">
                  {partner.gender} MATRIMONIAL
                </span>
                <span className="text-dark-grey/50 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                  💍 {partner.views || 0} VIEWS
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-near-black leading-[0.85] mb-6 uppercase tracking-tighter"><span className="text-gold-gradient">{partner.title}</span></h1>
              <div className="flex items-center gap-6">
                 <span className="text-3xl md:text-5xl font-black text-gold-gradient italic">{partner.age}</span>
                 <div className="h-10 w-[2px] bg-deep-rose/20 rotate-12"></div>
                 <p className="text-dark-grey/40 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">
                   {partner.religion} • {partner.district}, {partner.city}
                 </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-12 relative z-10">
               <div className="p-6 md:p-8 bg-warm-white rounded-[2rem] md:rounded-[2.5rem] border border-light-grey/10 shadow-sm transform hover:-translate-y-1 transition-transform">
                  <p className="text-[10px] font-black text-dark-grey/70 uppercase tracking-widest mb-2">Profession</p>
                  <p className="text-lg md:text-xl font-black text-near-black uppercase leading-tight tracking-tight">{partner.profession}</p>
               </div>
               <div className="p-6 md:p-8 bg-warm-white rounded-[2rem] md:rounded-[2.5rem] border border-light-grey/10 shadow-sm transform hover:-translate-y-1 transition-transform">
                  <p className="text-[10px] font-black text-dark-grey/70 uppercase tracking-widest mb-2">Education</p>
                  <p className="text-lg md:text-xl font-black text-near-black uppercase leading-tight tracking-tight">{partner.education || 'Private'}</p>
               </div>
               <div className="p-6 md:p-8 bg-warm-white rounded-[2rem] md:rounded-[2.5rem] border border-light-grey/10 shadow-sm transform hover:-translate-y-1 transition-transform">
                  <p className="text-[10px] font-black text-dark-grey/70 uppercase tracking-widest mb-2">Height</p>
                  <p className="text-lg md:text-xl font-black text-near-black uppercase leading-tight tracking-tight">{partner.height || 'Confidential'}</p>
               </div>
               <div className="p-6 md:p-8 bg-warm-white rounded-[2rem] md:rounded-[2.5rem] border border-light-grey/10 shadow-sm transform hover:-translate-y-1 transition-transform">
                  <p className="text-[10px] font-black text-dark-grey/70 uppercase tracking-widest mb-2">Origin</p>
                  <p className="text-lg md:text-xl font-black text-near-black uppercase leading-tight tracking-tight">{partner.district}</p>
               </div>
            </div>


            <div className="flex-1 mb-16 relative z-10">
              <h3 className="text-[11px] font-black text-near-black uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
                <span className="w-10 h-[1px] bg-deep-rose"></span>
                Member Narrative
              </h3>
              <p className="text-dark-grey/60 font-medium leading-loose text-lg italic bg-warm-white/30 p-8 rounded-[2rem] border-l-8 border-light-grey">
                "{partner.description}"
              </p>
            </div>

            {/* SELLER CARD */}
            <div className="mt-auto bg-earth-gradient rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-12 text-wedding-cream shadow-[0_40px_80px_-20px_rgba(45,27,23,0.4)] relative overflow-hidden group mb-4 md:mb-0">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-45 transition-transform duration-1000">
                 <span className="text-[8rem] md:text-[12rem] font-black text-primary-rose">💍</span>
              </div>
              <h3 className="text-[9px] md:text-[10px] font-black text-wedding-cream/60 uppercase tracking-[0.3em] mb-8">Direct Contact Interface</h3>
              <div className="flex items-center gap-6 md:gap-8 mb-12 relative z-10">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-primary-rose rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center text-3xl md:text-5xl font-black text-white shadow-2xl rotate-3">
                  {partner.user?.name ? partner.user.name.charAt(0) : 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="font-black text-white text-xl md:text-3xl uppercase tracking-tighter leading-none mb-2 truncate">{partner.user?.name || 'Verified Member'}</p>
                  <p className="text-[10px] md:text-[11px] text-primary-rose font-black tracking-[0.2em] truncate opacity-60 italic">{partner.user?.email || 'Contact Info Hidden'}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 md:gap-5 relative z-10">
                {partner.phone && (
                  <button 
                    onClick={() => setShowNumber(!showNumber)}
                    className="w-full flex items-center justify-center gap-4 bg-white text-near-black hover:bg-primary-rose hover:text-white font-black py-5 md:py-7 px-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl transition-all duration-500 transform active:scale-95"
                  >
                    <span className="text-2xl md:text-4xl group-hover:rotate-12 transition-transform">👰</span>
                    <span className="text-sm md:text-xl tracking-tighter uppercase whitespace-nowrap">
                      {showNumber ? partner.phone : 'REVEAL CONTACT NUMBER'}
                    </span>
                  </button>
                )}
                
                <Link 
                  to={`/chat?receiver=${partner.user?._id}`}
                  className="w-full flex items-center justify-center gap-4 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-black py-5 md:py-7 px-8 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-500 transform active:scale-95 shadow-xl"
                >
                  <span className="text-2xl md:text-4xl">💬</span>
                  <span className="text-sm md:text-xl tracking-tighter uppercase">START A SECURE CHAT</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
      
      {/* Footer Navigation */}
      <div className="mt-12 flex justify-center">
        <button 
          onClick={() => navigate(-1)} 
          className="bg-white hover:bg-gray-50 text-gray-400 px-10 py-4 rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] transition-all border border-gray-100 shadow-sm"
        >
          ← Return to Matchmaking
        </button>
      </div>
    </div>
  );
};

export default PartnerDetails;
