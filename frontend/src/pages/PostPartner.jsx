import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { locations } from '../data/locations';

const PostPartner = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    gender: 'Female',
    age: '',
    religion: 'Buddhist',
    profession: '',
    district: 'Colombo',
    city: 'Colombo 1',
    height: '',
    education: '',
    description: '',
    phone: ''
  });

  const [images, setImages] = useState([null, null, null]);
  const [previews, setPreviews] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const religions = ['Buddhist', 'Hindu', 'Christian', 'Catholic', 'Muslim', 'Other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'district') {
      setFormData({
        ...formData,
        district: value,
        city: locations[value][0]
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);

      const newPreviews = [...previews];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    images.forEach(img => {
      if (img) data.append('images', img);
    });

    try {
      await api.post('/partners', data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Post Partner Error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Error creating profile';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 md:py-16 animate-fadeIn">
      <div className="mb-10 md:mb-14">
        <h2 className="text-3xl md:text-5xl font-black text-near-black uppercase tracking-tighter leading-none mb-4">Partner <span className="text-primary-rose">Registry</span></h2>
        <p className="text-dark-grey/70 font-black uppercase tracking-widest text-[9px] md:text-[10px] italic">Establish a sophisticated profile for matrimonial matching</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-6 rounded-[2rem] mb-10 font-black uppercase tracking-widest text-[10px] border border-red-100 shadow-xl text-center animate-shake">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 lg:p-14 rounded-[2rem] md:rounded-[4rem] shadow-2xl border border-light-grey/10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <span className="text-7xl md:text-9xl font-black text-primary-rose rotate-12 inline-block">💍</span>
        </div>

        <div className="space-y-8 md:space-y-10 relative z-10">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.3em] ml-2">Profile Narrative (Title)</label>
            <input 
              type="text" 
              name="title" 
              placeholder="e.g. Seeking an educated and kind-hearted soul"
              className="w-full bg-warm-white/50 border-none rounded-2xl p-6 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all"
              onChange={handleInputChange}
              required 
            />
          </div>


          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.3em] ml-2">Gender Identity</label>
              <select name="gender" className="w-full bg-warm-white/50 border-none rounded-2xl p-6 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all" onChange={handleInputChange}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.3em] ml-2">Current Age</label>
              <input 
                type="number" 
                name="age" 
                placeholder="Years"
                className="w-full bg-warm-white/50 border-none rounded-2xl p-6 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all"
                onChange={handleInputChange}
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-4">
                <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.3em] ml-2">Religious Focus</label>
                <select name="religion" className="w-full bg-warm-white/50 border-none rounded-2xl p-6 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all" onChange={handleInputChange}>
                  {religions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.3em] ml-2">Height Meta</label>
                <input 
                  type="text" 
                  name="height" 
                  placeholder="e.g. 5 feet 8 inches"
                  className="w-full bg-warm-white/50 border-none rounded-2xl p-6 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all"
                  onChange={handleInputChange}
                />
              </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.3em] ml-2">Primary District</label>
              <select name="district" className="w-full bg-warm-white/50 border-none rounded-2xl p-6 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all" onChange={handleInputChange}>
                {Object.keys(locations).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.3em] ml-2">Home City</label>
              <select name="city" className="w-full bg-warm-white/50 border-none rounded-2xl p-6 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all" onChange={handleInputChange}>
                {locations[formData.district].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-10 relative z-10">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.3em] ml-2">Professional Status</label>
            <input 
              type="text" 
              name="profession" 
              placeholder="e.g. Software Engineer, Doctor, etc."
              className="w-full bg-warm-white/50 border-none rounded-2xl p-6 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all"
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.3em] ml-2">Educational Pedigree</label>
            <input 
              type="text" 
              name="education" 
              placeholder="e.g. MBA - University of Colombo"
              className="w-full bg-warm-white/50 border-none rounded-2xl p-6 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all"
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.3em] ml-2">Registry Contact</label>
            <input 
              type="text" 
              name="phone" 
              placeholder="07X XXX XXXX"
              className="w-full bg-warm-white/50 border-none rounded-2xl p-6 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all"
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.3em] ml-2">Personal Manifesto (About)</label>
            <textarea 
              name="description" 
              placeholder="Share details about family background, values and expectations..."
              rows="4" 
              className="w-full bg-warm-white/50 border-none rounded-[2rem] p-6 text-sm font-bold text-near-black focus:ring-2 focus:ring-primary-rose transition-all"
              onChange={handleInputChange}
              required 
            ></textarea>
          </div>
        </div>

        <div className="lg:col-span-2 border-t border-light-grey/10 pt-16">
          <div className="mb-10 text-center">
            <h3 className="text-[11px] font-black text-near-black uppercase tracking-[0.5em] mb-2">Visual Verification</h3>
            <p className="text-[9px] font-black text-dark-grey/60 uppercase tracking-widest italic leading-relaxed">Elegant imagery increases matching probability by up to 300%.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[0, 1, 2].map(i => (
              <div key={i} className="relative aspect-[4/5] bg-warm-white rounded-[2.5rem] border-2 border-dashed border-light-grey/20 overflow-hidden group hover:border-light-grey hover:bg-white transition-all shadow-sm">
                {previews[i] ? (
                  <>
                    <img src={previews[i]} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-near-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                          type="button" 
                          onClick={() => {
                             const newImgs = [...images]; newImgs[i] = null; setImages(newImgs);
                             const newPrevs = [...previews]; newPrevs[i] = null; setPreviews(newPrevs);
                          }}
                          className="bg-red-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 shadow-xl"
                       >
                         Discard
                       </button>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-rose/40">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-3xl mb-3 shadow-sm">+</div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{i === 0 ? 'Spotlight Slot' : `Auxiliary Slot ${i + 1}`}</span>
                  </div>
                )}
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => handleFileChange(i, e)}
                  accept="image/*"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 pt-10 flex flex-col items-center">
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full max-w-xl bg-primary-rose text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-primary-rose/30 uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-4 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-deep-rose hover:scale-[1.02] active:scale-95'}`}
          >
            {loading ? (
              <>
                 <div className="animate-spin h-4 w-4 border-2 border-light-grey border-t-transparent rounded-full"></div>
                 Recording Registry...
              </>
            ) : (
              <>Establish Membership <span>✦</span></>
            )}
          </button>
          <p className="mt-8 text-[9px] font-black text-dark-grey/60 uppercase tracking-widest text-center max-w-md leading-loose">By establishing this profile, you affirm the veracity of all metadata provided according to our professional standards.</p>
        </div>
      </form>
    </div>
  );
};

export default PostPartner;
