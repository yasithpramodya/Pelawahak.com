import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../api/axios';
import { MapPin, Star, Filter } from 'lucide-react';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || '';
  const locationParam = searchParams.get('location') || '';

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/listings?keyword=${keywordParam}&category=${categoryParam}&location=${locationParam}`);
      setListings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [keywordParam, categoryParam, locationParam]);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {categoryParam ? `${categoryParam} Vendors` : 'All Vendors'}
            </h1>
            <p className="mt-2 text-gray-600">
              {listings.length} results found
            </p>
          </div>
          <button className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <Link to={`/listings/${listing._id}`} key={listing._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <img src={`http://localhost:5000${listing.images[0]}`} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">{listing.category}</span>
                    <div className="flex items-center text-sm font-medium text-gray-700">
                      <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                      {listing.ratings > 0 ? listing.ratings.toFixed(1) : 'New'} ({listing.numReviews})
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{listing.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Rs {listing.price.toLocaleString()}</span>
                    <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Book Now</span>
                  </div>
                </div>
              </Link>
            ))}
            {listings.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <h3 className="text-xl font-medium text-gray-900">No vendors found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;
