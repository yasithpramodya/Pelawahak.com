import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostAd from './pages/PostAd';
import PostPartner from './pages/PostPartner';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Partner from './pages/Partner';
import PartnerDetails from './pages/PartnerDetails';
import AdDetails from './pages/AdDetails';
import Chat from './pages/Chat';
import Footer from './components/Footer';
import Pricing from './pages/Pricing';
import { useContext } from 'react';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-rose"></div>
        <p className="text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.4em]">Loading...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-rose"></div>
        <p className="text-[10px] font-black text-dark-grey/40 uppercase tracking-[0.4em]">Loading...</p>
      </div>
    </div>
  );
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-warm-white/30 text-near-black font-sans selection:bg-deep-rose/30">
          <Navbar />
          <main className="pt-16 md:pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="/ad/:id" element={<AdDetails />} />
              <Route path="/partner/:id" element={<PartnerDetails />} />
              <Route path="/pricing" element={<Pricing />} />

              <Route path="/post-ad" element={
                <PrivateRoute>
                  <PostAd />
                </PrivateRoute>
              } />
              <Route path="/post-partner" element={
                <PrivateRoute>
                  <PostPartner />
                </PrivateRoute>
              } />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />

              <Route path="/chat" element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              } />

              <Route path="/admin" element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
