import React, { useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { locations } from '../data/locations';
import { uploadImage } from '../api/uploadApi';
import AdPaymentGate from '../components/AdPaymentGate';

const PostAd = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Photography',
    district: 'Colombo',
    city: 'Colombo 1',
    otherCity: '',
    price: '',
    phone: ''
  });
  const [isOtherCity, setIsOtherCity] = useState(false);
  const [images, setImages] = useState([null, null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null, null]);
  const [imageUrls, setImageUrls] = useState([null, null, null, null, null]); 
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'district') {
      setIsOtherCity(false);
      setFormData({
        ...formData,
        district: value,
        city: locations[value][0],
        otherCity: ''
      });
    } else if (name === 'city') {
      if (value === 'Other') {
        setIsOtherCity(true);
        setFormData({ ...formData, city: 'Other' });
      } else {
        setIsOtherCity(false);
        setFormData({ ...formData, city: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

 const handleFileChange = async (index, e) => {
  const file = e.target.files[0];
  if (!file) return;

  // File size check
  if (file.size > 5 * 1024 * 1024) {
    setError('Image size must be less than 5MB');
    return;
  }

  // Preview දෙන්න
  const newPreviews = [...imagePreviews];
  newPreviews[index] = URL.createObjectURL(file);
  setImagePreviews(newPreviews);

  // Cloudinary වලට upload කරන්න
  try {
    setUploadingIndex(index);
    setError('');

    const data = await uploadImage(file);

    // URL save කරන්න
    const newUrls = [...imageUrls];
    newUrls[index] = data.url;
    setImageUrls(newUrls);

    setUploadingIndex(null);
  } catch (err) {
    setError('Image upload failed. Please try again.');
    setUploadingIndex(null);

    // Preview remove කරන්න
    const newPreviews = [...imagePreviews];
    newPreviews[index] = null;
    setImagePreviews(newPreviews);
  }
};

  const handleRemoveImage = (index) => {
  const newImages = [...images];
  newImages[index] = null;
  setImages(newImages);

  const newPreviews = [...imagePreviews];
  newPreviews[index] = null;
  setImagePreviews(newPreviews);

  // Cloudinary URL ද remove කරන්න
  const newUrls = [...imageUrls];
  newUrls[index] = null;
  setImageUrls(newUrls);
};

  const isPremium = user?.subscriptionPlan === 'premium';
  const hasFreeAds = user?.freeAdsRemaining > 0;
  const hasPaidAds = user?.paidAdsRemaining > 0;
  const isAdmin = user?.role === 'admin';
  const canPost = isAdmin || isPremium || hasFreeAds || hasPaidAds;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canPost) {
      setError('You have reached your ad limit. Please purchase an ad slot or upgrade.');
      return;
    }

  // අවම වශයෙන් image එකක් upload වෙලාද check කරන්න
  const validUrls = imageUrls.filter(url => url !== null);
  if (validUrls.length === 0) {
    setError('Please upload at least one image.');
    return;
  }

  // Upload pending images තිබේදැයි check
  if (uploadingIndex !== null) {
    setError('Please wait for image upload to complete.');
    return;
  }

  const data = new FormData();
  data.append('title', formData.title);
  data.append('description', formData.description);
  data.append('category', formData.category);
  data.append('district', formData.district);

  const finalCity = isOtherCity ? formData.otherCity : formData.city;
  data.append('city', finalCity);
  data.append('price', formData.price);
  data.append('phone', formData.phone);

  // Files වෙනුවට Cloudinary URLs දාන්න
  validUrls.forEach(url => {
    data.append('imageUrls', url);
  });

    try {
      const res = await api.post('/ads', data);

      // We should ideally fetch the fresh user from backend here, but for now we manually
      // adjust local state. If they used a free ad, decrement it. If paid, decrement paid.
      let updatedUser = { ...user };
      if (!isAdmin && !isPremium) {
        if (hasFreeAds) {
          updatedUser.freeAdsRemaining -= 1;
        } else if (hasPaidAds) {
          updatedUser.paidAdsRemaining -= 1;
        }
      }
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // You'd also call setUser(updatedUser) here ideally, but navigate handles unmount.

    setSuccess('Ad posted successfully! It is pending approval from an admin.');
    setTimeout(() => navigate('/dashboard'), 2000);

  } catch (err) {
    console.error('Post Ad Error:', err);
    const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Error posting ad';
    setError(msg);
  }
};

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 md:py-16 animate-fadeIn">
      <title>Publish Wedding Service Ad | Pelawahak.com</title>
      <meta name="robots" content="noindex, nofollow" />
      <div className="mb-10 md:mb-14">
        <h2 className="text-3xl md:text-5xl font-black text-near-black uppercase tracking-tighter leading-none mb-4">Ad <span className="text-primary-rose">Registry</span></h2>
        <p className="text-dark-grey/70 font-black uppercase tracking-widest text-[10px] italic">Showcase your professional wedding services</p>
      </div>


      {user.role === 'user' && (
        <div className="bg-warm-white border border-light-grey/20 text-near-black p-6 rounded-[2rem] mb-10 flex items-center justify-between shadow-sm flex-wrap gap-4">
          <div className="flex items-center gap-4">
             <span className="text-2xl">✨</span>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Membership: {user.subscriptionPlan || 'Free'}</p>
                <p className="font-black text-xs uppercase tracking-tight">
                  {isPremium ? 'Unlimited Posts' : (
                    <>You have <span className="text-primary-rose text-lg">{user.freeAdsRemaining || 0}</span> free ad(s) and <span className="text-primary-rose text-lg">{user.paidAdsRemaining || 0}</span> paid ad(s) remaining.</>
                  )}
                </p>
             </div>
          </div>
          {!canPost && (
            <a href="#payment-gate" className="bg-primary-rose text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
              Get More Ads
            </a>
          )}
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-[2rem] mb-10 text-xs font-black uppercase tracking-widest text-center shadow-lg shadow-red-100/50">❌ {error}</div>}
      {success && <div className="bg-deep-rose/10 border border-light-grey/20 text-near-black p-6 rounded-[2rem] mb-10 text-xs font-black uppercase tracking-widest text-center shadow-lg shadow-primary-rose/20">✅ {success}</div>}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 lg:p-14 rounded-[2rem] md:rounded-[4rem] shadow-2xl border border-light-grey/10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <span className="text-7xl md:text-9xl font-black text-primary-rose rotate-12 inline-block">💍</span>
        </div>

        <div className="space-y-8 md:space-y-10 relative z-10">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-dark-grey/60 uppercase tracking-[0.3em] ml-2">Profile Narrative (Title)</label>

                <input 
                  type="text" 
                  name="title"
                  placeholder="e.g. Premium Cinematic Wedding Photography"
                  className="w-full bg-warm-white/50 border-none rounded-2xl p-5 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all" 
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.2em] ml-2">Detailed Narrative (Description)</label>
                <textarea 
                  name="description"
                  placeholder="Describe your services, equipment, experience and packages..."
                  className="w-full bg-warm-white/50 border-none rounded-3xl p-6 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all" 
                  rows="6"
                  onChange={handleInputChange}
                  required 
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.2em] ml-2">Industry Category</label>
                  <select name="category" className="w-full bg-warm-white/50 border-none rounded-2xl p-5 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all" onChange={handleInputChange}>
                    <option value="Photography">Photography</option>
                    <option value="Catering">Catering</option>
                    <option value="Decoration">Decoration</option>
                    <option value="Bridal Dressing">Bridal Dressing</option>
                    <option value="Salons">Salons</option>
                    <option value="Music and DJ">Music and DJ</option>
                    <option value="Rent a Car">Rent a Car</option>
                    <option value="Banquet Halls">Banquet Halls</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Wedding Clothing">Wedding Clothing</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Ashtaka">Ashtaka</option>
                    <option value="Wedding Cake">Wedding Cake</option>
                    <option value="Wedding Planning">Wedding Planning</option>
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.2em] ml-2">Operating District</label>
                  <select 
                    name="district" 
                    value={formData.district}
                    className="w-full bg-warm-white/50 border-none rounded-2xl p-5 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all" 
                    onChange={handleInputChange}
                  >
                    {Object.keys(locations).map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.2em] ml-2">Base Location (City)</label>
                    <select 
                      name="city" 
                      value={formData.city}
                      className="w-full bg-warm-white/50 border-none rounded-2xl p-5 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all" 
                      onChange={handleInputChange}
                    >
                      {locations[formData.district].map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                      <option value="Other">Other (Custom City)</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.2em] ml-2">Investment Range (Rs.)</label>
                    <input 
                      type="number" 
                      name="price"
                      min="0"
                      placeholder="Start price e.g. 50000"
                      className="w-full bg-warm-white/50 border-none rounded-2xl p-5 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all" 
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
              </div>
              
              {isOtherCity && (
                <div className="space-y-4 animate-fadeIn">
                  <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.2em] ml-2">Specify Custom City</label>
                  <input 
                    type="text" 
                    name="otherCity"
                    placeholder="Type your city name here"
                    className="w-full bg-deep-rose/10 border-2 border-light-grey/20 rounded-2xl p-5 text-sm font-black text-near-black uppercase tracking-tight focus:ring-2 focus:ring-primary-rose transition-all"
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              )}

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.2em] ml-2">Verified Contact Number</label>
                <div className="relative">
                   <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-rose text-lg">☎</span>
                   <input 
                    type="text" 
                    name="phone"
                    placeholder="071 234 5678"
                    className="w-full bg-warm-white/50 border-none rounded-2xl p-5 pl-14 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all" 
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
           </div>

           {/* Right Column: Image Boxes */}
           <div className="w-full lg:w-96">
              <div className="mb-8">
                <h3 className="text-[11px] font-black text-near-black uppercase tracking-[0.4em] mb-2">Visual Portfolio</h3>
                <p className="text-[10px] font-black text-dark-grey/60 uppercase tracking-widest italic leading-tight">Minimum 1 required. First slot is the spotlight image.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 {[0, 1, 2, 3, 4].map((index) => (
                    <div 
                      key={index} 
                      className={`relative border-2 border-dashed border-light-grey/20 rounded-3xl flex flex-col items-center justify-center bg-warm-white hover:bg-white hover:border-light-grey transition-all overflow-hidden group shadow-sm ${index === 0 ? 'col-span-2 h-56' : 'h-32'}`}
                    >
                       {uploadingIndex === index ? (
  // Uploading animation
  <div className="flex flex-col items-center gap-2">
    <div className="w-8 h-8 border-4 border-primary-rose border-t-transparent rounded-full animate-spin"></div>
    <span className="text-[9px] font-black text-primary-rose uppercase tracking-widest">Uploading...</span>
  </div>
) : imagePreviews[index] ? (
  <>
    <img src={imagePreviews[index]} alt={`Preview ${index}`} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-near-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        type="button"
        onClick={() => handleRemoveImage(index)}
        className="bg-red-500 text-white rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 shadow-xl"
      >
        Discard
      </button>
    </div>
  </>
) : (
  <>
    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary-rose text-2xl mb-2 shadow-sm">+</div>
    <span className="text-[9px] font-black text-dark-grey/40 uppercase tracking-[0.2em]">{index === 0 ? 'Primary Slot' : `Extra Slot ${index + 1}`}</span>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleFileChange(index, e)}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
  </>
)}
                    </div>
                 ))}
              </div>
              <div className="mt-8 p-6 bg-deep-rose/5 rounded-3xl border border-light-grey/10">
                 <p className="text-[9px] font-black text-primary-rose uppercase tracking-[0.2em] mb-2 leading-none italic">Professional Recommendation</p>
                 <p className="text-[10px] text-dark-grey/70 leading-relaxed font-bold uppercase tracking-tight">Profiles with high-resolution imagery receive 4x more inquiries.</p>
              </div>
           </div>

        <div className="mt-16 pt-10 border-t border-light-grey/10 flex flex-col items-center justify-center gap-8">
          
          {!canPost ? (
            <div id="payment-gate" className="w-full animate-fadeIn">
              <AdPaymentGate onSuccess={() => setError('')} />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full">
              <div className="flex items-center gap-4 text-dark-grey/60">
                <span className="text-2xl">💍</span>
                <p className="text-[10px] font-black uppercase tracking-widest max-w-[200px] leading-tight">By publishing, you agree to comply with our professional quality guidelines.</p>
              </div>
              <button 
                type="submit" 
                className="w-full md:w-auto bg-primary-rose text-white hover:bg-deep-rose transition-all font-black py-5 px-16 rounded-2xl shadow-2xl shadow-primary-rose/30 text-xs uppercase tracking-[0.3em] active:scale-95 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={!canPost}
              >
                Publish Listing
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostAd;
