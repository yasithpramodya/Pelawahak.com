import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PartnerCard from '../components/PartnerCard';
import { locations } from '../data/locations';

const Partner = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    gender: '',
    religion: '',
    district: '',
    ageMin: '',
    ageMax: '',
    search: ''
  });

  const religions = ['Buddhist', 'Hindu', 'Christian', 'Catholic', 'Muslim', 'Other'];

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await api.get('/partners', { params: filters });
      setPartners(res.data);
    } catch (error) {
      console.error('Error fetching partners', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPartners();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 md:mb-16 gap-6 md:gap-8">
        <div>
          <h2 className="text-4xl md:text-6xl font-black text-near-black uppercase tracking-tighter leading-none mb-4">Partner <span className="text-gold-gradient">Archive</span></h2>
          <p className="text-dark-grey/70 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] italic">Refine your aspirations to discover the ideal union</p>
        </div>
        <div className="flex bg-warm-white p-1.5 md:p-2 rounded-[1.5rem] md:rounded-[2rem] border border-light-grey/10 shadow-sm w-fit">
           <button className="bg-primary-rose text-white px-6 md:px-10 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-rose/30 transition-all hover:bg-deep-rose">PREMIUM</button>
           <button className="text-dark-grey/60 px-6 md:px-10 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:text-near-black transition-colors">ARCHIVE</button>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
        
        {/* FILTERS SIDEBAR */}
        <div className="lg:col-span-1">
           <form onSubmit={handleSearch} className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl border border-light-grey/10 lg:sticky lg:top-10 space-y-6 md:space-y-10">

              <div className="flex items-center gap-4 mb-2">
                 <span className="w-10 h-[1px] bg-deep-rose"></span>
                 <h3 className="text-[10px] font-black text-dark-grey/60 uppercase tracking-[0.4em]">Refine Search</h3>
              </div>
              
              <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="block text-[9px] font-black text-dark-grey/60 uppercase tracking-[0.2em] ml-2">Identity Keyword</label>
                    <input 
                      type="text" 
                      name="search"
                      value={filters.search}
                      onChange={handleInputChange}
                      placeholder="e.g. Engineer, Doctor"
                      className="w-full bg-warm-white/50 border-none rounded-2xl p-5 text-[11px] font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all placeholder:text-dark-grey/40 uppercase tracking-tight"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[9px] font-black text-dark-grey/60 uppercase tracking-[0.2em] ml-2">Seeking Profile</label>
                    <select 
                      name="gender" 
                      value={filters.gender}
                      onChange={handleInputChange}
                      className="w-full bg-warm-white/50 border-none rounded-2xl p-5 text-[11px] font-black text-near-black focus:ring-2 focus:ring-primary-rose transition-all uppercase tracking-tight"
                    >
                      <option value="">ALL GENDERS</option>
                      <option value="Female">BRIDES (FEMALE)</option>
                      <option value="Male">GROOMS (MALE)</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[9px] font-black text-dark-grey/60 uppercase tracking-[0.2em] ml-2">Spiritual Focus</label>
                    <select 
                      name="religion" 
                      value={filters.religion}
                      onChange={handleInputChange}
                      className="w-full bg-warm-white/50 border-none rounded-2xl p-5 text-[11px] font-black text-near-black focus:ring-2 focus:ring-primary-rose transition-all uppercase tracking-tight"
                    >
                      <option value="">ALL RELIGIONS</option>
                      {religions.map(r => <option key={r} value={r.toUpperCase()}>{r.toUpperCase()}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[9px] font-black text-dark-grey/60 uppercase tracking-[0.2em] ml-2">Regional Filter</label>
                    <select 
                      name="district" 
                      value={filters.district}
                      onChange={handleInputChange}
                      className="w-full bg-warm-white/50 border-none rounded-2xl p-5 text-[11px] font-black text-near-black focus:ring-2 focus:ring-primary-rose transition-all uppercase tracking-tight"
                    >
                      <option value="">ALL ISLAND</option>
                      {Object.keys(locations).map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
                    </select>
                  </div>

                  <div className="flex gap-4">
                     <div className="flex-1 space-y-3">
                        <label className="block text-[9px] font-black text-dark-grey/60 uppercase tracking-[0.2em] ml-2">Min Age</label>
                        <input 
                          type="number" 
                          name="ageMin"
                          value={filters.ageMin}
                          onChange={handleInputChange}
                          className="w-full bg-warm-white/50 border-none rounded-2xl p-5 text-[11px] font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all"
                        />
                     </div>
                     <div className="flex-1 space-y-3">
                        <label className="block text-[9px] font-black text-dark-grey/60 uppercase tracking-[0.2em] ml-2">Max Age</label>
                        <input 
                          type="number" 
                          name="ageMax"
                          value={filters.ageMax}
                          onChange={handleInputChange}
                          className="w-full bg-warm-white/50 border-none rounded-2xl p-5 text-[11px] font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all"
                        />
                     </div>
                  </div>

                   <button 
                     type="submit"
                     className="w-full bg-primary-rose text-white font-black py-5 rounded-2xl shadow-2xl shadow-primary-rose/30 uppercase tracking-[0.3em] text-[10px] transition-all transform active:scale-95 hover:bg-deep-rose hover:scale-[1.02] flex items-center justify-center gap-3"
                   >
                     Find Matches <span>→</span>
                   </button>
              </div>
           </form>
        </div>

        {/* RESULTS GRID */}
        <div className="lg:col-span-3">
           {loading ? (
             <div className="p-16 md:p-32 text-center bg-white rounded-[2rem] md:rounded-[4rem] shadow-xl border border-light-grey/10">
                <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-t-2 border-light-grey border-r-2 border-light-grey mx-auto mb-8 shadow-inner shadow-primary-rose/20"></div>
                <p className="text-primary-rose font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-[9px] md:text-[10px] animate-pulse">Consulting Registry...</p>
             </div>

           ) : partners.length === 0 ? (
             <div className="bg-white p-32 text-center rounded-[4rem] border border-light-grey/10 shadow-2xl">
                <div className="w-24 h-24 bg-warm-white rounded-full flex items-center justify-center mx-auto mb-10 text-4xl shadow-inner border border-light-grey/10">🔍</div>
                <h4 className="text-2xl font-black text-near-black uppercase tracking-tight mb-4">No Affinities Found</h4>
                <p className="text-dark-grey/60 font-black uppercase tracking-widest text-[10px] mb-8 leading-loose">We were unable to locate profiles matching your current specifications. Experience the archive by refining your filters.</p>
                <button 
                  onClick={() => { setFilters({ gender:'', religion:'', district:'', ageMin:'', ageMax:'', search:'' }); setTimeout(fetchPartners, 100); }} 
                  className="text-primary-rose font-black uppercase text-[10px] tracking-[0.4em] border-b-2 border-light-grey/30 hover:border-light-grey transition-all pb-1"
                >
                  Reset Parameters
                </button>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {partners.map(p => (
                   <PartnerCard key={p._id} partner={p} />
                ))}
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default Partner;
