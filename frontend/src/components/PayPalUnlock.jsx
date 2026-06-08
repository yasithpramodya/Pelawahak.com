import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import api from '../services/api';

const PayPalUnlock = ({ partnerId, onSuccess, price = 2.99 }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  if (!paypalClientId) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest">
        ⚠️ PayPal Client ID is not configured.
      </div>
    );
  }

  const handleCreateOrder = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/payments/create-order', { partnerId });
      setLoading(false);
      return res.data.orderID;
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || 'Failed to initialize payment.';
      setError(errMsg);
      console.error('PayPal create order error:', err);
      throw new Error(errMsg);
    }
  };

  const handleApprove = async (data) => {
    setLoading(true);
    try {
      await api.post('/payments/capture-order', {
        orderID: data.orderID,
        partnerId
      });
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to verify payment.');
      console.error('PayPal capture error:', err);
    }
  };

  return (
    <div className="w-full bg-warm-white/40 p-6 md:p-8 rounded-[2rem] border border-light-grey/10 shadow-inner flex flex-col items-center">
      <div className="text-center mb-6">
        <span className="text-3xl mb-2 block">🔒</span>
        <h4 className="font-black text-near-black uppercase text-sm tracking-widest mb-1">Unlock Premium Match</h4>
        <p className="text-dark-grey/50 font-semibold text-xs leading-normal max-w-xs mx-auto">
          Gain permanent access to this partner's full profile, photos, and direct contact details.
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur px-6 py-3 rounded-full border border-light-grey/20 mb-6 shadow-sm">
        <span className="text-xs font-black text-dark-grey/60 uppercase tracking-widest">Pricing: </span>
        <span className="text-sm font-black text-near-black tracking-tight">${price.toFixed(2)} USD</span>
      </div>

      {error && (
        <div className="w-full mb-4 bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl text-center text-[10px] font-black uppercase tracking-wider">
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div className="w-full py-4 text-center text-xs font-black uppercase tracking-widest text-dark-grey/40 animate-pulse">
          Processing...
        </div>
      )}

      <div className="w-full max-w-[280px] z-20">
        <PayPalScriptProvider options={{ "client-id": paypalClientId, currency: "USD" }}>
          <PayPalButtons
            style={{ layout: "vertical", height: 48, shape: "rect", color: "gold" }}
            createOrder={handleCreateOrder}
            onApprove={handleApprove}
            onError={(err) => {
              console.error("PayPal Button Error", err);
              setError("An error occurred during PayPal checkout. Please try again.");
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default PayPalUnlock;
