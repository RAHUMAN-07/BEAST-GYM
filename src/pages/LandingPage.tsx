/* ─────────────────────────────────────────────────────────────────────────
   BEAST GYM (PULSEFIT STYLED) — Main Landing Page
   Inspired by Pulsefit Webflow Template:
   - Floating tag gravity pills ("Outdoor", "Aerobic", "Bodyweight", "Strength", "Cycling")
   - Giant stroke-text brand headline (`PULSEFIT` / `BEAST GYM`)
   - Vertical social bar & Neon Lime/Orange action buttons
   - Story section with hover image card & statement text
   - Asymmetric Classes grid with text overlays
   - Counter numbers (800+ Members, 26 Sessions, 20 Coaches, 20+ Gyms)
   - "Workout Here" video lightbox section
   - Interactive Trainers slider with active highlights
   - Client reviews cross-fade slider
   - Pricing section & Footer
───────────────────────────────────────────────────────────────────────── */
import React, { useState, useEffect } from 'react';
import { PricingSection } from '../components/landing/PricingSection';
import { ScrollFlyInHeadline } from '../components/common/ScrollFlyInHeadline';
import {
  Dumbbell,
  ArrowRight,
  ArrowUpRight,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Link2,
  Video,
  AtSign,
  Globe,
  CheckCircle2,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onGoToPlanner: () => void;
}

