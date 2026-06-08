import React, { useState, useContext } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdPaymentGate = ({ onSuccess }) => {
  const { updateUserState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  const handleBuyAdOrder = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/payments/buy-ad-slot');
      setLoading(false);
      return res.data.orderID;
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || 'Failed to initialize payment.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const handleBuyAdApprove = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/payments/capture-ad-slot', { orderID: data.orderID });
      setLoading(false);
      if (res.data.success) {
        updateUserState(res.data.user);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to verify payment.');
    }
  };

  return (
    <div className="w-full bg-warm-white/40 p-8 rounded-[2rem] border border-light-grey/10 shadow-inner flex flex-col items-center">
      <div className="text-center mb-8">
        <span className="text-4xl mb-4 block">📢</span>
        <h4 className="font-black text-near-black uppercase text-xl tracking-widest mb-2">Ad Limit Reached</h4>
        <p className="text-dark-grey/60 font-semibold text-sm leading-normal max-w-md mx-auto">
          You've used all your free ads. You can purchase a single ad slot to post right now, or upgrade your plan to unlock more features and a monthly ad quota.
        </p>
      </div>

      {error && (
        <div className="w-full mb-6 bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl text-center text-xs font-black uppercase tracking-wider">
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div className="w-full py-4 text-center text-xs font-black uppercase tracking-widest text-dark-grey/40 animate-pulse mb-4">
          Processing Payment...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Single Ad Slot */}
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-light-grey/10 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
          <h3 className="font-black text-near-black uppercase tracking-widest text-lg mb-2">Single Ad Slot</h3>
          <p className="text-primary-rose font-black text-3xl mb-4">$1.20</p>
          <p className="text-dark-grey/50 text-xs font-bold uppercase tracking-wide mb-8">Post one additional ad immediately.</p>
          
          <div className="w-full mt-auto">
            {paypalClientId && paypalClientId !== 'YOUR_PAYPAL_SANDBOX_CLIENT_ID' ? (
              <PayPalScriptProvider options={{ "client-id": paypalClientId, currency: "USD", intent: "capture" }}>
                <PayPalButtons
                  style={{ layout: "vertical", height: 48, shape: "rect", color: "gold" }}
                  createOrder={handleBuyAdOrder}
                  onApprove={handleBuyAdApprove}
                  onError={(err) => {
                    console.error("PayPal Error", err);
                    setError("PayPal checkout failed. Please try again.");
                  }}
                />
              </PayPalScriptProvider>
            ) : (
              <p className="text-rose-500 text-xs font-black uppercase tracking-widest">PayPal not configured</p>
            )}
          </div>
        </div>

        {/* Upgrade Plan */}
        <div className="bg-earth-gradient p-8 rounded-[2rem] shadow-xl text-wedding-cream flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-500">
             <span className="text-6xl font-black text-primary-rose">⭐</span>
          </div>
          <h3 className="font-black uppercase tracking-widest text-lg mb-2 relative z-10">Monthly Plans</h3>
          <p className="text-white font-black text-3xl mb-4 relative z-10">From $2.99</p>
          <p className="text-wedding-cream/70 text-xs font-bold uppercase tracking-wide mb-8 relative z-10">Get a monthly quota of ads and premium placement.</p>
          
          <button 
            onClick={() => navigate('/pricing')}
            className="w-full mt-auto bg-white text-near-black hover:bg-primary-rose hover:text-white transition-colors duration-300 font-black uppercase tracking-[0.2em] py-4 rounded-xl shadow-lg relative z-10"
          >
            View Pricing
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdPaymentGate;
