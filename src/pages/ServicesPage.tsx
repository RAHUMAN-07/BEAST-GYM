/* ─────────────────────────────────────────────────────────────────────────
   BEAST GYM — Services Page
   Green & Black theme with Scroll Fly-In Headline & Service Cards
───────────────────────────────────────────────────────────────────────── */
import React, { useEffect, useRef, useState } from 'react';
import { Dumbbell, Zap, Target, Heart, Activity, Users, ArrowRight, CheckCircle2, Flame } from 'lucide-react';
import { ScrollFlyInHeadline } from '../components/common/ScrollFlyInHeadline';

function useScrollReveal(threshold = 0.12) {
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

function RevealCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const SERVICES = [
  {
    icon: <Dumbbell className="w-8 h-8" />,
    title: 'Olympic Strength Training',
    badge: 'Flagship',
    desc: 'Hammer Strength platforms, calibrated bumper plates up to 250kg, velocity bars, and power cages — engineered for elite lifting.',
    features: ['24+ Power Racks & Olympic Platforms', 'Velocity Bar Force Tracking', 'Periodization Support', 'Form Guidance System'],
    price: 'Included in Beast Pro & VIP',
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Metabolic HIIT & Conditioning',
    badge: 'High-Demand',
    desc: 'Sled turf, assault bikes, rowing ergometers, battle ropes and kettlebell arenas for max caloric torching and cardiovascular dominance.',
    features: ['5,000 Sq Ft Turf Arena', 'Heart-Rate Zone Monitoring', 'Daily Structured Group Classes', 'VO2 Max Testing'],
    price: 'Included in Beast Pro & VIP',
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: '1-on-1 Personal Coaching',
    badge: 'Premium',
    desc: 'Fully bespoke training blocks crafted by CSCS-certified master coaches around your body mechanics, schedule, and goals.',
    features: ['Goal Assessment & Scan', 'Custom 12-Week Periodized Plan', 'Weekly Check-In & Adjustment', 'Access to VIP Coach Network'],
    price: 'From $89/mo (VIP Tier)',
  },
  {
    icon: <Activity className="w-8 h-8" />,
    title: 'Precision Macro Nutrition',
    badge: 'Science-Backed',
    desc: 'Mifflin-St Jeor macro calculations, Indian & global high-protein meal libraries, grocery generators, and daily logging dashboards.',
    features: ['Personalized TDEE & Macro Goals', 'Veg / Non-Veg / Vegan / Indian Plans', 'Weekly Grocery List Generator', 'FitPulse App Sync'],
    price: 'Included in all memberships',
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Cryo & Infrared Recovery',
    badge: 'VIP',
    desc: 'Accelerate muscle repair with contrast ice baths (12°C), full-spectrum infrared saunas, percussion therapy rooms, and guided breathing.',
    features: ['Contrast Cryo Ice Baths', 'Full-Spectrum Infrared Saunas', 'Normatec Compression Therapy', 'Recovery Protocol Coaching'],
    price: 'Unlimited with VIP — $30 Day-Pass',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Group Classes & Community',
    badge: 'Community',
    desc: 'Daily small-group sessions covering powerlifting, HIIT, boxing, yoga, and mobility led by IFBB / CrossFit / Muay Thai certified coaches.',
    features: ['10+ Class Formats Daily', 'Max 15 Per Class for Coaching Quality', 'Booking via App or Reception', 'Monthly Member Competitions'],
    price: 'Included in Beast Pro & VIP',
  },
];

interface ServicesPageProps {
  onGetStarted: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen text-white bg-[#050a07]">

      {/* Hero */}
      <section className="py-24 px-4 bg-[#050a07] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff66]/10 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-xs font-black uppercase tracking-widest">
            <Flame className="w-4 h-4 animate-pulse text-[#00ff66]" /> WHAT WE OFFER
          </span>

          <ScrollFlyInHeadline
            text="SIX WEAPONS FOR YOUR GOALS"
            highlightWords={['WEAPONS', 'GOALS']}
            subtext="Whether you're chasing a competition podium, your first pull-up, or simply a healthier life — Beast Gym has a precision service built for you."
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-[#080e0a] border-t border-emerald-900/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s, i) => (
            <RevealCard
              key={s.title}
              delay={i * 80}
              className="bg-[#0f1c14] border border-emerald-900/60 hover:border-[#00ff66] rounded-3xl p-8 flex flex-col justify-between group hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#00ff66]/10 transition-all duration-300 cursor-pointer backdrop-blur-md"
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30 flex items-center justify-center group-hover:bg-[#00ff66] group-hover:text-[#050a07] transition-all group-hover:scale-110 duration-300">
                    {s.icon}
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30">
                    {s.badge}
                  </span>
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-wider text-white group-hover:text-[#00ff66] transition-colors mb-3 font-anton">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light mb-6">{s.desc}</p>
                <ul className="space-y-2">
                  {s.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#00ff66] flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-emerald-900/60 flex items-center justify-between">
                <p className="text-[10px] text-slate-500 font-mono">{s.price}</p>
                <button onClick={onGetStarted} className="text-[#00ff66] hover:text-white font-black text-xs uppercase tracking-wider flex items-center gap-1 transition-colors">
                  Start <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </RevealCard>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-16 px-4 bg-[#050a07] border-t border-emerald-900/40 text-center">
        <RevealCard className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black uppercase italic text-white font-anton">
            NOT SURE WHICH SERVICE FITS?
          </h2>
          <p className="text-slate-400 text-sm font-light">Book a free 30-minute Strategy Consultation with one of our master coaches.</p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#00ff66] text-[#050a07] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#00ff66]/20 hover:scale-105 transition-all"
          >
            Book Free Consultation <ArrowRight className="w-4 h-4" />
          </button>
        </RevealCard>
      </section>

    </div>
  );
};
