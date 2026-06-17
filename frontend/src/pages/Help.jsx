import React, { useState } from 'react';

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const faqs = [
    {
      q: 'How do I create a matrimonial profile?',
      a: 'After signing in, click on your Dashboard and choose "Create Matrimonial Profile" or navigate to "Find a Partner" and click "Post Your Profile". You will be asked to fill in details like age, education, profession, location, and matching preferences, which help others discover your listing.'
    },
    {
      q: 'Are my contact details visible to all visitors?',
      a: 'No. To ensure maximum safety and privacy, your contact numbers and email address are kept hidden. Matrimonial matches can request permission to view your verified details, or chat with you securely using our built-in real-time messaging system.'
    },
    {
      q: 'How do I post a wedding vendor advertisement?',
      a: 'If you are a vendor (photographer, catering team, wedding hall, planner, etc.), navigate to "Post Your Ad" from the menu or footer. You can select your service category, set pricing ranges, specify location availability, and upload gorgeous portfolio images.'
    },
    {
      q: 'What are the pricing plans and features?',
      a: 'We offer plans tailored to your needs. The Free plan allows up to 3 standard ads. Our premium tiers (Basic, Standard, Premium) unlock additional ad slots, feature vendor profiles on the home page search results, and add a "Verified" trust badge to your matrimonials.'
    },
    {
      q: 'How do payments work on Pelawahak?',
      a: 'All subscription payments and single-ad upgrades are processed securely through PayPal. Once your transaction is authorized, your account quota and featured status will be updated immediately.'
    },
    {
      q: 'How can I report a scammer or suspicious user?',
      a: 'If you suspect a profile is fraudulent or a vendor is using fake portfolios, click the "Report" button directly on their profile details page, or email our support staff at safety@pelawahak.com.'
    }
  ];

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-24 animate-fadeIn min-h-screen">
      <title>Help Center & FAQ | Pelawahak.com</title>
      <meta name="description" content="Find answers to common questions about matchmaking, vendor advertising, payments, and account controls, or contact our support team." />

      {/* Page Header */}
      <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary-rose/10 px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 bg-primary-rose rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black text-primary-rose uppercase tracking-[0.3em]">Support Desk</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-black text-near-black uppercase tracking-tight leading-none mb-6">
          Help <span className="text-gold-gradient italic">Center</span>
        </h1>
        <p className="text-dark-grey/70 font-semibold text-base md:text-lg leading-relaxed">
          How can we help you today? Browse frequently asked questions or submit a support ticket to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
        {/* FAQs Accordion */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xl md:text-2xl font-black text-near-black uppercase tracking-wider mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-light-grey/20 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-5 md:py-6 text-left flex justify-between items-center gap-4 focus:outline-none"
                  >
                    <span className="text-sm md:text-base font-black text-near-black uppercase tracking-wide">
                      {faq.q}
                    </span>
                    <span className={`text-xl font-bold text-primary-rose transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  <div 
                    className={`transition-all duration-500 ease-in-out ${
                      isOpen ? 'max-h-96 border-t border-light-grey/10' : 'max-h-0 pointer-events-none'
                    }`}
                  >
                    <p className="p-6 md:p-8 text-sm font-semibold text-dark-grey/80 leading-relaxed bg-warm-white/20">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border border-light-grey/20">
            <h2 className="text-xl md:text-2xl font-black text-near-black uppercase tracking-wider mb-6">
              Get in Touch
            </h2>
            <p className="text-xs font-semibold text-dark-grey/60 uppercase tracking-wider mb-8">
              Send us a message and we'll reply as soon as possible.
            </p>

            {submitted && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-center text-xs font-black uppercase tracking-wider animate-fadeIn">
                ✓ Message received! We'll reply within 24 hours.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[8px] font-black text-dark-grey/50 uppercase tracking-[0.3em] mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your Name"
                  className="w-full bg-warm-white/40 border border-light-grey/40 px-6 py-4 rounded-xl text-sm font-bold placeholder-dark-grey/30 focus:border-primary-rose focus:ring-1 focus:ring-primary-rose outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[8px] font-black text-dark-grey/50 uppercase tracking-[0.3em] mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full bg-warm-white/40 border border-light-grey/40 px-6 py-4 rounded-xl text-sm font-bold placeholder-dark-grey/30 focus:border-primary-rose focus:ring-1 focus:ring-primary-rose outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[8px] font-black text-dark-grey/50 uppercase tracking-[0.3em] mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="How can we help?"
                  className="w-full bg-warm-white/40 border border-light-grey/40 px-6 py-4 rounded-xl text-sm font-bold placeholder-dark-grey/30 focus:border-primary-rose focus:ring-1 focus:ring-primary-rose outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[8px] font-black text-dark-grey/50 uppercase tracking-[0.3em] mb-2">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Write your query details here..."
                  className="w-full bg-warm-white/40 border border-light-grey/40 px-6 py-4 rounded-xl text-sm font-bold placeholder-dark-grey/30 focus:border-primary-rose focus:ring-1 focus:ring-primary-rose outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-rose text-white hover:bg-deep-rose transition-all py-5 rounded-full font-black text-[11px] tracking-[0.2em] uppercase shadow-lg shadow-primary-rose/20 active:scale-95"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
