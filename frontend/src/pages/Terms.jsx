import React from 'react';

const Terms = () => {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing or using Pelawahak.com ("the Service"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. These terms apply to all visitors, registered users, and vendors.'
    },
    {
      title: '2. Eligibility',
      content: 'You must be at least 18 years of age (or the legal age of marriage in your jurisdiction) to register an account or list matrimonial profiles on our platform. By registering, you warrant that you have the legal capacity to enter into binding agreements.'
    },
    {
      title: '3. Matrimonial Registrations',
      content: 'Users registering matrimonial profiles must provide accurate, current, and truthful information. You are solely responsible for verifying the credentials and details of any prospective matches you communicate with. Pelawahak does not perform exhaustive background checks on matrimonial users.'
    },
    {
      title: '4. Vendor Listings & Marketplace',
      content: 'Vendors listing wedding services must represent their pricing, services, and portfolios accurately. All contracts, bookings, and financial deposits made between wedding clients and vendors are strictly bilateral agreements. Pelawahak is not a party to, nor liable for, any vendor-client transactions or disputes.'
    },
    {
      title: '5. Fees, Subscriptions & Payments',
      content: 'Certain premium services, matrimony unlocks, and featured vendor listing slots require payments. Subscription payments and single-ad purchases are processed securely via integrated payment gateways (e.g., PayPal). All fees are non-refundable unless explicitly stated otherwise.'
    },
    {
      title: '6. User Conduct & Content Guidelines',
      content: 'You agree not to publish defamatory, abusive, offensive, or fraudulent content. Impersonation of other individuals is strictly prohibited. We reserve the right, at our sole discretion, to suspend or terminate accounts that violate our code of conduct.'
    },
    {
      title: '7. Limitation of Liability',
      content: 'Pelawahak.com and its operators shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our services, online matching, or vendor transactions. The platform is provided on an "as-is" and "as-available" basis.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-24 animate-fadeIn min-h-screen">
      <title>Terms of Service | Pelawahak.com</title>
      <meta name="description" content="Read our terms of service, platform rules, matrimonial profile guidelines, and vendor marketplace policies." />

      {/* Page Header */}
      <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary-rose/10 px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 bg-primary-rose rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black text-primary-rose uppercase tracking-[0.3em]">Legal Framework</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-black text-near-black uppercase tracking-tight leading-none mb-6">
          Terms of <span className="text-gold-gradient italic">Service</span>
        </h1>
        <p className="text-dark-grey/70 font-semibold text-base md:text-lg leading-relaxed">
          Please read these terms carefully before using our platform. They establish the rights, rules, and responsibilities governing your use of Pelawahak.com.
        </p>
      </div>

      {/* Content Layout */}
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="glass-card rounded-[2.5rem] p-8 md:p-16 border border-light-grey/20 space-y-12">
          {sections.map((sec, idx) => (
            <div key={idx} className="border-b border-light-grey/20 last:border-0 pb-10 last:pb-0">
              <h2 className="text-xl md:text-2xl font-black text-near-black uppercase tracking-wide mb-4">
                {sec.title}
              </h2>
              <p className="text-sm font-semibold text-dark-grey/70 leading-relaxed">
                {sec.content}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center text-xs font-bold text-dark-grey/40 uppercase tracking-widest pt-6">
          Last Updated: June 18, 2026
        </div>
      </div>
    </div>
  );
};

export default Terms;
