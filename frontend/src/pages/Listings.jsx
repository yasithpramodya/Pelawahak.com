import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import { MapPin, Star, Filter } from 'lucide-react';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || '';
  const locationParam = searchParams.get('location') || '';

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/listings?keyword=${keywordParam}&category=${categoryParam}&location=${locationParam}`);
      setListings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [keywordParam, categoryParam, locationParam]);

  return (
    <div className="bg-surface-gradient min-h-screen py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-[5%] left-[-5%] w-[400px] h-[400px] bg-primary-rose/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[5%] right-[-5%] w-[400px] h-[400px] bg-logo-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-serif text-near-black tracking-tight mb-2 uppercase">
              {categoryParam ? <><span className="text-gold-gradient">{categoryParam}</span> Vendors</> : 'All Vendors'}
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-grey/50">
              {listings.length} Premium results found
            </p>
          </div>
          <button className="mt-6 md:mt-0 flex items-center px-6 py-3 glass-card rounded-2xl shadow-md hover:-translate-y-1 text-[10px] font-black uppercase tracking-widest text-near-black border border-white/60">
            <Filter className="w-4 h-4 mr-3 text-primary-rose" />
            Filters
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-light-grey/30 border-t-primary-rose rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-dark-grey/40">Loading vendors...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <Link to={`/listings/${listing._id}`} key={listing._id} className="glass-card rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(184,92,110,0.15)] transition-all duration-500 group flex flex-col hover:-translate-y-2">
                <div className="h-64 bg-light-grey/20 overflow-hidden relative">
                  {listing.images && listing.images.length > 0 ? (
                    <img src={getImageUrl(listing.images[0])} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,0,0,1)]" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-warm-white to-light-grey/30 text-dark-grey/30">
                       <svg className="w-12 h-12 mb-2 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                       <span className="text-[9px] font-black uppercase tracking-widest">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-near-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                     <Star className="w-3.5 h-3.5 text-logo-gold fill-logo-gold" />
                     <span className="text-[10px] font-black text-near-black">{listing.ratings > 0 ? listing.ratings.toFixed(1) : 'New'}</span>
                     <span className="text-[9px] font-bold text-dark-grey/50">({listing.numReviews})</span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1 bg-white/50 backdrop-blur-sm">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-rose mb-3 block">{listing.category}</span>
                  <h3 className="text-xl font-black font-serif text-near-black mb-3 truncate leading-tight">{listing.title}</h3>
                  <div className="flex items-center text-dark-grey/60 text-[10px] font-black uppercase tracking-widest mb-6">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-primary-rose/70" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                  
                  <div className="border-t border-light-grey/40 pt-6 mt-auto flex justify-between items-center">
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-dark-grey/40 uppercase tracking-widest mb-1">Starting at</span>
                       <span className="text-xl font-black text-near-black">Rs {listing.price.toLocaleString()}</span>
                    </div>
                    <span className="text-[9px] font-black text-wedding-cream bg-near-black group-hover:bg-primary-rose px-6 py-3 rounded-xl uppercase tracking-widest transition-colors duration-300">Book Now</span>
                  </div>
                </div>
              </Link>
            ))}
            {listings.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white/40 rounded-[3rem] border border-white/60">
                <h3 className="text-xl font-black text-near-black uppercase tracking-wider mb-2">No vendors found</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-dark-grey/50">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;
