import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../services/api';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const [ads, setAds] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ads'); // 'ads' or 'partners'
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adsRes, partnersRes] = await Promise.all([
        api.get('/admin/ads'),
        api.get('/admin/partners')
      ]);
      setAds(adsRes.data);
      setPartners(partnersRes.data);
    } catch (error) {
      console.error('Error fetching admin data', error);
      setMessage({ text: 'Failed to fetch listings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handler for Ads
  const handleAdStatus = async (id, action) => {
    if (action === 'reject' && !window.confirm('Are you sure you want to reject this ad?')) return;
    try {
      await api.put(`/admin/ads/${id}/${action}`);
      setMessage({ text: `Ad successfully ${action}ed!`, type: 'success' });
      fetchData();
    } catch (error) {
      setMessage({ text: `Failed to ${action} ad`, type: 'error' });
    }
  };

  const handleAdDelete = async (id) => {
    if (!window.confirm('PERMANENTLY DELETE this ad?')) return;
    try {
      await api.delete(`/admin/ads/${id}`);
      setMessage({ text: 'Ad deleted forever.', type: 'success' });
      fetchData();
    } catch (error) {
      setMessage({ text: 'Delete failed.', type: 'error' });
    }
  };

  // Handler for Partners
  const handlePartnerStatus = async (id, action) => {
    if (action === 'reject' && !window.confirm('Are you sure you want to reject this profile?')) return;
    try {
      await api.put(`/admin/partners/${id}/${action}`);
      setMessage({ text: `Profile successfully ${action}ed!`, type: 'success' });
      fetchData();
    } catch (error) {
      setMessage({ text: `Failed to ${action} profile`, type: 'error' });
    }
  };

  const handlePartnerDelete = async (id) => {
    if (!window.confirm('PERMANENTLY DELETE this partner profile?')) return;
    try {
      await api.delete(`/admin/partners/${id}`);
      setMessage({ text: 'Profile deleted forever.', type: 'success' });
      fetchData();
    } catch (error) {
      setMessage({ text: 'Delete failed.', type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 md:mb-16 gap-6 md:gap-8">
        <div>
          <h2 className="text-4xl md:text-6xl font-black text-near-black uppercase tracking-tighter leading-none mb-4">Moderation <span className="text-primary-rose">Vault</span></h2>
          <p className="text-dark-grey/60 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] italic">Review and authenticate premium registry entries</p>
        </div>
        <div className="flex flex-wrap md:flex-nowrap bg-warm-white p-1.5 md:p-2 rounded-[1.5rem] md:rounded-[2rem] border border-light-grey/10 shadow-sm w-fit">
           <button 
            onClick={() => setActiveTab('ads')}
            className={`flex-1 md:flex-none px-6 md:px-10 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ads' ? 'bg-near-black text-wedding-cream shadow-xl' : 'text-dark-grey/60 hover:text-near-black'}`}
           >
             MARKETPLACE
           </button>
           <button 
            onClick={() => setActiveTab('partners')}
            className={`flex-1 md:flex-none px-6 md:px-10 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'partners' ? 'bg-near-black text-wedding-cream shadow-xl' : 'text-dark-grey/60 hover:text-near-black'}`}
           >
             MATRIMONIAL
           </button>
        </div>
      </div>


      {message.text && (
        <div className={`mb-12 p-8 rounded-[3rem] font-bold shadow-2xl animate-pulse flex items-center gap-6 border-b-4 ${
          message.type === 'success' ? 'bg-deep-rose text-near-black border-light-grey' : 'bg-red-500 text-white border-red-900'
        }`}>
          <span className="text-2xl">{message.type === 'success' ? '✦' : '‼️'}</span>
          <span className="uppercase tracking-[0.2em] text-[10px] font-black">{message.text}</span>
          <button onClick={() => setMessage({text:'', type:''})} className="ml-auto opacity-50 hover:opacity-100 font-black">CLOSE [X]</button>
        </div>
      )}

      <div className="bg-white rounded-[2rem] md:rounded-[4rem] shadow-2xl border border-light-grey/10 overflow-hidden">
        <div className="p-6 md:p-10 bg-warm-white/30 border-b border-light-grey/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
             <span className="w-10 h-[1px] bg-deep-rose"></span>
             <h3 className="text-[10px] md:text-[11px] font-black text-near-black uppercase tracking-[0.3em] md:tracking-[0.4em]">
               Authenticating {activeTab === 'ads' ? 'Service Listings' : 'Partner Proposals'}
             </h3>
          </div>
          <button onClick={fetchData} className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-rose hover:text-near-black transition-all flex items-center gap-2">
            <span className="text-lg">⟳</span> SYNCHRONIZE DATA
          </button>
        </div>

        
        {loading ? (
          <div className="p-32 text-center bg-white">
             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-light-grey border-r-2 border-light-grey mx-auto mb-8"></div>
             <p className="text-primary-rose font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Establishing Secure Connection...</p>
          </div>
        ) : (activeTab === 'ads' ? ads : partners).length === 0 ? (
          <div className="p-32 text-center text-dark-grey/60 font-black uppercase tracking-widest text-xs italic">The moderation queue is currently pristine. No pending entries.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-warm-white/50 text-dark-grey/60 uppercase text-[9px] font-black tracking-[0.3em] border-b border-light-grey/10">
                  <th className="py-8 px-10 text-left">Asset Preview</th>
                  <th className="py-8 px-10 text-left">Internal Identification</th>
                  <th className="py-8 px-10 text-center">Status Meta</th>
                  <th className="py-8 px-10 text-right">Moderation Protocol</th>
                </tr>
              </thead>
              <tbody className="text-near-black text-sm">
                {(activeTab === 'ads' ? ads : partners).map((item) => (
                  <tr key={item._id} className="border-b border-light-grey/5 hover:bg-warm-white/20 transition-colors group">
                    <td className="py-8 px-10 text-left">
                       {item.images && item.images[0] ? (
                          <img 
                            src={getImageUrl(item.images[0])} 
                            alt="" 
                            className="w-20 h-20 object-cover rounded-3xl shadow-xl border-4 border-white group-hover:rotate-2 transition-transform"
                          />
                       ) : (
                          <div className="w-20 h-20 bg-warm-white rounded-3xl border border-light-grey/10 flex items-center justify-center text-[10px] font-black text-primary-rose italic">N/A</div>
                       )}
                    </td>
                    <td className="py-8 px-10 text-left">
                      <Link 
                        to={`/${activeTab === 'ads' ? 'ad' : 'partner'}/${item._id}`} 
                        target="_blank" 
                        className="font-black text-near-black hover:text-primary-rose transition-colors block text-xl leading-tight mb-2 uppercase tracking-tighter"
                      >
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-2">
                         <p className="text-[10px] text-dark-grey/60 font-black tracking-[0.2em] uppercase">Authored by <span className="text-primary-rose">{item.user?.name || 'Unidentified'}</span></p>
                      </div>
                    </td>
                    <td className="py-8 px-10 text-center">
                       <span className={`py-2 px-6 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border-2 shadow-sm ${
                         item.status === 'approved' ? 'bg-deep-rose/10 text-near-black border-light-grey/20' : 
                         item.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 
                         'bg-warm-white text-dark-grey/60 border-light-grey/10 italic'
                       }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-8 px-10 text-right">
                       <div className="flex justify-end gap-3">
                          <Link 
                            to={`/${activeTab === 'ads' ? 'ad' : 'partner'}/${item._id}`}
                            target="_blank"
                            className="bg-white border-2 border-light-grey/10 text-dark-grey/70 px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:border-light-grey hover:text-near-black transition-all"
                          >
                            INSPECT
                          </Link>
                          {item.status !== 'approved' && (
                              <button 
                                onClick={() => activeTab === 'ads' ? handleAdStatus(item._id, 'approve') : handlePartnerStatus(item._id, 'approve')}
                                className="bg-deep-rose text-near-black px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-near-black hover:text-wedding-cream shadow-xl shadow-primary-rose/10 transition-all"
                              >
                                APPROVE
                              </button>
                          )}
                          {item.status !== 'rejected' && (
                              <button 
                                onClick={() => activeTab === 'ads' ? handleAdStatus(item._id, 'reject') : handlePartnerStatus(item._id, 'reject')}
                                className="bg-near-black text-wedding-cream px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-black shadow-xl shadow-near-black/10 transition-all"
                              >
                                REJECT
                              </button>
                          )}
                          <button 
                            onClick={() => activeTab === 'ads' ? handleAdDelete(item._id) : handlePartnerDelete(item._id)}
                            className="bg-white border-2 border-red-50 text-red-600 px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all ml-2"
                          >
                            PURGE
                          </button>
                       </div>
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

export default AdminPanel;
