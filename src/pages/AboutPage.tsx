/* ─────────────────────────────────────────────────────────────────────────
   BEAST GYM — About Page
   Green & Black Theme with Scroll Fly-In Headline & Story
───────────────────────────────────────────────────────────────────────── */
import React, { useEffect, useRef, useState } from 'react';
import { Dumbbell, Target, Flame, Heart, Shield, Star, Users, Trophy, ChevronDown } from 'lucide-react';
import { ScrollFlyInHeadline } from '../components/common/ScrollFlyInHeadline';

function useScrollReveal(threshold = 0.15) {
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

const TEAM = [
  { name: 'Rex "The Anvil" Steel', title: 'Head Coach & Founder', exp: '14 yrs', emoji: '🏋️', certs: ['CSCS', 'IFBB Pro Coach'] },
  { name: 'Sarah Vance', title: 'Head of Conditioning', exp: '9 yrs', emoji: '⚡', certs: ['NASM CPT', 'CrossFit L3'] },
  { name: 'Dr. Aris Thorne', title: 'Recovery Director', exp: '11 yrs', emoji: '🩺', certs: ['DPT', 'FMS L2'] },
  { name: 'Maya Lin', title: 'Mobility & Yoga Expert', exp: '7 yrs', emoji: '🧘', certs: ['E-RYT 500', 'NSCA'] },
];

const VALUES = [
  { icon: <Target className="w-7 h-7" />, title: 'Relentless Precision', desc: 'Every rep, every macro, every recovery second is optimized for peak output.' },
  { icon: <Flame className="w-7 h-7" />, title: 'Ferocious Drive', desc: 'We train athletes who refuse mediocrity. Comfort zones are destroyed here.' },
  { icon: <Shield className="w-7 h-7" />, title: 'Unbreakable Integrity', desc: 'Science-backed methods, zero gimmicks, real sustainable results every time.' },
  { icon: <Heart className="w-7 h-7" />, title: 'Community First', desc: 'A tribe of 5,000+ members who lift each other to unprecedented levels.' },
];

const STATS = [
  { value: '2014', label: 'Founded', icon: <Trophy className="w-5 h-5 text-[#00ff66]" /> },
  { value: '5,000+', label: 'Active Members', icon: <Users className="w-5 h-5 text-[#10b981]" /> },
  { value: '98.4%', label: 'Goal Success Rate', icon: <Star className="w-5 h-5 text-[#00ff66]" /> },
  { value: '18+', label: 'Master Coaches', icon: <Dumbbell className="w-5 h-5 text-[#10b981]" /> },
];

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen text-white bg-[#050a07]">

      {/* Hero Block */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-24 bg-[#050a07] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff66]/10 rounded-full blur-[140px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-xs font-black uppercase tracking-widest">
            <Flame className="w-4 h-4 animate-pulse text-[#00ff66]" /> OUR STORY
          </span>

          {/* Scroll Fly-In Headline */}
          <ScrollFlyInHeadline
            text="WE EXIST TO BUILD BEASTS"
            highlightWords={['BUILD', 'BEASTS']}
            subtext="Born in 2014 from a single garage gym, BEAST GYM grew into a 22,000 sq ft performance sanctuary serving elite athletes, everyday warriors, and everyone in between."
          />
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <ChevronDown className="w-6 h-6 text-[#00ff66]" />
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-[#080e0a] border-y border-emerald-900/40 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <RevealSection key={s.label} delay={i * 80} className="text-center space-y-2 p-6 rounded-2xl bg-[#0f1c14] border border-emerald-900/60">
              <div className="flex justify-center">{s.icon}</div>
              <p className="text-4xl font-black text-white font-anton">{s.value}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-20 px-4 bg-[#050a07]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <RevealSection>
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-wider text-white font-anton">
                FROM A GARAGE TO AN <span className="text-[#00ff66]">EMPIRE</span>
              </h2>
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-light">
                <p>Rex Steel walked into his first gym at 17 with nothing but hunger. By 24 he was a national powerlifting champion coaching professionals. In 2014, frustrated by gyms that prioritized aesthetics over results, he opened Beast Gym in a converted warehouse.</p>
                <p>The philosophy was brutal in its simplicity: surround yourself with the right science, the right people, and the right environment — transformation is inevitable.</p>
                <p>Today, Beast Gym operates across three facilities, serves 5,000+ members, and has produced 340+ physique and strength competition podium finishes.</p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-12 h-12 rounded-2xl bg-[#00ff66] text-[#050a07] flex items-center justify-center font-black text-2xl italic shadow-lg shadow-[#00ff66]/20">R</div>
                <div>
                  <p className="text-sm font-black text-white italic uppercase">Rex Steel</p>
                  <p className="text-xs text-[#00ff66] font-mono">Founder & Head Coach</p>
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Visual Stat Blocks */}
          <RevealSection delay={150} className="grid grid-cols-2 gap-4">
            {[
              { n: '340+', l: 'Competition Podiums', c: 'green' },
              { n: '22K', l: 'Sq Ft Facility', c: 'emerald' },
              { n: '3', l: 'Locations', c: 'green' },
              { n: '9', l: 'Awards Won', c: 'emerald' },
            ].map(b => (
              <div key={b.l} className="p-6 rounded-2xl bg-[#080e0a] border border-emerald-900/60 flex flex-col justify-center">
                <p className="text-4xl font-black text-[#00ff66] italic font-anton">{b.n}</p>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">{b.l}</p>
              </div>
            ))}
          </RevealSection>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-[#080e0a] border-t border-emerald-900/40">
        <div className="max-w-6xl mx-auto">
          <RevealSection className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-xs font-black uppercase tracking-widest">
              <Shield className="w-4 h-4" /> OUR CODE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-wider text-white font-anton">
              THE VALUES WE <span className="text-[#00ff66]">LIVE BY</span>
            </h2>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <RevealSection key={v.title} delay={i * 100} className="p-8 rounded-3xl bg-[#0f1c14] border border-emerald-900/60 hover:border-[#00ff66] hover:-translate-y-1 transition-all duration-300 text-center group shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00ff66] group-hover:text-[#050a07] group-hover:scale-110 transition-all">
                  {v.icon}
                </div>
                <h3 className="text-lg font-black text-white italic uppercase mb-2">{v.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">{v.desc}</p>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-[#050a07] border-t border-emerald-900/40">
        <div className="max-w-6xl mx-auto">
          <RevealSection className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-wider text-white font-anton">
              THE PEOPLE BEHIND <span className="text-[#00ff66]">YOUR RESULTS</span>
            </h2>
          </RevealSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((m, i) => (
              <RevealSection key={m.name} delay={i * 100} className="p-6 rounded-3xl bg-[#080e0a] border border-emerald-900/60 hover:border-[#00ff66]/70 hover:-translate-y-2 transition-all duration-300 text-center group">
                <div className="w-16 h-16 rounded-2xl bg-[#050a07] border border-emerald-900 text-4xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {m.emoji}
                </div>
                <h3 className="text-base font-black text-white italic uppercase group-hover:text-[#00ff66] transition-colors">{m.name}</h3>
                <p className="text-xs text-[#00ff66] font-bold uppercase tracking-wider mt-1">{m.title}</p>
                <p className="text-xs text-emerald-400 font-mono mt-1">{m.exp} experience</p>
                <div className="mt-3 flex flex-wrap gap-1 justify-center">
                  {m.certs.map(c => (
                    <span key={c} className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#050a07] text-slate-400 border border-emerald-900">{c}</span>
                  ))}
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
