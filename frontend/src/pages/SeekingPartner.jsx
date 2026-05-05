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
    <div className="bg-orange-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-pink-700 mb-8 font-serif">Find Your Perfect Match</h1>
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-10 border border-amber-100">
          <form className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end" onSubmit={handleSearch}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Age</label>
              <input type="number" className="mt-1 p-2 w-full border rounded-md" value={minAge} onChange={e => setMinAge(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Age</label>
              <input type="number" className="mt-1 p-2 w-full border rounded-md" value={maxAge} onChange={e => setMaxAge(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Religion</label>
              <select className="mt-1 p-2 w-full border rounded-md" value={religion} onChange={e => setReligion(e.target.value)}>
                <option value="">Any</option>
                <option value="Buddhist">Buddhist</option>
                <option value="Christian">Christian</option>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" placeholder="Colombo..." className="mt-1 p-2 w-full border rounded-md" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div>
              <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-md font-semibold transition-colors duration-200 shadow-md">
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Profiles */}
        {loading ? (
          <p className="text-center text-gray-500">Loading profiles...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {profiles.map(profile => (
              <div key={profile._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                  {profile.photos && profile.photos.length > 0 ? (
                    <img src={getImageUrl(profile.photos[0])} alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-pink-100 text-pink-300">
                      <span>No Photo</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-xl font-bold text-white">{profile.user ? profile.user.name : 'Unknown User'}</h3>
                    <p className="text-pink-200">{profile.age} yrs • {profile.location}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-2 font-medium">{profile.job}</p>
                  <p className="text-sm text-gray-500 mb-4 h-10 overflow-hidden line-clamp-2">{profile.bio}</p>
                  <Link to={`/partner/${profile._id}`} className="block text-center w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-medium transition-colors">
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
            {profiles.length === 0 && <p className="col-span-full text-center text-gray-500 py-10">No matching profiles found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
