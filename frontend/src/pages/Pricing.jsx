import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PLAN_DETAILS = {
  free: {
    name: 'Free',
    price: 0,
    ads: 3,
    description: 'Lifetime starter quota',
    features: ['3 Free Ads (Lifetime)', 'Standard Placement', 'Basic Analytics', 'Standard Support'],
  },
  basic: {
    name: 'Basic',
    price: 2.99,
    ads: 10,
    description: 'Billed monthly',
    features: ['10 Ads per Month', 'Standard Placement', 'Basic Analytics', 'Priority Support'],
  },
  standard: {
    name: 'Standard',
    price: 5.99,
    ads: 30,
    description: 'Billed monthly',
    features: ['30 Ads per Month', 'Featured Placement', 'Advanced Analytics', 'Priority Support'],
  },
  premium: {
    name: 'Premium',
    price: 9.99,
    ads: 'Unlimited',
    description: 'Billed monthly',
    features: ['Unlimited Ads', 'Top Tier Placement', 'Advanced Analytics', '24/7 Dedicated Support', 'Verified Badge'],
  }
};

const Pricing = () => {
  const { user, updateUserState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState(null);

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  const handleSubscribeOrder = async (plan) => {
    setError(null);
    try {
      const res = await api.post(`/payments/subscribe/${plan}`);
      return res.data.orderID;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to initialize subscription.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const handleSubscribeApprove = async (plan, data) => {
    setLoadingPlan(plan);
    try {
      const res = await api.post(`/payments/capture-subscription/${plan}`, { orderID: data.orderID });
      setLoadingPlan(null);
      if (res.data.success) {
        updateUserState(res.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setLoadingPlan(null);
      setError(err.response?.data?.message || 'Failed to verify subscription.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fadeIn min-h-screen">
      {paypalClientId && paypalClientId !== 'YOUR_PAYPAL_SANDBOX_CLIENT_ID' ? (
        <PayPalScriptProvider options={{ "client-id": paypalClientId, currency: "USD", intent: "capture", "enable-funding": "card" }}>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-near-black uppercase tracking-tighter mb-4">
          Professional <span className="text-gold-gradient">Plans</span>
        </h1>
        <p className="text-dark-grey/60 font-semibold text-lg max-w-2xl mx-auto">
          Choose the right plan to expand your reach and connect with premium clients on Sri Lanka's top matrimonial network.
        </p>
      </div>

      {error && (
        <div className="max-w-3xl mx-auto mb-8 bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl text-center text-xs font-black uppercase tracking-wider">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {Object.entries(PLAN_DETAILS).map(([planKey, details]) => {
          const isCurrentPlan = user?.subscriptionPlan === planKey || (!user?.subscriptionPlan && planKey === 'free');
          
          return (
            <div 
              key={planKey}
              className={`relative bg-white rounded-[2.5rem] p-8 border flex flex-col transition-transform hover:-translate-y-2 duration-300 ${
                isCurrentPlan ? 'border-primary-rose shadow-xl shadow-primary-rose/10' : 'border-light-grey/20 shadow-lg'
              }`}
            >
              {isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-rose text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                  Current Plan
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-black text-near-black uppercase tracking-widest mb-2">{details.name}</h3>
                <div className="flex items-end justify-center gap-1 mb-2">
                  <span className="text-4xl font-black text-near-black">${details.price}</span>
                  <span className="text-xs font-bold text-dark-grey/50 uppercase mb-1">/mo</span>
                </div>
                <p className="text-[10px] font-bold text-dark-grey/40 uppercase tracking-widest">{details.description}</p>
              </div>

              <div className="mb-8 flex-1">
                <ul className="space-y-4">
                  {details.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-primary-rose mt-0.5">✔</span>
                      <span className="text-sm font-semibold text-dark-grey/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto min-h-[110px] relative flex flex-col justify-end">
                {planKey === 'free' ? (
                  <button 
                    disabled 
                    className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-light-grey/20 text-dark-grey/50 cursor-not-allowed"
                  >
                    Default
                  </button>
                ) : !user ? (
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-near-black text-white hover:bg-black transition-colors"
                  >
                    Log in to Upgrade
                  </button>
                ) : isCurrentPlan ? (
                  <button 
                    disabled 
                    className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-primary-rose text-white shadow-lg cursor-not-allowed"
                  >
                    Active
                  </button>
                ) : loadingPlan === planKey ? (
                  <div className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-warm-white text-dark-grey/50 flex justify-center">
                    <div className="w-4 h-4 border-2 border-primary-rose/30 border-t-primary-rose rounded-full animate-spin"></div>
                  </div>
                ) : paypalClientId && paypalClientId !== 'YOUR_PAYPAL_SANDBOX_CLIENT_ID' ? (
                  <div className="absolute inset-0 z-10 opacity-90 hover:opacity-100 flex items-center justify-center pointer-events-auto">
                    <div className="w-full h-full scale-90 origin-center">
                      <PayPalButtons
                        style={{ layout: "vertical", shape: "rect", color: "gold", tagline: false }}
                        createOrder={() => handleSubscribeOrder(planKey)}
                        onApprove={(data) => handleSubscribeApprove(planKey, data)}
                        onError={(err) => {
                          console.error(`PayPal Error (${planKey})`, err);
                          setError(`PayPal checkout failed for ${details.name}.`);
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <button disabled className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-500">
                    PayPal Not Configured
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ad hoc purchase section */}
      <div className="max-w-4xl mx-auto mt-20 bg-earth-gradient rounded-[3rem] p-12 text-center text-wedding-cream shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
            <span className="text-8xl font-black text-primary-rose">🚀</span>
         </div>
         <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 relative z-10">Need just one more ad?</h2>
         <p className="text-white/70 font-bold mb-8 relative z-10">Purchase a single ad slot anytime without subscribing. It never expires until you use it.</p>
         
         <button 
           onClick={() => navigate('/post-ad')}
           className="bg-white text-near-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-xl hover:bg-primary-rose hover:text-white transition-all duration-300 relative z-10"
         >
           Buy Ad Slot for $1.20
         </button>
      </div>
        </PayPalScriptProvider>
      ) : (
        <div className="text-center text-rose-500 font-black uppercase mt-10">
          ⚠️ PayPal Client ID is missing.
        </div>
      )}
    </div>
  );
};

export default Pricing;
