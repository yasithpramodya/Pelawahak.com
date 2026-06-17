import React from 'react';

const Privacy = () => {
  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us when creating a matrimonial profile, uploading images, or listing vendor details (such as names, contact info, wedding photos, and services offered). If you purchase a premium plan, billing/transactional details are handled securely by external payment processors.'
    },
    {
      title: '2. How We Use Information',
      content: 'We use the collected details to facilitate matrimonial matchmaking, index wedding vendor services on our search pages, connect users via chat, send profile updates, verify vendor credentials, and maintain site safety. We do not sell or lease your personal information.'
    },
    {
      title: '3. Data Visibility and Sharing',
      content: 'Matrimonial details you post (e.g. horoscope, description, criteria) are visible to registered users as designated by your privacy controls. Vendor advertisements and portfolio details are public to help you attract prospective wedding clients. You can adjust visibility options on your dashboard.'
    },
    {
      title: '4. Cookies & Tracking Technology',
      content: 'We use cookies, tokens, and browser storage to maintain session states (keeping you logged in), personalize search filters, and collect general visitor traffic analytics. You can control cookies through your browser settings.'
    },
    {
      title: '5. Security and Data Retention',
      content: 'We employ industry-standard encryption protocols (SSL/HTTPS) to protect your account and data. We retain your profile details as long as your account remains active or as needed to comply with legal compliance audits.'
    },
    {
      title: '6. User Control & Deletion Rights',
      content: 'You retain full access to view, update, or permanently delete your profile and listings at any time directly through your user dashboard. Alternatively, you may contact our safety team to request complete erasure of your data.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-24 animate-fadeIn min-h-screen">
      <title>Privacy Policy | Pelawahak.com</title>
      <meta name="description" content="Learn how we collect, store, share, and protect your personal data and matrimonial listing information." />

      {/* Page Header */}
      <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary-rose/10 px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 bg-primary-rose rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black text-primary-rose uppercase tracking-[0.3em]">Data Protection</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-black text-near-black uppercase tracking-tight leading-none mb-6">
          Privacy <span className="text-gold-gradient italic">Policy</span>
        </h1>
        <p className="text-dark-grey/70 font-semibold text-base md:text-lg leading-relaxed">
          Your privacy matters. This document explains what information we collect, how it is stored and shared, and the controls you have over your data.
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

export default Privacy;
