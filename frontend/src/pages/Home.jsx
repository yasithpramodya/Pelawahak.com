import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import AdCard from '../components/AdCard';
import PartnerCard from '../components/PartnerCard';
import { locations } from '../data/locations';
import { Link } from 'react-router-dom';

const Home = () => {
  const [ads, setAds] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');
  const [search, setSearch] = useState('');

  const scrollRef = useRef([]);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ads', {
        params: { category, district, search }
      });
      setAds(res.data);
    } catch (error) {
      console.error('Error fetching ads', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartners = async () => {
    setPartnersLoading(true);
    try {
      const res = await api.get('/partners');
      setPartners(res.data.slice(0, 4)); // Get latest 4 partners
    } catch (error) {
      console.error('Error fetching partners', error);
    } finally {
      setPartnersLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
    fetchPartners();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const currentRefs = scrollRef.current;
    currentRefs.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchAds();
  };

  const addToScrollRefs = (el) => {
    if (el && !scrollRef.current.includes(el)) {
      scrollRef.current.push(el);
    }
  };

  return (
    <div className="space-y-32 pb-32">
      {/* HERO SECTION */}
      <main className="relative h-[90vh] md:h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-blush.png" 
            alt="Wedding Background" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-warm-white via-warm-white/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-warm-white via-transparent to-transparent"></div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="w-full md:w-3/5">
            <div className="inline-flex items-center gap-2 bg-primary-rose/10 px-4 py-2 rounded-full mb-8 animate-reveal" style={{ animationDelay: '0.2s' }}>
               <span className="w-2 h-2 bg-primary-rose rounded-full animate-pulse"></span>
               <span className="text-[10px] font-black text-primary-rose uppercase tracking-[0.3em]">The Premium Registry</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter leading-[0.95] mb-8 text-near-black animate-reveal" style={{ animationDelay: '0.4s' }}>
              Crafting <span className="text-primary-rose italic">Eternal</span> <br />
              <span className="text-gold-gradient">Moments</span>
            </h1>
            
            <p className="text-lg md:text-xl text-dark-grey/70 font-medium mb-12 max-w-xl leading-relaxed animate-reveal" style={{ animationDelay: '0.6s' }}>
              Sri Lanka's most exclusive marketplace for elite wedding vendors and matrimonial matchmaking.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 animate-reveal" style={{ animationDelay: '0.8s' }}>
              <button 
                onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary-rose text-white hover:bg-deep-rose transition-all duration-500 px-12 py-5 rounded-full font-black text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-2xl shadow-primary-rose/30 hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                Explore Services
              </button>
              <Link to="/register" className="bg-white/40 backdrop-blur-md border border-primary-rose/30 text-primary-rose hover:bg-primary-rose hover:text-white transition-all duration-500 px-12 py-5 rounded-full font-black text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95">
                Join the Circle
              </Link>
            </div>
          </div>
        </div>

      </main>

      {/* FILTER SEARCH BAR & CATEGORIES */}
      <div id="search-section" ref={addToScrollRefs} className="max-w-7xl mx-auto px-4 -mt-24 relative z-30 reveal">
        <div className="glass-light p-4 rounded-[3rem] shadow-2xl">
          <form onSubmit={handleFilter} className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-1/3 px-8 py-4 bg-white/50 rounded-[2rem] border border-white/60">
              <label className="block text-[8px] font-black text-dark-grey/40 uppercase tracking-[0.3em] mb-1">Select Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent border-none text-near-black text-sm font-black focus:ring-0 cursor-pointer outline-none uppercase tracking-widest"
              >
                <option value="">All Services</option>
                <option value="Photography">Photography</option>
                <option value="Wedding Halls">Wedding Halls</option>
                <option value="Bridal Dressing">Bridal Dressing</option>
                <option value="Catering">Catering</option>
                <option value="Music & Ent.">Entertainment</option>
                <option value="Transport">Transport</option>
                <option value="Wedding Planning">Planning</option>
              </select>
            </div>
            
            <div className="flex-1 w-full bg-white/50 px-8 py-4 rounded-[2rem] border border-white/60">
               <label className="block text-[8px] font-black text-dark-grey/40 uppercase tracking-[0.3em] mb-1">Search Keywords</label>
               <input 
                type="text" 
                placeholder="What are you looking for?" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-none text-near-black text-sm font-black placeholder-dark-grey/30 focus:ring-0 outline-none uppercase tracking-widest"
              />
            </div>
            
            <button type="submit" className="w-full md:w-48 bg-primary-rose text-white px-8 py-6 rounded-[2rem] font-black text-[11px] tracking-[0.2em] uppercase hover:bg-deep-rose transition-all shadow-xl shadow-primary-rose/20 active:scale-95">
              Refine Results
            </button>
          </form>
        </div>

        {/* Categories Quick Filter */}
        <div className="mt-12 flex justify-center">
           <div className="inline-flex gap-8 px-10 py-6 glass-light rounded-full overflow-x-auto hide-scrollbar max-w-full">
              {[
                { name: 'Photography', icon: '📸' },
                { name: 'Wedding Halls', icon: '🏛️' },
                { name: 'Bridal Dressing', icon: '💄' },
                { name: 'Catering', icon: '🍽️' },
                { name: 'Transport', icon: '🚗' },
                { name: 'More', icon: '✨' }
              ].map((cat) => (
                <button 
                  key={cat.name} 
                  type="button" 
                  onClick={() => { setCategory(cat.name === 'More' ? '' : cat.name); fetchAds(); }} 
                  className={`flex flex-col items-center gap-2 group transition-all duration-500 ${category === cat.name ? 'scale-110' : 'opacity-60 hover:opacity-100 hover:-translate-y-1'}`}
                >
                  <span className="text-xl group-hover:drop-shadow-lg transition-all">{cat.icon}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${category === cat.name ? 'text-primary-rose' : 'text-dark-grey'}`}>{cat.name}</span>
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* FEATURED PARTNERS SECTION */}
      <section ref={addToScrollRefs} className="max-w-7xl mx-auto px-4 reveal">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-serif font-black text-near-black uppercase tracking-tight leading-none mb-4">
              Premium <span className="text-gold-gradient italic">Matrimony</span>
            </h2>
            <p className="text-dark-grey/50 font-black uppercase tracking-[0.4em] text-[10px]">Find your soulmate in Sri Lanka's elite circle</p>
          </div>
          <Link to="/partner" className="group flex items-center gap-4 bg-near-black/5 px-8 py-3 rounded-full hover:bg-near-black hover:text-white transition-all duration-500">
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">View Registry</span>
             <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {partnersLoading ? (
          <div className="flex justify-center py-24">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-rose"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {partners.map(partner => (
              <PartnerCard key={partner._id} partner={partner} />
            ))}
          </div>
        )}
      </section>

      {/* RECENT ADS SECTION */}
      <section ref={addToScrollRefs} className="max-w-7xl mx-auto px-4 reveal">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-serif font-black text-near-black uppercase tracking-tight leading-none mb-4">
              Curated <span className="text-primary-rose italic">Marketplace</span>
            </h2>
            <p className="text-dark-grey/50 font-black uppercase tracking-[0.4em] text-[10px]">Discover premier wedding services from across the island</p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-24">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-rose"></div>
          </div>
        ) : ads.length === 0 ? (
          <div className="glass-card p-32 rounded-[4rem] text-center">
             <p className="text-dark-grey/40 font-black tracking-[0.3em] uppercase text-xs">No services matched your selection</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {ads.map(ad => (
              <AdCard key={ad._id} ad={ad} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

