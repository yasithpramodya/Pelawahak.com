import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';

const AdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [showNumber, setShowNumber] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/ads/${id}`);
        setAd(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
        if (err.response?.status === 404) {
          setError('This ad has been removed or does not exist.');
        } else if (err.response?.status === 400) {
          setError('Invalid ad ID format. Please check the link and try again.');
        } else {
          setError('Could not connect to the server. Please check your internet and try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAd();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-rose mb-4"></div>
      <p className="text-near-black font-black uppercase tracking-widest text-xs">Fetching Ad details...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-2xl mx-auto mt-20 p-12 bg-warm-white border border-light-grey/20 rounded-[3rem] shadow-2xl text-center">
      <div className="text-6xl mb-6">✨</div>
      <h2 className="text-2xl font-black text-near-black uppercase mb-4 tracking-tighter">Something went wrong</h2>
      <p className="text-dark-grey/60 font-medium mb-10 leading-relaxed px-10">{error}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={() => navigate(-1)} className="bg-near-black text-wedding-cream px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-near-black/20">Go Back</button>
        <button onClick={() => navigate('/')} className="bg-white text-primary-rose border-2 border-light-grey/20 px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-light-grey transition-all">Back to Home</button>
      </div>
    </div>
  );

  if (!ad) return (
    <div className="text-center py-20">
      <p className="mb-4 font-black uppercase tracking-widest text-xs text-dark-grey/40">Ad not found.</p>
      <button onClick={() => navigate('/')} className="text-primary-rose font-black uppercase tracking-widest text-xs">Go to Home</button>
    </div>
  );

  const images = ad.images && Array.isArray(ad.images) && ad.images.length > 0
    ? ad.images.map(img => getImageUrl(img))
    : ['https://placehold.co/800x500?text=No+Image'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 animate-fadeIn">
      <title>{`${ad.title} | ${ad.category} in ${ad.district} | Pelawahak.com`}</title>
      <meta name="description" content={`Premium wedding service: ${ad.title} (${ad.category}) in ${ad.city}, ${ad.district}. Price: Rs. ${ad.price ? ad.price.toLocaleString() : 'Negotiable'}. ${ad.description ? ad.description.slice(0, 120) : ''}`} />
      <link rel="canonical" href={`https://pelawahak.com/ad/${ad._id}`} />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-dark-grey/60 hover:text-near-black font-black uppercase text-[10px] tracking-widest transition-all mb-6 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Listings
      </button>

      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-light-grey/10">
        <div className="flex flex-col xl:flex-row min-h-0">

          {/* ─── IMAGE SECTION ─── */}
          <div className="xl:w-[58%] flex flex-col bg-warm-white/40 border-r border-light-grey/10">
            {/* Main image */}
            <div className="relative w-full bg-near-black overflow-hidden" style={{ aspectRatio: '16/10' }}>
              <img
                src={images[mainImageIndex]}
                alt={ad.title}
                className="w-full h-full object-contain transition-all duration-500"
              />
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
                {mainImageIndex + 1} / {images.length}
              </div>
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setMainImageIndex(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full text-white flex items-center justify-center transition-all text-lg font-bold"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setMainImageIndex(i => (i + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full text-white flex items-center justify-center transition-all text-lg font-bold"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-3 p-5 overflow-x-auto scrollbar-hide bg-white/50">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-14 lg:w-24 lg:h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      mainImageIndex === index
                        ? 'border-primary-rose ring-2 ring-primary-rose/20 opacity-100'
                        : 'border-light-grey/30 opacity-60 hover:opacity-90 hover:border-light-grey'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description — shown in image column on desktop */}
            <div className="hidden xl:block p-8 border-t border-light-grey/10">
              <h3 className="text-[9px] font-black text-dark-grey/50 uppercase tracking-[0.3em] flex items-center gap-3 mb-4">
                <span className="w-5 h-[1px] bg-primary-rose"></span>
                About this Ad
              </h3>
              <p className="text-dark-grey/70 whitespace-pre-line leading-relaxed text-sm font-medium">
                {ad.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* ─── DETAILS SECTION ─── */}
          <div className="xl:w-[42%] flex flex-col p-6 md:p-8 lg:p-10 bg-white">

            {/* Category + Views */}
            <div className="flex items-center justify-between mb-5">
              <span className="bg-primary-rose/10 text-primary-rose px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-primary-rose/20">
                {ad.category}
              </span>
              <span className="text-dark-grey/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                👁️ {ad.views || 0} views
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-black text-near-black leading-tight tracking-tighter mb-3 uppercase">
              <span className="text-gold-gradient">{ad.title}</span>
            </h1>

            {/* Location */}
            <p className="text-primary-rose font-black flex items-center gap-2 text-[10px] uppercase tracking-widest mb-7">
              📍 {ad.city}, {ad.district}
            </p>

            {/* Price card */}
            <div className="bg-earth-gradient rounded-[1.5rem] p-6 lg:p-8 text-wedding-cream shadow-xl shadow-near-black/20 mb-7 relative overflow-hidden group">
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-primary-rose/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <p className="text-primary-rose/60 text-[9px] font-black uppercase tracking-[0.3em] mb-2">Estimated Investment</p>
              <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-lg font-black text-primary-rose/50 italic">Rs.</span>
                <span className="text-4xl font-black tabular-nums tracking-tighter">
                  {ad.price ? Number(ad.price).toLocaleString() : 'Negotiable'}
                </span>
              </div>
            </div>

            {/* Description (mobile only) */}
            <div className="xl:hidden mb-7">
              <h3 className="text-[9px] font-black text-dark-grey/50 uppercase tracking-[0.3em] flex items-center gap-3 mb-3">
                <span className="w-5 h-[1px] bg-primary-rose"></span>
                Description
              </h3>
              <p className="text-dark-grey/70 whitespace-pre-line leading-relaxed text-sm font-medium">
                {ad.description || 'No description provided.'}
              </p>
            </div>

            {/* Seller Card */}
            <div className="mt-auto bg-warm-white/60 rounded-[1.5rem] p-6 border border-light-grey/10 shadow-sm">
              <h3 className="text-[9px] font-black text-dark-grey/50 uppercase tracking-[0.4em] mb-5 border-b border-light-grey/10 pb-3">
                Contact Seller
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-near-black rounded-2xl flex items-center justify-center text-xl font-black text-wedding-cream shadow-md rotate-2 flex-shrink-0">
                  {ad.user?.name ? ad.user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="font-black text-near-black text-base uppercase tracking-tight leading-none mb-1 truncate">
                    {ad.user?.name || 'Verified Partner'}
                  </p>
                  <p className="text-[10px] text-dark-grey/60 font-bold tracking-widest truncate">
                    {ad.user?.email || 'Privacy Protected'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {ad.phone && (
                  <button
                    onClick={() => setShowNumber(!showNumber)}
                    className="w-full flex items-center justify-center gap-3 bg-primary-rose text-white hover:bg-deep-rose font-black py-4 px-6 rounded-2xl shadow-lg shadow-primary-rose/25 transition-all duration-300 active:scale-95 hover:scale-[1.02]"
                  >
                    <span className="text-xl">📞</span>
                    <span className="text-sm tracking-tighter uppercase">
                      {showNumber ? ad.phone : 'Show Phone Number'}
                    </span>
                  </button>
                )}

                <Link
                  to={`/chat?receiver=${ad.user?._id}`}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-light-grey/40 text-near-black hover:bg-warm-white hover:border-near-black/20 font-black py-4 px-6 rounded-2xl transition-all duration-300 active:scale-95 shadow-sm"
                >
                  <span className="text-xl">💬</span>
                  <span className="text-sm tracking-tighter uppercase">Inquire via Chat</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetails;
