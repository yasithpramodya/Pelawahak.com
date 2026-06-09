import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
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
    <div className="bg-surface-gradient min-h-screen py-20 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-primary-rose/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-logo-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fadeIn">
        <div className="glass-card rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
          
          {/* Images Section */}
          <div className="md:w-1/2 h-[400px] md:h-auto bg-light-grey/20 relative group overflow-hidden">
             {listing.images && listing.images.length > 0 ? (
                <img src={getImageUrl(listing.images[0])} alt={listing.title} className="w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-warm-white to-light-grey/30 text-dark-grey/30">
                  <svg className="w-16 h-16 mb-4 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
                </div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-near-black/60 via-transparent to-transparent opacity-60"></div>
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-8 lg:p-16 flex flex-col bg-white/50 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-rose bg-primary-rose/10 px-4 py-2 rounded-full border border-primary-rose/20">
                {listing.category}
              </span>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-light-grey/40">
                <Star className="w-4 h-4 text-logo-gold mr-2 fill-logo-gold" />
                <span className="font-black text-sm text-near-black mr-1">{listing.ratings > 0 ? listing.ratings.toFixed(1) : 'New'}</span>
                <span className="text-[10px] font-bold text-dark-grey/50 uppercase tracking-widest">({listing.numReviews} Reviews)</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black font-serif text-near-black tracking-tight mb-4 uppercase">{listing.title}</h1>
            
            <div className="flex items-center text-dark-grey/60 mb-8 font-black text-[10px] uppercase tracking-widest">
              <MapPin className="w-4 h-4 mr-2 text-primary-rose/70" />
              {listing.location}
            </div>

            <div className="mb-10 flex-1">
              <p className="text-dark-grey/70 leading-relaxed text-sm font-medium italic bg-warm-white/50 p-6 rounded-2xl border border-light-grey/20">{listing.description}</p>
            </div>

            <div className="border-t border-b border-light-grey/40 py-8 mb-10 flex justify-between items-center bg-gradient-to-r from-warm-white/40 to-transparent -mx-8 px-8 lg:-mx-16 lg:px-16">
              <div>
                <p className="text-[9px] text-dark-grey/50 uppercase tracking-[0.2em] font-black mb-1">Starting Price</p>
                <p className="text-3xl font-black text-near-black">Rs {listing.price.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-dark-grey/50 uppercase tracking-[0.2em] font-black mb-1">Vendor</p>
                <p className="font-black text-near-black text-lg uppercase tracking-tight">{listing.vendor.name}</p>
              </div>
            </div>

            {/* Booking Form */}
            {user?.role !== 'Vendor' && user?.role !== 'Admin' && (
               <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-light-grey/30 relative overflow-hidden group">
                 <div className="absolute -right-10 -top-10 w-32 h-32 bg-logo-gold/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                 <h3 className="text-[10px] font-black text-near-black uppercase tracking-[0.3em] mb-6 flex items-center relative z-10">
                   <Calendar className="w-5 h-5 mr-3 text-logo-gold" /> Request Booking
                 </h3>
                 
                 {bookingStatus === 'success' ? (
                   <div className="bg-green-50 text-green-700 border border-green-200 p-6 rounded-2xl flex items-center relative z-10">
                     <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                     <p className="text-sm font-bold">Booking request sent! The vendor will contact you soon.</p>
                   </div>
                 ) : (
                   <form onSubmit={handleBooking} className="space-y-6 relative z-10">
                     <div>
                       <label className="block text-[9px] font-black text-dark-grey/60 uppercase tracking-widest mb-2">Event Date</label>
                       <input 
                         type="date" 
                         required
                         value={bookingDate}
                         onChange={(e) => setBookingDate(e.target.value)}
                         className="w-full px-5 py-4 border border-light-grey/40 rounded-2xl focus:ring-2 focus:ring-logo-gold/30 focus:border-logo-gold bg-warm-white/50 text-near-black font-bold text-sm transition-all outline-none"
                       />
                     </div>
                     <div>
                       <label className="block text-[9px] font-black text-dark-grey/60 uppercase tracking-widest mb-2">Additional Notes</label>
                       <textarea 
                         rows="3"
                         value={notes}
                         onChange={(e) => setNotes(e.target.value)}
                         className="w-full px-5 py-4 border border-light-grey/40 rounded-2xl focus:ring-2 focus:ring-logo-gold/30 focus:border-logo-gold bg-warm-white/50 text-near-black font-bold text-sm transition-all outline-none resize-none"
                         placeholder="Any specific requests?"
                       />
                     </div>
                     <button 
                       type="submit" 
                       disabled={bookingStatus === 'submitting'}
                       className="w-full bg-near-black hover:bg-black text-wedding-cream font-black py-4 px-6 rounded-2xl shadow-xl hover:-translate-y-1 hover:shadow-near-black/20 transition-all duration-300 disabled:opacity-50 flex justify-center items-center text-[10px] uppercase tracking-widest"
                     >
                       {bookingStatus === 'submitting' ? 'Sending Request...' : 'Send Request'}
                     </button>
                   </form>
                 )}
               </div>
            )}
            {!user && (
              <div className="bg-warm-white/50 p-8 rounded-[2rem] border border-light-grey/40 text-center">
                <p className="text-[10px] font-black text-dark-grey/60 uppercase tracking-widest mb-4">Sign in to book this vendor.</p>
                <Link to="/login" className="inline-block bg-white border border-light-grey/40 text-near-black px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-near-black transition-colors shadow-sm">
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
