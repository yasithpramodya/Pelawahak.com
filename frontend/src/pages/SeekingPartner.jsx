import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { getImageUrl, BASE_URL } from '../services/api';

export default function SeekingPartner() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [religion, setReligion] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      let queryStr = '?';
      if (minAge) queryStr += `minAge=${minAge}&`;
      if (maxAge) queryStr += `maxAge=${maxAge}&`;
      if (religion) queryStr += `religion=${religion}&`;
      if (location) queryStr += `location=${location}`;

      const res = await axios.get(`${BASE_URL}/api/partner/search${queryStr}`);
      setProfiles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProfiles();
  };

  return (
    <div className="bg-surface-gradient min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-rose/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-logo-gold/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 animate-fadeIn">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-near-black uppercase tracking-tighter mb-4">
            Find Your <span className="text-gold-gradient">Match</span>
          </h1>
          <p className="text-dark-grey/60 font-semibold text-lg max-w-2xl mx-auto uppercase tracking-widest text-[10px]">
            Discover premium profiles handpicked for you
          </p>
        </div>
        
        {/* Filters */}
        <div className="glass-card p-8 rounded-[2.5rem] mb-12 border border-white/60 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-logo-gold/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <form className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end relative z-10" onSubmit={handleSearch}>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-dark-grey/60 mb-2">Min Age</label>
              <input type="number" className="w-full bg-white/50 border border-light-grey/40 rounded-2xl p-4 text-sm font-bold text-near-black focus:outline-none focus:ring-2 focus:ring-primary-rose/20 transition-all" value={minAge} onChange={e => setMinAge(e.target.value)} />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-dark-grey/60 mb-2">Max Age</label>
              <input type="number" className="w-full bg-white/50 border border-light-grey/40 rounded-2xl p-4 text-sm font-bold text-near-black focus:outline-none focus:ring-2 focus:ring-primary-rose/20 transition-all" value={maxAge} onChange={e => setMaxAge(e.target.value)} />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-dark-grey/60 mb-2">Religion</label>
              <select className="w-full bg-white/50 border border-light-grey/40 rounded-2xl p-4 text-sm font-bold text-near-black focus:outline-none focus:ring-2 focus:ring-primary-rose/20 transition-all appearance-none" value={religion} onChange={e => setReligion(e.target.value)}>
                <option value="">Any</option>
                <option value="Buddhist">Buddhist</option>
                <option value="Christian">Christian</option>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-dark-grey/60 mb-2">Location</label>
              <input type="text" placeholder="Colombo..." className="w-full bg-white/50 border border-light-grey/40 rounded-2xl p-4 text-sm font-bold text-near-black focus:outline-none focus:ring-2 focus:ring-primary-rose/20 transition-all" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div>
              <button type="submit" className="w-full bg-near-black hover:bg-black text-wedding-cream p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-near-black/20">
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Profiles */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-light-grey/30 border-t-primary-rose rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-dark-grey/40">Loading profiles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {profiles.map(profile => (
              <div key={profile._id} className="glass-card rounded-[2rem] hover:shadow-[0_20px_50px_rgba(184,92,110,0.15)] transition-all duration-500 overflow-hidden group flex flex-col hover:-translate-y-2">
                <div className="h-72 bg-light-grey/20 relative overflow-hidden">
                  {profile.photos && profile.photos.length > 0 ? (
                    <img src={getImageUrl(profile.photos[0])} alt="Profile" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-warm-white to-light-grey/30 text-dark-grey/30">
                      <svg className="w-12 h-12 mb-2 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      <span className="text-[9px] font-black uppercase tracking-widest">No Photo</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-near-black/90 to-transparent p-6 pt-12">
                    <h3 className="text-xl font-serif font-black text-wedding-cream truncate uppercase tracking-tight">{profile.user ? profile.user.name : 'Unknown User'}</h3>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-rose/90 mt-1">{profile.age} Yrs • {profile.location}</p>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 bg-white/50 backdrop-blur-sm">
                  <p className="text-[10px] font-black text-dark-grey/50 uppercase tracking-widest mb-3 truncate">💼 {profile.job}</p>
                  <p className="text-sm text-dark-grey/70 font-medium mb-6 line-clamp-2 leading-relaxed italic opacity-80 flex-1">{profile.bio}</p>
                  <Link to={`/partner/${profile._id}`} className="block text-center w-full bg-white border-2 border-light-grey/50 text-near-black hover:border-primary-rose hover:text-primary-rose py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300">
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
            {profiles.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white/40 rounded-[3rem] border border-white/60">
                <p className="text-[10px] font-black uppercase tracking-widest text-dark-grey/40">No matching profiles found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
