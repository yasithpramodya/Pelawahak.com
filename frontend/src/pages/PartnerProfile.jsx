import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl, BASE_URL } from '../services/api';

export default function PartnerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get(`${BASE_URL}/api/partner/profile/${id}`, config);
      setProfileData(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        navigate('/login'); // Need to be logged in to view full
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendInterest = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/partner/interaction/send/${profileData.profile.user._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Interest sent successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending interest');
    }
  };

  const handleMockPayment = async (type) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/payments/create-checkout-session`, {
        type: type,
        profileId: id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Payment Mock Success! Profile will reload unlocked.');
      setShowPaymentModal(false);
      fetchProfile(); // reload to get unhidden contact
    } catch (err) {
      console.error("Payment error", err);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!profileData) return <div className="text-center mt-20">Profile Not Found</div>;

  const { profile, contactHidden } = profileData;

  return (
    <div className="bg-surface-gradient min-h-screen py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-primary-rose/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-logo-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto glass-card rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 animate-fadeIn border border-white/60">
        {/* Left Side: Photo */}
        <div className="md:w-[45%] bg-light-grey/20 relative group">
          {profile.photos && profile.photos[0] ? (
            <img src={getImageUrl(profile.photos[0])} className="w-full h-full object-cover min-h-[500px] transition-transform duration-[2s] ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-105" alt="Profile" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center min-h-[500px] bg-gradient-to-br from-warm-white to-light-grey/30 text-dark-grey/30">
              <svg className="w-16 h-16 mb-4 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              <span className="text-[10px] font-black uppercase tracking-widest">No Photo</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-near-black/60 to-transparent pointer-events-none"></div>
        </div>

        {/* Right Side: Details */}
        <div className="md:w-[55%] p-10 md:p-14 bg-white/50 backdrop-blur-sm flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
             <div>
               <h1 className="text-4xl md:text-5xl font-black font-serif text-near-black tracking-tight mb-2 uppercase">{profile.user.name}</h1>
               <p className="text-[10px] text-primary-rose font-black uppercase tracking-[0.2em]">{profile.age} Years Old <span className="mx-2">•</span> {profile.religion}</p>
             </div>
             <button onClick={handleSendInterest} className="bg-near-black hover:bg-black text-wedding-cream px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 hover:shadow-near-black/20 transition-all duration-300 flex items-center gap-3">
               <span className="text-primary-rose text-lg">♥</span> Send Interest
             </button>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="bg-warm-white/50 p-4 rounded-2xl border border-light-grey/30">
              <p className="text-[9px] font-black text-dark-grey/50 uppercase tracking-widest mb-1">Location</p>
              <p className="font-bold text-near-black text-sm">{profile.location}</p>
            </div>
            <div className="bg-warm-white/50 p-4 rounded-2xl border border-light-grey/30">
              <p className="text-[9px] font-black text-dark-grey/50 uppercase tracking-widest mb-1">Education</p>
              <p className="font-bold text-near-black text-sm">{profile.education}</p>
            </div>
            <div className="bg-warm-white/50 p-4 rounded-2xl border border-light-grey/30">
              <p className="text-[9px] font-black text-dark-grey/50 uppercase tracking-widest mb-1">Job</p>
              <p className="font-bold text-near-black text-sm">{profile.job}</p>
            </div>
            <div className="bg-warm-white/50 p-4 rounded-2xl border border-light-grey/30">
              <p className="text-[9px] font-black text-dark-grey/50 uppercase tracking-widest mb-1">Gender</p>
              <p className="font-bold text-near-black text-sm">{profile.gender}</p>
            </div>
          </div>

          <div className="mb-10 flex-1">
            <h3 className="text-[10px] font-black text-near-black uppercase tracking-[0.3em] flex items-center gap-3 mb-4">
              <span className="w-6 h-[1px] bg-primary-rose"></span>
              About Profile
            </h3>
            <p className="text-dark-grey/70 leading-relaxed text-sm font-medium italic bg-warm-white/30 p-6 rounded-2xl border border-light-grey/20">{profile.bio}</p>
          </div>

          <div className="bg-gradient-to-br from-blush to-warm-white p-8 rounded-[2rem] border border-primary-rose/10 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-rose/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="text-[10px] font-black text-deep-rose uppercase tracking-[0.3em] flex items-center gap-3 mb-6 relative z-10">
              <span className="text-lg">📞</span> Contact Information
            </h3>
            
            {contactHidden ? (
              <div className="text-center relative z-10">
                <div className="filter blur-md bg-white/50 text-dark-grey p-4 rounded-xl select-none font-black tracking-widest border border-white/60 mb-4">
                  +94 77 XXX XXXX
                </div>
                <p className="mb-6 text-[9px] font-black text-dark-grey/60 uppercase tracking-widest">🔒 Unlock to view contact details.</p>
                <button onClick={() => setShowPaymentModal(true)} className="bg-primary-rose hover:bg-deep-rose text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 hover:shadow-primary-rose/20 transition-all duration-300 w-full">
                  Unlock Now (Rs. 200)
                </button>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm border-2 border-green-500/20 p-6 rounded-2xl shadow-sm relative z-10">
                <p className="text-green-700 font-black text-xl flex items-center justify-center gap-3 tracking-widest">
                  <span>📱</span> {profile.user.phoneNumber || 'No phone number provided'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-near-black/80 backdrop-blur-md flex items-center justify-center z-[2000] p-4 transition-all duration-500">
          <div className="glass-light rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative animate-fadeInScale border border-white/60">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-light-grey/20 rounded-full text-dark-grey hover:bg-light-grey hover:text-near-black transition-colors">✖</button>
            <h2 className="text-2xl font-black text-center text-near-black mb-8 uppercase tracking-tighter">Choose <span className="text-primary-rose">Unlock</span> Plan</h2>
            
            <div className="space-y-4">
              <div className="bg-white/50 border-2 border-light-grey/40 hover:border-logo-gold/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg group" onClick={() => handleMockPayment('unlock')}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-sm text-near-black uppercase tracking-widest mb-1 group-hover:text-logo-gold transition-colors">One-Time Unlock</h3>
                    <p className="text-[10px] font-bold text-dark-grey/60 uppercase tracking-[0.1em]">Unlock this profile only.</p>
                  </div>
                  <span className="font-black text-logo-gold bg-logo-gold/10 px-4 py-2 rounded-xl text-sm border border-logo-gold/20">Rs. 200</span>
                </div>
              </div>

              <div className="bg-white border-2 border-primary-rose/30 hover:border-primary-rose rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl shadow-[0_8px_24px_rgba(184,92,110,0.1)] relative overflow-hidden group" onClick={() => handleMockPayment('subscription')}>
                <div className="absolute top-0 right-0 bg-primary-rose text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-bl-xl shadow-sm">BEST VALUE</div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-sm text-near-black uppercase tracking-widest mb-1 group-hover:text-primary-rose transition-colors">Premium Sub</h3>
                    <p className="text-[10px] font-bold text-dark-grey/60 uppercase tracking-[0.1em]">Unlimited for 30 days.</p>
                  </div>
                  <span className="font-black text-primary-rose bg-primary-rose/10 px-4 py-2 rounded-xl text-sm border border-primary-rose/20">Rs. 1000/mo</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-light-grey/40 text-center">
               <p className="text-[8px] font-black text-dark-grey/30 uppercase tracking-[0.2em]">Powered by PayHere & Stripe (Mock Mode)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
