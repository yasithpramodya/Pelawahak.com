import React from 'react';

const Safety = () => {
  const safetyTips = [
    {
      icon: '🛡️',
      title: 'Protect Your Identity',
      desc: 'Keep your personal details confidential. Avoid sharing your national identity card, home address, workplace details, or family contacts until you have established a high level of trust.'
    },
    {
      icon: '💬',
      title: 'Communicate on Pelawahak',
      desc: 'Use our secure built-in messaging interface for initial conversations. Avoid shifting the conversation to other messaging apps (like WhatsApp, Viber, or Telegram) too quickly.'
    },
    {
      icon: '🤝',
      title: 'First In-Person Meeting',
      desc: 'Always meet in public, well-lit places. Inform a close friend or family member about where you are going, who you are meeting, and what time you expect to return. Never agree to meet in private spaces.'
    },
    {
      icon: '💸',
      title: 'Never Send Money',
      desc: 'Pelawahak will never ask you to send money to other users. Be extremely cautious of requests for financial help, money transfers, or investment opportunities, regardless of the reason presented.'
    },
    {
      icon: '📸',
      title: 'Verify Vendor Portfolios',
      desc: 'When hiring marketplace wedding vendors, always inspect their portfolios, check verified reviews, request formal invoices or contracts, and verify their business credentials before making advance deposits.'
    },
    {
      icon: '🚩',
      title: 'Report Suspicious Activity',
      desc: 'If a user makes you feel uncomfortable, behaves inappropriately, or asks for suspicious details/funds, block them immediately and report their profile to our admin panel for swift investigation.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-24 animate-fadeIn min-h-screen">
      <title>Safety Tips & Trust Guidelines | Pelawahak.com</title>
      <meta name="description" content="Stay safe while searching for partners or hiring wedding vendors. Read our comprehensive security tips and trust guidelines." />

      {/* Page Header */}
      <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary-rose/10 px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 bg-primary-rose rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black text-primary-rose uppercase tracking-[0.3em]">Trust & Security</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-black text-near-black uppercase tracking-tight leading-none mb-6">
          Safety <span className="text-gold-gradient italic">First</span>
        </h1>
        <p className="text-dark-grey/70 font-semibold text-base md:text-lg leading-relaxed">
          Your security and peace of mind are our absolute priorities. Review these guidelines to protect yourself while discovering matrimonial matches and premium wedding services.
        </p>
      </div>

      {/* Grid of Safety Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {safetyTips.map((tip, idx) => (
          <div 
            key={idx} 
            className="glass-card rounded-[2rem] p-8 md:p-10 border border-light-grey/20 flex flex-col hover:-translate-y-2 duration-300 transition-transform relative group"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary-rose/10 flex items-center justify-center text-3xl shadow-inner border border-primary-rose/5 mb-8 group-hover:scale-110 transition-transform">
              {tip.icon}
            </div>
            <h3 className="text-xl font-black text-near-black uppercase tracking-wider mb-4">
              {tip.title}
            </h3>
            <p className="text-sm font-semibold text-dark-grey/70 leading-relaxed flex-1">
              {tip.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Callout */}
      <div className="mt-20 md:mt-28 bg-earth-gradient rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-center text-wedding-cream shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
          <span className="text-8xl">🛡️</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 relative z-10">
          Need Assistance Immediately?
        </h2>
        <p className="text-white/70 font-bold mb-8 max-w-2xl mx-auto relative z-10 text-sm md:text-base leading-relaxed">
          Our moderation team is available around the clock. If you encounter any fraudulent profiles, spam, harassment, or security concerns, do not hesitate to contact our help desk immediately.
        </p>
        <a 
          href="mailto:safety@pelawahak.com" 
          className="bg-white text-near-black px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl hover:bg-primary-rose hover:text-white transition-all duration-300 relative z-10 inline-block"
        >
          Contact Security Team
        </a>
      </div>
    </div>
  );
};

export default Safety;