// ── Floating Gravity Tag Pills ──
const FLOATING_TAGS = [
  { text: 'Outdoor', rotate: '-12deg', top: '10%', left: '8%', color: 'bg-emerald-950/90 border-emerald-800 text-emerald-200' },
  { text: 'Aerobic', rotate: '15deg', top: '5%', right: '18%', color: 'bg-[#00ff66]/20 border-[#00ff66]/40 text-[#00ff66]' },
  { text: 'Bodyweight', rotate: '-8deg', bottom: '22%', left: '12%', color: 'bg-emerald-950/90 border-emerald-800 text-slate-200' },
  { text: 'Strength', rotate: '20deg', top: '35%', right: '8%', color: 'bg-[#00ff66] text-[#050a07] font-black shadow-lg shadow-[#00ff66]/30' },
  { text: 'Cycling', rotate: '-15deg', bottom: '15%', right: '22%', color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' },
];

// ── Classes Grid Items ──
const CLASSES_ITEMS = [
  {
    id: 1,
    title: 'Female Fitness',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
    size: 'col-span-1 md:col-span-2 row-span-1',
  },
  {
    id: 2,
    title: 'Pull-Up & Upper Body',
    badge: 'Strength',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
    size: 'col-span-1 row-span-1',
  },
  {
    id: 3,
    title: 'Weight Loss & Fat Burn',
    badge: 'HIIT',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=800&auto=format&fit=crop',
    size: 'col-span-1 row-span-1',
  },
  {
    id: 4,
    title: 'Functional Athletic Fitness',
    badge: 'Endurance',
    image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=800&auto=format&fit=crop',
    size: 'col-span-1 md:col-span-2 row-span-1',
  },
  {
    id: 5,
    title: 'Kids & Youth Fitness',
    badge: 'All Ages',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
    size: 'col-span-1 row-span-1',
  },
];

// ── Trainers Data ──
const TRAINERS = [
  { id: 1, name: 'Jose Hayes', specialty: 'Head Powerlifting Coach', exp: '12 yrs', image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600&auto=format&fit=crop' },
  { id: 2, name: 'Jack Anaya', specialty: 'Bodybuilding & Aesthetics', exp: '9 yrs', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop' },
  { id: 3, name: 'Anthony Lee', specialty: 'Functional HIIT & Agility', exp: '8 yrs', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop' },
  { id: 4, name: 'Frank Perez', specialty: 'Muay Thai & Conditioning', exp: '10 yrs', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop' },
  { id: 5, name: 'Mark Ortiz', specialty: 'CrossFit L3 & Endurance', exp: '11 yrs', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=600&auto=format&fit=crop' },
  { id: 6, name: 'Gary D. Clark', specialty: 'Recovery & Bio-Mechanics', exp: '14 yrs', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600&auto=format&fit=crop' },
];

// ── Client Reviews ──
const REVIEWS = [
  {
    id: 1,
    text: "PULSEFIT / BEAST GYM changed my life. The trainers are incredible, and the classes push you in the best way possible. I feel stronger every single day.",
    author: "Alex D. Winn",
    title: "Member since 2022 · Lost 18kg",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    text: "I've never been more consistent with my workouts. The high-intensity energy at Beast Gym is contagious, and the results I've seen in just 8 weeks are mind-blowing.",
    author: "Christopher R.",
    title: "Powerlifting Competitor",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    text: "From day one, I felt welcomed and supported. The community here is like no other gym. The customized split generator and coach check-ins kept me accountable.",
    author: "William Wetzel",
    title: "Amateur Bodybuilder",
    image: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=1200&auto=format&fit=crop"
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onGoToPlanner }) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeTrainer, setActiveTrainer] = useState(0);
  const [activeReview, setActiveReview] = useState(0);

  // Auto-slide reviews
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % REVIEWS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen text-white bg-[#050a07] overflow-x-hidden font-sans">

      {/* ───────────────────────────────────────────────────────────
          HERO SECTION — Pulsefit Webflow Layout
          ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-[#050a07] pt-8 pb-16 overflow-hidden">
        
        {/* Dark Background Overlay Image / Pattern */}
        <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050a07] via-transparent to-[#050a07]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#00ff66]/10 rounded-full blur-[140px] animate-pulse" />
        </div>

        {/* Vertical Social Links Bar (Right Side) */}
        <div className="hidden xl:flex flex-col items-center gap-4 fixed right-8 top-1/2 -translate-y-1/2 z-30">
          <div className="w-[1px] h-12 bg-[#13271b]" />
          <a href="#" className="p-2 text-slate-400 hover:text-[#00ff66] hover:scale-110 transition-all"><Link2 className="w-4 h-4" /></a>
          <a href="#" className="p-2 text-slate-400 hover:text-[#00ff66] hover:scale-110 transition-all"><Video className="w-4 h-4" /></a>
          <a href="#" className="p-2 text-slate-400 hover:text-[#00ff66] hover:scale-110 transition-all"><AtSign className="w-4 h-4" /></a>
          <a href="#" className="p-2 text-slate-400 hover:text-[#00ff66] hover:scale-110 transition-all"><Globe className="w-4 h-4" /></a>
          <div className="w-[1px] h-12 bg-[#13271b]" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Floating Tags & Giant Stroke Headline */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left relative">
            
            {/* Floating Tag Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-4">
              {FLOATING_TAGS.map((tag) => (
                <span
                  key={tag.text}
                  className={`inline-block px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-lg transform transition-transform hover:scale-110 cursor-default ${tag.color}`}
                  style={{ transform: `rotate(${tag.rotate})` }}
                >
                  {tag.text}
                </span>
              ))}
            </div>

            {/* Giant Beast Gym Scroll Fly-In Headline */}
            <div className="relative py-2">
              <ScrollFlyInHeadline
                text="BEAST GYM"
                highlightWords={['BEAST', 'GYM']}
                subtext=""
              />
              <p className="text-xs sm:text-sm font-black uppercase tracking-[0.4em] text-[#00ff66] mt-2 font-mono text-center lg:text-left">
                HIGH-PERFORMANCE ATHLETIC SANCTUARY
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-300 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Unlock your full potential with high-performance strength training, elite master coaching, precision nutrition, and a community that fuels your goals.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onGoToPlanner}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#00ff66] hover:bg-[#34d399] text-[#050a07] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#00ff66]/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                🎯 Get My Free Workout Plan <ArrowUpRight className="w-4 h-4 text-[#050a07] font-bold" />
              </button>

              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0f1c14] border border-[#00ff66]/40 hover:border-[#00ff66] text-[#00ff66] font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:scale-105"
              >
                Join Beast Tribe
              </button>

              <button
                onClick={onLogin}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl font-semibold text-slate-400 hover:text-white text-xs uppercase tracking-widest transition-all"
              >
                Log In
              </button>
            </div>

            {/* Features Checkpoints */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#00ff66]" /> 24/7 Keycard Access</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#10b981]" /> Precision Form Guidance</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Contracts</span>
            </div>
          </div>

          {/* Right Column: Premium High-Performance Gym Photo Card */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden border-2 border-[#00ff66]/40 shadow-2xl shadow-[#00ff66]/20 group">
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop"
                alt="Beast Gym Athlete Training"
                className="w-full h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050a07] via-[#050a07]/40 to-transparent" />
              
              {/* Floating Badge 1 */}
              <div className="absolute top-6 left-6 px-4 py-2 rounded-2xl bg-[#050a07]/80 border border-[#00ff66]/60 backdrop-blur-md flex items-center gap-2.5 shadow-xl">
                <div className="w-3 h-3 rounded-full bg-[#00ff66] animate-ping" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">22,000 SQ FT SANCTUARY</span>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute bottom-6 right-6 px-4 py-2 rounded-2xl bg-[#00ff66] text-[#050a07] font-black text-xs uppercase tracking-widest shadow-2xl">
                ⚡ 24/7 UNLIMITED ACCESS
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          STORY SECTION — "The Story Behind Our Gym"
          ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#080e0a] border-t border-emerald-900/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Subtitle & Image Card */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#00ff66]">
              THE STORY BEHIND OUR GYM
            </span>
            
            <div className="relative rounded-3xl overflow-hidden border border-emerald-900/60 group cursor-pointer shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop"
                alt="Story section"
                className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080e0a] via-transparent to-transparent" />
              
              {/* Floating Action Arrow */}
              <button
                onClick={onGetStarted}
                className="absolute bottom-6 right-6 w-14 h-14 rounded-2xl bg-[#00ff66] text-[#050a07] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"
              >
                <ArrowUpRight className="w-6 h-6 font-bold" />
              </button>
            </div>
          </div>

          {/* Right: Big Impact Quote Statement */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-relaxed font-sans">
              At <span className="text-[#00ff66] italic">PULSEFIT</span> / BEAST GYM, we believe fitness is more than just lifting weights – <span className="text-[#10b981] italic">it's a lifestyle</span>.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              Our gym was founded with one core mission: to help everyday people become extraordinary. With personalized programs, expert master trainers, and a high-energy sanctuary environment, we're here to help you achieve more than you thought possible.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#00ff66]/20 border border-[#00ff66]/40 text-[#00ff66] font-black flex items-center justify-center text-xl italic">
                P
              </div>
              <div>
                <p className="text-sm font-black text-white uppercase italic">Rex Steel</p>
                <p className="text-xs text-[#00ff66] font-mono">Founder & Head Performance Coach</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          CLASSES GRID SECTION — Asymmetric Layout
          ─────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050a07] border-t border-emerald-900/40">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header with Sideways backdrop text */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-[#00ff66]">
                TAILORED PROGRAMS
              </span>
              <h2 className="text-4xl sm:text-6xl font-black italic uppercase text-white font-anton mt-1">
                OUR <span className="text-stroke-white">CLASSES</span>
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-md font-light">
              With personalized programs, expert trainers, and a high-energy environment, we help you break boundaries daily.
            </p>
          </div>

          {/* Asymmetric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CLASSES_ITEMS.map((item) => (
              <div
                key={item.id}
                className={`relative rounded-3xl overflow-hidden border border-emerald-900/60 hover:border-[#00ff66]/70 group cursor-pointer h-72 sm:h-80 shadow-2xl transition-all duration-500 ${item.size}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050a07] via-[#050a07]/40 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <span className="self-start px-3 py-1 rounded-full bg-[#050a07]/80 border border-emerald-900 text-[10px] font-black uppercase tracking-widest text-[#00ff66]">
                    {item.badge}
                  </span>
                  <div>
                    <h3 className="text-2xl font-black italic uppercase text-white group-hover:text-[#00ff66] transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Explore Program</span>
                      <ArrowRight className="w-4 h-4 text-[#00ff66]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          COUNTER STATS SECTION — Pulsefit Counter
          ─────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#080e0a] border-y border-emerald-900/40">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          
          <div className="space-y-2 p-6 rounded-2xl bg-[#0f1c14] border border-emerald-900/60">
            <h3 className="text-5xl sm:text-6xl font-black italic text-[#00ff66] font-anton">800+</h3>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Active Members</p>
          </div>

          <div className="space-y-2 p-6 rounded-2xl bg-[#0f1c14] border border-emerald-900/60">
            <h3 className="text-5xl sm:text-6xl font-black italic text-[#10b981] font-anton">120+</h3>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Weekly Sessions</p>
          </div>

          <div className="space-y-2 p-6 rounded-2xl bg-[#0f1c14] border border-emerald-900/60">
            <h3 className="text-5xl sm:text-6xl font-black italic text-[#00ff66] font-anton">20</h3>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Master Coaches</p>
          </div>

          <div className="space-y-2 p-6 rounded-2xl bg-[#0f1c14] border border-emerald-900/60">
            <h3 className="text-5xl sm:text-6xl font-black italic text-emerald-400 font-anton">3</h3>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Sanctuary Gyms</p>
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          VIDEO SECTION — "Workout Here"
          ─────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050a07]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-[#00ff66]">
                SANCTUARY ENVIRONMENT
              </span>
              <h2 className="text-4xl sm:text-6xl font-black italic uppercase text-white font-anton mt-1">
                WORKOUT <span className="text-stroke-green">HERE</span>
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-md font-light">
              Experience the atmosphere inside our 22,000 sq ft performance sanctuary equipped with Hammer Strength racks and recovery cryo suites.
            </p>
          </div>

          {/* Full-width Video Thumbnail with Play Lightbox Button */}
          <div className="relative rounded-3xl overflow-hidden border border-emerald-900/60 group shadow-2xl h-[420px] sm:h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1600&auto=format&fit=crop"
              alt="Gym video preview"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050a07] via-[#050a07]/40 to-transparent" />

            {/* Glowing Circular Play Button */}
            <button
              onClick={() => setVideoModalOpen(true)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#00ff66] text-[#050a07] flex items-center justify-center shadow-[0_0_50px_rgba(0,255,102,0.6)] group-hover:scale-110 transition-transform cursor-pointer"
            >
              <Play className="w-10 h-10 fill-[#050a07] ml-1" />
            </button>

            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between pointer-events-none">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#00ff66]">BEAST GYM TOUR</p>
                <h3 className="text-xl sm:text-2xl font-black italic uppercase text-white">Watch High-Intensity Training Session</h3>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          TRAINERS SLIDER SECTION — Interactive Carousel
          ─────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#080e0a] border-t border-emerald-900/40">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-[#10b981]">
                EXPERT COACHING
              </span>
              <h2 className="text-4xl sm:text-6xl font-black italic uppercase text-white font-anton mt-1">
                MASTER <span className="text-stroke-white">TRAINERS</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTrainer((prev) => (prev === 0 ? TRAINERS.length - 1 : prev - 1))}
                className="w-12 h-12 rounded-2xl bg-[#0f1c14] border border-emerald-900 text-white flex items-center justify-center hover:border-[#00ff66] hover:text-[#00ff66] transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setActiveTrainer((prev) => (prev + 1) % TRAINERS.length)}
                className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 text-white flex items-center justify-center hover:border-[#ddff7d] hover:text-[#ddff7d] transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Trainers Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRAINERS.slice(activeTrainer, activeTrainer + 3).concat(TRAINERS.slice(0, Math.max(0, (activeTrainer + 3) - TRAINERS.length))).map((trainer, idx) => (
              <div
                key={trainer.id}
                className={`relative rounded-3xl overflow-hidden border transition-all duration-500 group h-96 cursor-pointer ${
                  idx === 0 ? 'border-[#00ff66] shadow-[0_0_30px_rgba(0,255,102,0.25)]' : 'border-emerald-900/60 hover:border-[#00ff66]/50'
                }`}
              >
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050a07] via-[#050a07]/40 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#00ff66]">
                    {trainer.exp} EXPERIENCE
                  </span>
                  <h3 className="text-2xl font-black italic uppercase text-white group-hover:text-[#00ff66] transition-colors">
                    {trainer.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-light mt-1">{trainer.specialty}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          CLIENT REVIEWS SECTION — Testimonial Slider
          ─────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050a07] border-t border-emerald-900/40">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#00ff66]">
              MEMBER TRANSFORMATIONS
            </span>
            <h2 className="text-4xl sm:text-6xl font-black italic uppercase text-white font-anton mt-1">
              CLIENT <span className="text-stroke-green">REVIEWS</span>
            </h2>
          </div>

          {/* Active Review Card */}
          <div className="relative rounded-3xl bg-[#080e0a] border border-emerald-900/60 p-8 sm:p-12 shadow-2xl backdrop-blur-xl transition-all duration-500">
            <div className="space-y-6 text-center">
              <div className="flex justify-center gap-1 text-[#00ff66] text-lg">
                ★★★★★
              </div>
              <p className="text-lg sm:text-2xl font-light text-slate-200 leading-relaxed italic font-serif">
                "{REVIEWS[activeReview].text}"
              </p>
              
              <div className="pt-4 flex flex-col items-center gap-2">
                <div className="w-12 h-1 bg-[#00ff66] rounded-full" />
                <h4 className="text-base font-black uppercase italic text-white">{REVIEWS[activeReview].author}</h4>
                <p className="text-xs text-emerald-400 font-mono">{REVIEWS[activeReview].title}</p>
              </div>
            </div>

            {/* Slider Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveReview(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeReview === i ? 'bg-[#00ff66] w-8' : 'bg-emerald-950 hover:bg-emerald-800'
                  }`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          PRICING SECTION — Redesigned with Pulsefit Styling
          ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#080e0a]">
        <PricingSection onSelectPlan={onGetStarted} />
      </section>

      {/* ───────────────────────────────────────────────────────────
          FOOTER SECTION
          ─────────────────────────────────────────────────────────── */}
      <footer className="bg-[#030604] border-t border-emerald-950 py-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00ff66] text-[#050a07] flex items-center justify-center font-bold">
                <Dumbbell className="w-6 h-6 transform -rotate-12" />
              </div>
              <span className="text-2xl font-black uppercase italic tracking-wider text-white font-anton">
                PULSE<span className="text-neon-green">FIT</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              High-Performance Fitness Sanctuary equipped with world-class lifting platforms, bio-analytics, and master coaches.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#00ff66] mb-4">Location & Hours</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>108 Beast Way, Iron District</li>
              <li>Mon–Fri: 5 AM – 11 PM</li>
              <li>Sat–Sun: 6 AM – 10 PM</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#00ff66] mb-4">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><button onClick={onGoToPlanner} className="hover:text-[#00ff66] transition-colors">Free Workout Planner</button></li>
              <li><a href="#classes" className="hover:text-[#00ff66] transition-colors">Class Schedule</a></li>
              <li><a href="#trainers" className="hover:text-[#00ff66] transition-colors">Master Coaches</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#00ff66] mb-4">Beast Tribe Newsletter</h4>
            <p className="text-xs text-slate-400 mb-3 font-light">Get weekly workout routines & macro recipes sent to your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email..."
                className="w-full px-3 py-2 rounded-xl bg-[#080e0a] border border-emerald-900 text-xs text-white placeholder:text-slate-500 focus:border-[#00ff66] focus:outline-none"
              />
              <button
                onClick={() => alert("Subscribed to Pulsefit Tribe Newsletter!")}
                className="px-4 py-2 rounded-xl bg-[#00ff66] text-[#050a07] font-black text-xs uppercase tracking-wider hover:bg-[#34d399] transition-colors"
              >
                Join
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-emerald-950 text-center text-xs text-slate-500 font-mono">
          © {new Date().getFullYear()} PULSEFIT / BEAST GYM Performance Inc. All rights reserved.
        </div>
      </footer>

      {/* ───────────────────────────────────────────────────────────
          VIDEO LIGHTBOX MODAL
          ─────────────────────────────────────────────────────────── */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-orange-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/r233kDWShkA?autoplay=1"
                title="Pulsefit Workout Session"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
