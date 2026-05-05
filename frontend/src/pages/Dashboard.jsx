import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [myAds, setMyAds] = useState([]);
  const [myPartners, setMyPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [adsRes, partnersRes] = await Promise.all([
          api.get('/ads/my'),
          api.get('/partners/my')
        ]);
        setMyAds(adsRes.data);
        setMyPartners(partnersRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-16">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-4 gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-near-black uppercase tracking-tighter leading-none mb-3">Management <span className="text-primary-rose">Hub</span></h2>
          <p className="text-dark-grey/70 font-black uppercase tracking-widest text-[9px] md:text-[10px]">Track your listings and matrimonial profiles</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
           <Link to="/post-ad" className="flex-1 md:flex-none text-center bg-primary-rose text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest hover:bg-deep-rose transition-all shadow-xl shadow-primary-rose/20">
             Post Marketplace Ad
           </Link>
           <Link to="/post-partner" className="flex-1 md:flex-none text-center bg-near-black text-wedding-cream px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest hover:bg-black transition-all shadow-xl shadow-near-black/10">
             Post Partner Profile
           </Link>
        </div>
      </div>


      {/* WEDDING ADS SECTION */}
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-light-grey/10 overflow-hidden">
        <div className="p-6 md:p-8 bg-warm-white border-b border-light-grey/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="w-10 h-[1px] bg-deep-rose"></span>
            <h3 className="text-[10px] md:text-[11px] font-black text-near-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Marketplace Listings</h3>
          </div>
          <span className="bg-near-black text-wedding-cream px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest">{myAds.length} ACTIVE</span>
        </div>

        
        {loading ? (
          <div className="p-20 text-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-light-grey mx-auto"></div>
          </div>
        ) : myAds.length === 0 ? (
          <div className="p-20 text-center text-dark-grey/70 font-black uppercase tracking-widest text-xs italic">No listings found in your portfolio.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-warm-white/30 text-dark-grey/70 uppercase text-[9px] font-black tracking-[0.2em] border-b border-light-grey/10">
                  <th className="py-6 px-10 text-left">Asset Preview</th>
                  <th className="py-6 px-10 text-left">Classification</th>
                  <th className="py-6 px-10 text-center">Engagement</th>
                  <th className="py-6 px-10 text-center">Current Status</th>
                  <th className="py-6 px-10 text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="text-near-black text-sm">
                {myAds.map((ad) => (
                  <tr key={ad._id} className="border-b border-light-grey/5 hover:bg-warm-white/30 transition-colors">
                    <td className="py-6 px-10 text-left">
                       {ad.images && ad.images[0] ? (
                          <img 
                            src={getImageUrl(ad.images[0])} 
                            alt="" 
                            className="w-16 h-16 object-cover rounded-2xl shadow-md border-2 border-white"
                          />
                       ) : (
                          <div className="w-16 h-16 bg-warm-white rounded-2xl border border-light-grey/10 flex items-center justify-center text-[10px] font-black text-primary-rose italic">N/A</div>
                       )}
                    </td>
                    <td className="py-6 px-10 text-left">
                      <Link to={`/ad/${ad._id}`} target="_blank" className="font-black text-near-black hover:text-primary-rose transition-colors block text-lg uppercase tracking-tight leading-none mb-2">
                        {ad.title}
                      </Link>
                      <p className="text-[9px] text-dark-grey/40 font-black tracking-widest uppercase">{ad.category} • {ad.district}</p>
                    </td>
                    <td className="py-6 px-10 text-center">
                      <span className="text-primary-rose font-black text-lg">👀 {ad.views || 0}</span>
                      <p className="text-[8px] font-black text-dark-grey/30 uppercase tracking-widest">Profile Hits</p>
                    </td>
                    <td className="py-6 px-10 text-center">
                       <span className={`py-2 px-5 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 shadow-sm ${
                         ad.status === 'approved' ? 'bg-deep-rose/10 text-near-black border-light-grey/20' : 
                         ad.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 
                         'bg-warm-white text-dark-grey/60 border-light-grey/5 italic'
                       }`}>
                        {ad.status === 'pending' ? 'Reviewing' : ad.status}
                      </span>
                    </td>
                    <td className="py-6 px-10 text-right">
                      <Link 
                        to={`/ad/${ad._id}`}
                        target="_blank"
                        className="bg-near-black text-wedding-cream px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-near-black/10"
                      >
                        Navigate
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PARTNER PROFILES SECTION */}
      <div className="bg-white rounded-[3rem] shadow-2xl border border-light-grey/10 overflow-hidden">
        <div className="p-8 bg-warm-white border-b border-light-grey/10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="w-10 h-[1px] bg-deep-rose"></span>
            <h3 className="text-[11px] font-black text-near-black uppercase tracking-[0.3em]">Matrimonial Profiles</h3>
          </div>
          <span className="bg-deep-rose text-near-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{myPartners.length} TOTAL</span>
        </div>
        
        {loading ? (
          <div className="p-20 text-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-light-grey mx-auto"></div>
          </div>
        ) : myPartners.length === 0 ? (
          <div className="p-20 text-center text-dark-grey/60 font-black uppercase tracking-widest text-xs italic">Establishing focus: No matching profiles established.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-warm-white/30 text-dark-grey/70 uppercase text-[9px] font-black tracking-[0.2em] border-b border-light-grey/10">
                  <th className="py-6 px-10 text-left">Identity Preview</th>
                  <th className="py-6 px-10 text-left">Profile Configuration</th>
                  <th className="py-6 px-10 text-center">Professional Meta</th>
                  <th className="py-6 px-10 text-center">Current Status</th>
                  <th className="py-6 px-10 text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="text-near-black text-sm">
                {myPartners.map((partner) => (
                  <tr key={partner._id} className="border-b border-light-grey/5 hover:bg-warm-white/30 transition-colors">
                    <td className="py-6 px-10 text-left">
                       {partner.images && partner.images[0] ? (
                          <img 
                            src={getImageUrl(partner.images[0])} 
                            alt="" 
                            className="w-16 h-16 object-cover rounded-2xl shadow-md border-2 border-white"
                          />
                       ) : (
                          <div className="w-16 h-16 bg-warm-white rounded-2xl border border-light-grey/10 flex items-center justify-center text-[10px] font-black text-primary-rose italic">N/A</div>
                       )}
                    </td>
                    <td className="py-6 px-10 text-left">
                      <Link to={`/partner/${partner._id}`} target="_blank" className="font-black text-near-black hover:text-primary-rose transition-colors block text-lg uppercase tracking-tight leading-none mb-2">
                        {partner.title}
                      </Link>
                      <p className="text-[9px] text-dark-grey/80 font-black tracking-widest uppercase">{partner.gender} • {partner.age} yrs • {partner.religion}</p>
                    </td>
                    <td className="py-6 px-10 text-center">
                      <p className="text-[10px] font-black text-near-black uppercase">{partner.profession}</p>
                      <p className="text-[8px] font-black text-primary-rose uppercase tracking-widest">{partner.district}</p>
                    </td>
                    <td className="py-6 px-10 text-center">
                       <span className={`py-2 px-5 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 shadow-sm ${
                         partner.status === 'approved' ? 'bg-deep-rose/10 text-near-black border-light-grey/20' : 
                         partner.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 
                         'bg-warm-white text-dark-grey/60 border-light-grey/5 italic'
                       }`}>
                        {partner.status === 'pending' ? 'Reviewing' : partner.status}
                      </span>
                    </td>
                    <td className="py-6 px-10 text-right">
                      <Link 
                        to={`/partner/${partner._id}`}
                        target="_blank"
                        className="bg-near-black text-wedding-cream px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-near-black/10"
                      >
                        Navigate
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
