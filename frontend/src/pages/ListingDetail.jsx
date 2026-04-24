import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { MapPin, Star, Calendar, MessageSquare, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await api.get(`/listings/${id}`);
        setListing(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      return navigate('/login');
    }
    try {
      setBookingStatus('submitting');
      await api.post('/bookings', { listing: id, eventDate: bookingDate, notes });
      setBookingStatus('success');
    } catch (error) {
      console.error(error);
      setBookingStatus('error');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!listing) return <div className="min-h-screen flex items-center justify-center">Listing not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row">
          
          {/* Images Section */}
          <div className="md:w-1/2 h-[400px] md:h-auto bg-gray-100">
             {listing.images && listing.images.length > 0 ? (
                <img src={`http://localhost:5000${listing.images[0]}`} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
             )}
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-8 lg:p-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                {listing.category}
              </span>
              <div className="flex items-center text-gray-700">
                <Star className="w-5 h-5 text-yellow-400 mr-1 fill-current" />
                <span className="font-bold">{listing.ratings > 0 ? listing.ratings.toFixed(1) : 'New'}</span>
                <span className="text-gray-500 ml-1">({listing.numReviews} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{listing.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-6 font-medium">
              <MapPin className="w-5 h-5 mr-2 text-gray-400" />
              {listing.location}
            </div>

            <div className="mb-8">
              <p className="text-gray-600 leading-relaxed text-lg">{listing.description}</p>
            </div>

            <div className="border-t border-b border-gray-100 py-6 mb-8 flex justify-between items-center bg-gray-50 -mx-8 px-8 lg:-mx-12 lg:px-12">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Starting Price</p>
                <p className="text-3xl font-bold text-gray-900">Rs {listing.price.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">Vendor</p>
                <p className="font-semibold text-gray-900">{listing.vendor.name}</p>
              </div>
            </div>

            {/* Booking Form */}
            {user?.role !== 'Vendor' && user?.role !== 'Admin' && (
               <div className="bg-white">
                 <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                   <Calendar className="w-5 h-5 mr-2 text-primary" /> Request a Booking
                 </h3>
                 
                 {bookingStatus === 'success' ? (
                   <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-xl flex items-center">
                     <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                     <p>Booking request sent successfully! The vendor will contact you soon.</p>
                   </div>
                 ) : (
                   <form onSubmit={handleBooking} className="space-y-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                       <input 
                         type="date" 
                         required
                         value={bookingDate}
                         onChange={(e) => setBookingDate(e.target.value)}
                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                       <textarea 
                         rows="3"
                         value={notes}
                         onChange={(e) => setNotes(e.target.value)}
                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary resize-none"
                         placeholder="Any specific requests?"
                       />
                     </div>
                     <button 
                       type="submit" 
                       disabled={bookingStatus === 'submitting'}
                       className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all disabled:opacity-50 flex justify-center items-center"
                     >
                       {bookingStatus === 'submitting' ? 'Sending Request...' : 'Send Request'}
                     </button>
                   </form>
                 )}
               </div>
            )}
            {!user && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                <p className="text-gray-600 mb-3">Sign in to book this vendor.</p>
                <Link to="/login" className="inline-block bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50">
                  Login to Book
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
