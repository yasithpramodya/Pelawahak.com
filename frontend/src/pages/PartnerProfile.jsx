import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      const res = await axios.get(`http://localhost:5000/api/partner/profile/${id}`, config);
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
      await axios.post(`http://localhost:5000/api/partner/interaction/send/${profileData.profile.user._id}`, {}, {
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
      await axios.post('http://localhost:5000/api/payments/create-checkout-session', {
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
    <div className="bg-orange-50 min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Photo */}
        <div className="md:w-1/3 bg-gray-200">
          {profile.photos && profile.photos[0] ? (
            <img src={`http://localhost:5000${profile.photos[0]}`} className="w-full h-full object-cover min-h-[400px]" alt="Profile" />
          ) : (
            <div className="w-full h-full flex items-center justify-center min-h-[400px] bg-pink-100 text-pink-400">No Photo</div>
          )}
        </div>

        {/* Right Side: Details */}
        <div className="md:w-2/3 p-8">
          <div className="flex justify-between items-start">
             <div>
               <h1 className="text-4xl font-bold font-serif text-gray-900">{profile.user.name}</h1>
               <p className="text-lg text-pink-600 font-medium">{profile.age} years old • {profile.religion}</p>
             </div>
             <button onClick={handleSendInterest} className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-bold shadow-md transition-transform transform hover:scale-105">
               ❤️ Send Interest
             </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold text-gray-800">{profile.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Education</p>
              <p className="font-semibold text-gray-800">{profile.education}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Job</p>
              <p className="font-semibold text-gray-800">{profile.job}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-semibold text-gray-800">{profile.gender}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2 border-b pb-2">About</h3>
            <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
          </div>

          <div className="mt-8 bg-amber-50 p-6 rounded-2xl border border-amber-100">
            <h3 className="text-xl font-bold text-amber-800 flex items-center gap-2 mb-4">
              📞 Contact Information
            </h3>
            
            {contactHidden ? (
              <div className="text-center">
                <div className="filter blur-sm bg-gray-200 text-gray-400 p-3 rounded-lg select-none">
                  +94 77 XXX XXXX
                </div>
                <p className="my-3 text-sm font-semibold text-gray-700">🔒 Unlock to view contact details.</p>
                <button onClick={() => setShowPaymentModal(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors w-full">
                  Unlock Now (Rs. 200)
                </button>
              </div>
            ) : (
              <div className="bg-white border-2 border-green-200 p-4 rounded-lg">
                <p className="text-green-700 font-bold text-lg flex items-center justify-center gap-2">
                  <span>📱</span> {profile.user.phoneNumber || 'No phone number provided'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">✖</button>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 font-serif border-b pb-4">Choose Unlock Plan</h2>
            
            <div className="space-y-4">
              <div className="border-2 border-amber-200 rounded-xl p-4 hover:bg-amber-50 cursor-pointer transition-colors" onClick={() => handleMockPayment('unlock')}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg text-amber-900">One-Time Unlock</h3>
                    <p className="text-sm text-amber-700">Unlock this profile only.</p>
                  </div>
                  <span className="font-bold border bg-white px-3 py-1 rounded text-amber-600">Rs. 200</span>
                </div>
              </div>

              <div className="border-2 border-pink-200 rounded-xl p-4 hover:bg-pink-50 cursor-pointer transition-colors relative overflow-hidden" onClick={() => handleMockPayment('subscription')}>
                <div className="absolute top-0 right-0 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">BEST VALUE</div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg text-pink-900">Premium Subscription</h3>
                    <p className="text-sm text-pink-700">Unlimited unlocks for 30 days.</p>
                  </div>
                  <span className="font-bold border bg-white px-3 py-1 rounded text-pink-600">Rs. 1000/mo</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-400">
               <p>Powered by PayHere & Stripe (Mock Mode)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
