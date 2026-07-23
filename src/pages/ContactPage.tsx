/* ─────────────────────────────────────────────────────────────────────────
   BEAST GYM — Contact Page
   Green & Black Theme with Scroll Fly-In Headline
───────────────────────────────────────────────────────────────────────── */
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, Link2, Video, AtSign } from 'lucide-react';
import { ScrollFlyInHeadline } from '../components/common/ScrollFlyInHeadline';

function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const INFO_CARDS = [
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Visit Us',
    lines: ['108 Beast Way, Iron District', 'Performance City, PC 10001'],
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: 'Call Us',
    lines: ['+1 (800) 555-BEAST', 'Mon–Sun 5 AM – 12 AM'],
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: 'Email Us',
    lines: ['join@beastgym.com', 'coaching@beastgym.com'],
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Opening Hours',
    lines: ['Mon–Fri: 5 AM – 11 PM', 'Sat–Sun: 6 AM – 10 PM'],
  },
];

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { ref, visible } = useScrollReveal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen text-white bg-[#050a07]">

      {/* Hero */}
      <section className="py-24 px-4 bg-[#050a07] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff66]/10 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-xs font-black uppercase tracking-widest">
            <MessageSquare className="w-4 h-4 text-[#00ff66]" /> GET IN TOUCH
          </span>

          <ScrollFlyInHeadline
            text="LET'S TALK PERFORMANCE"
            highlightWords={['PERFORMANCE']}
            subtext="Whether you're ready to join, have a question, or want a free coaching consultation — we respond within 2 hours."
          />
        </div>
      </section>

      {/* Info Cards Row */}
      <section className="py-12 px-4 bg-[#080e0a] border-t border-emerald-900/40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INFO_CARDS.map((card, i) => (
            <div
              ref={ref}
              key={card.title}
              className="p-6 rounded-3xl bg-[#0f1c14] border border-emerald-900/60 hover:border-[#00ff66] transition-all hover:-translate-y-1 group shadow-xl"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.6s ease ${i * 80}ms`,
              }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-[#00ff66]/15 text-[#00ff66] group-hover:bg-[#00ff66] group-hover:text-[#050a07] transition-all">
                {card.icon}
              </div>
              <h3 className="text-base font-black text-white italic uppercase mb-2 font-anton">{card.title}</h3>
              {card.lines.map(l => (
                <p key={l} className="text-xs text-slate-400 leading-relaxed">{l}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Main Contact Form + Map */}
      <section className="py-20 px-4 bg-[#050a07] border-t border-emerald-900/40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Form */}
          <div className="lg:col-span-3 bg-[#080e0a] border border-emerald-900/60 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
            <h2 className="text-2xl font-black italic uppercase text-white mb-2 font-anton">Send a Message</h2>
            <p className="text-xs text-slate-400 mb-8">All fields marked with * are required.</p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-[#00ff66]/20 text-[#00ff66] flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-black italic uppercase text-white font-anton">Message Sent!</h3>
                <p className="text-sm text-slate-400">We'll respond to <span className="text-[#00ff66] font-bold">{form.email}</span> within 2 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="px-5 py-2.5 rounded-xl bg-[#00ff66] text-[#050a07] font-black text-xs uppercase tracking-wider mt-2 hover:bg-[#34d399] transition-colors">
                  Send Another
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name *</label>
                    <input
                      type="text" required value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-[#050a07] border border-emerald-900 text-sm text-white placeholder:text-slate-600 focus:border-[#00ff66] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email Address *</label>
                    <input
                      type="email" required value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#050a07] border border-emerald-900 text-sm text-white placeholder:text-slate-600 focus:border-[#00ff66] focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Subject</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-[#050a07] border border-emerald-900 text-sm text-white focus:border-[#00ff66] focus:outline-none transition-all"
                  >
                    <option value="">Select a topic...</option>
                    <option>Membership Enquiry</option>
                    <option>Personal Training</option>
                    <option>Group Classes</option>
                    <option>Recovery Suite</option>
                    <option>Corporate Wellness</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Message *</label>
                  <textarea
                    required rows={5} value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us your goals..."
                    className="w-full px-4 py-3 rounded-xl bg-[#050a07] border border-emerald-900 text-sm text-white placeholder:text-slate-600 focus:border-[#00ff66] focus:outline-none resize-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-[#00ff66] text-[#050a07] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#00ff66]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 font-anton"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Map + Social */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex-1 rounded-3xl bg-[#080e0a] border border-emerald-900/60 overflow-hidden relative min-h-[280px]">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-[#080e0a] via-[#050a07] to-[#080e0a]">
                <div className="text-6xl mb-4">📍</div>
                <h3 className="font-black italic uppercase text-white text-lg font-anton">Beast Gym HQ</h3>
                <p className="text-sm text-slate-400 mt-1">108 Beast Way, Iron District</p>
                <p className="text-xs text-slate-500 mt-1">Performance City, PC 10001</p>
                <button className="mt-4 px-5 py-2.5 rounded-xl bg-[#00ff66] text-[#050a07] font-bold text-xs uppercase tracking-wider hover:bg-[#34d399] transition-colors">
                  Open in Maps
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#080e0a] border border-emerald-900/60 space-y-4">
              <h3 className="text-sm font-black italic uppercase text-white font-anton">Follow the Beast Tribe</h3>
              {[
                { icon: <Link2 className="w-5 h-5" />, name: '@BeastGymOfficial', handle: 'Instagram', color: 'text-[#00ff66]' },
                { icon: <Video className="w-5 h-5" />, name: 'Beast Gym Performance', handle: 'YouTube', color: 'text-emerald-400' },
                { icon: <AtSign className="w-5 h-5" />, name: '@BeastGym', handle: 'X / Twitter', color: 'text-[#00ff66]' },
              ].map(s => (
                <div key={s.handle} className="flex items-center gap-3 group cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl bg-[#050a07] border border-emerald-900 flex items-center justify-center ${s.color} group-hover:scale-110 transition-transform`}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{s.name}</p>
                    <p className="text-[10px] text-slate-500">{s.handle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
