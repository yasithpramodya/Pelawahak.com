import React, { useState, useMemo, useCallback } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import api from '../services/api';

const PayPalUnlock = ({ partnerId, onSuccess, price = 2.99 }) => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  // Memoize options so PayPalScriptProvider never re-mounts from re-renders
  const paypalOptions = useMemo(() => ({
    'client-id': paypalClientId,
    currency: 'USD',
    intent: 'capture',
  }), [paypalClientId]);

  // useCallback so function references stay stable across re-renders
  const handleCreateOrder = useCallback(async () => {
    setError(null);
    try {
      const res = await api.post('/payments/create-order', { partnerId });
      return res.data.orderID;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to initialize payment. Please try again.';
      setError(errMsg);
      console.error('PayPal create order error:', err);
      throw new Error(errMsg);
    }
  }, [partnerId]);

  const handleApprove = useCallback(async (data) => {
    setProcessing(true);
    setError(null);
    try {
      await api.post('/payments/capture-order', {
        orderID: data.orderID,
        partnerId,
      });
      setPaymentDone(true);
      // Re-fetch the full partner data (with phone/email now revealed)
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment verification failed. Please contact support.');
      console.error('PayPal capture error:', err);
    } finally {
      setProcessing(false);
    }
  }, [partnerId, onSuccess]);

  const handleError = useCallback((err) => {
    console.error('PayPal Button Error', err);
    setError('An error occurred during PayPal checkout. Please try again.');
  }, []);

  if (!paypalClientId || paypalClientId === 'YOUR_PAYPAL_SANDBOX_CLIENT_ID') {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest">
        ⚠️ PayPal is not configured. Please contact support.
      </div>
    );
  }

  if (paymentDone) {
    return (
      <div className="w-full bg-green-500/10 border border-green-400/30 p-8 rounded-[2rem] flex flex-col items-center text-center">
        <span className="text-5xl mb-3">✅</span>
        <h4 className="font-black text-white uppercase tracking-widest text-sm mb-1">Payment Successful!</h4>
        <p className="text-white/70 text-xs font-semibold">Loading your unlocked profile...</p>
      </div>
    );
  }

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
        <span className="text-xs font-black text-dark-grey/60 uppercase tracking-widest">One-time unlock: </span>
        <span className="text-sm font-black text-near-black tracking-tight">${price.toFixed(2)} USD</span>
      </div>

      {error && (
        <div className="w-full mb-4 bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl text-center text-[10px] font-black uppercase tracking-wider">
          ⚠️ {error}
        </div>
      )}

      {processing ? (
        <div className="w-full py-6 text-center flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-rose/30 border-t-primary-rose rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-dark-grey/50 animate-pulse">
            Verifying payment...
          </p>
        </div>
      ) : (
        <div className="w-full max-w-[280px] z-20">
          <PayPalScriptProvider options={paypalOptions}>
            <PayPalButtons
              style={{ layout: 'vertical', height: 48, shape: 'rect', color: 'gold' }}
              createOrder={handleCreateOrder}
              onApprove={handleApprove}
              onError={handleError}
              forceReRender={[partnerId]}
            />
          </PayPalScriptProvider>
        </div>
      )}
    </div>
  );
};

export default PayPalUnlock;
