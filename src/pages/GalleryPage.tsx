/* ─────────────────────────────────────────────────────────────────────────
   BEAST GYM (PULSEFIT STYLED) — Gallery Page
   Featuring Pexels/Unsplash High-Res Gym Stock Photos
   Electric Green & Black aesthetic with category filters & image lightbox popup
───────────────────────────────────────────────────────────────────────── */
import React, { useEffect, useRef, useState } from 'react';
import { Camera, Filter, ZoomIn, X } from 'lucide-react';

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

// ── Pexels High-Quality Gym Images Collection ──
const GALLERY_ITEMS = [
  {
    id: 'g1',
    category: 'Equipment',
    title: 'Olympic Power Racks & Deadlift Platforms',
    location: 'Zone A — Heavy Lifting Floor',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    span: 'col-span-2 row-span-2',
    desc: '24+ Calibrated Hammer Strength platforms, steel plates up to 250kg, velocity sensors, and power cages.',
  },
  {
    id: 'g2',
    category: 'Classes',
    title: 'High-Intensity Battle Rope & HIIT Arena',
    location: 'Metabolic Turf Arena',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=1200&auto=format&fit=crop',
    span: '',
    desc: '5,000 sq ft turf arena for assault bikes, sled pushes, battle ropes, and heart-rate zone group sessions.',
  },
  {
    id: 'g3',
    category: 'Recovery',
    title: 'Infrared Sauna & Contrast Cryo Chambers',
    location: 'Bio-Recovery Suite',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop',
    span: '',
    desc: 'Full-spectrum infrared saunas and 12°C contrast ice baths for accelerated muscle repair.',
  },
  {
    id: 'g4',
    category: 'Classes',
    title: 'Pro Boxing & Combat Ring',
    location: 'Ring-Side Arena',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1200&auto=format&fit=crop',
    span: '',
    desc: 'Full-size competition boxing ring and heavy bags for Muay Thai, boxing, and combat conditioning.',
  },
  {
    id: 'g5',
    category: 'Equipment',
    title: 'Cable & Machine Functional Floor',
    location: 'Zone B — Cable Station',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    span: '',
    desc: 'Dual-adjustable pulleys, isolateral chest presses, and pin-selected machines for isolation work.',
  },
  {
    id: 'g6',
    category: 'Community',
    title: 'Member Transformation & Champion Wall',
    location: 'Main Concourse',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop',
    span: 'col-span-2',
    desc: 'Celebrating 340+ competition podium finishes and 5,000+ member transformations.',
  },
  {
    id: 'g7',
    category: 'Recovery',
    title: 'Ice Bath Cryo Chambers',
    location: 'Hydro-Recovery Lab',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop',
    span: '',
    desc: 'Temperature-regulated ice plunge tubs maintained at sub-14°C to reduce inflammation post-session.',
  },
  {
    id: 'g8',
    category: 'Classes',
    title: 'Mindfulness, Yoga & Mobility Studio',
    location: 'Studio 3',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    span: '',
    desc: 'Ambient lighting, bamboo flooring, and mobility apparatus for active recovery and flexibility.',
  },
  {
    id: 'g9',
    category: 'Equipment',
    title: 'Cardio Bay — Bikes, Rowers & SkiErgs',
    location: 'Level 2 Mezzanine',
    image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=1200&auto=format&fit=crop',
    span: '',
    desc: 'Concept2 rowers, SkiErgs, Wattbikes, and Woodway treadmills synced to real-time bio telemetry.',
  },
];

const CATEGORIES = ['All', 'Equipment', 'Classes', 'Recovery', 'Community'];

function GalleryCard({
  item,
  delay,
  onClick,
}: {
  item: typeof GALLERY_ITEMS[0];
  delay: number;
  onClick: () => void;
}) {
  const { ref, visible } = useScrollReveal();

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`relative rounded-3xl overflow-hidden border border-emerald-900/60 hover:border-[#00ff66] transition-all duration-500 cursor-pointer group shadow-2xl ${item.span}`}
      style={{
        minHeight: item.span.includes('row-span-2') ? '380px' : '220px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.92)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {/* Background Stock Image */}
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
      />

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050a07] via-[#050a07]/50 to-transparent group-hover:via-[#050a07]/30 transition-all duration-300" />

      {/* Badge & Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-[#050a07]/80 border border-[#00ff66]/40 text-[#00ff66] text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
            {item.category}
          </span>
          <div className="w-9 h-9 rounded-full bg-[#00ff66] text-[#050a07] flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
            <ZoomIn className="w-5 h-5 font-bold" />
          </div>
        </div>

        <div>
          <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest">{item.location}</p>
          <h3 className="font-black italic uppercase text-white text-base sm:text-lg group-hover:text-[#00ff66] transition-colors mt-0.5">
            {item.title}
          </h3>
        </div>
      </div>
    </div>
  );
}

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeImage, setActiveImage] = useState<typeof GALLERY_ITEMS[0] | null>(null);

  const filtered = activeCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(g => g.category === activeCategory);

  return (
    <div className="min-h-screen text-white bg-[#050a07]">

      {/* Hero */}
      <section className="py-24 px-4 bg-[#050a07] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff66]/10 rounded-full blur-[140px]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-xs font-black uppercase tracking-widest">
            <Camera className="w-4 h-4" /> PEXELS GYM GALLERY
          </span>
          <h1 className="text-5xl sm:text-7xl font-black uppercase italic tracking-wider text-white font-anton">
            INSIDE THE <span className="text-neon-green">SANCTUARY</span>
          </h1>
          <p className="text-slate-300 font-light max-w-xl mx-auto">
            22,000 square feet of high-intensity performance space captured in raw detail. Every rack, turf, and recovery chamber is built to break limits.
          </p>
        </div>
      </section>

      {/* Filter Row */}
      <section className="py-6 px-4 bg-[#080e0a] border-y border-emerald-900/40 sticky top-16 z-20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 justify-center">
          <Filter className="w-4 h-4 text-emerald-400 mr-1" />
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                activeCategory === c
                  ? 'bg-[#00ff66] border-[#00ff66] text-[#050a07] shadow-lg shadow-[#00ff66]/25 scale-105'
                  : 'bg-[#0f1c14] border-emerald-900/60 text-slate-300 hover:border-[#00ff66]/50 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry-style Image Grid */}
      <section className="py-12 px-4 bg-[#080e0a]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 auto-rows-[220px]">
          {filtered.map((item, i) => (
            <GalleryCard
              key={item.id}
              item={item}
              delay={i * 60}
              onClick={() => setActiveImage(item)}
            />
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-16 px-4 bg-[#050a07] border-t border-emerald-900/40">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { v: '22,000', l: 'Sq Ft Total Area' },
            { v: '80+', l: 'Equipment Stations' },
            { v: '3', l: 'Recovery Suites' },
            { v: '10+', l: 'Training Zones' },
          ].map(s => (
            <div key={s.l} className="p-6 rounded-2xl bg-[#080e0a] border border-emerald-900/40">
              <p className="text-4xl font-black text-[#00ff66] italic font-anton">{s.v}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── IMAGE LIGHTBOX POPUP MODAL ── */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-[#050a07]/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-[#080e0a] border border-[#00ff66]/40 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#050a07]/80 border border-emerald-900 text-white flex items-center justify-center hover:bg-[#00ff66] hover:text-[#050a07] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* High-Res Image Preview */}
            <div className="relative h-[400px] sm:h-[500px]">
              <img
                src={activeImage.image}
                alt={activeImage.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080e0a] via-transparent to-transparent" />
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8 space-y-3 bg-[#080e0a]">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#00ff66]/15 border border-[#00ff66]/40 text-[#00ff66] text-xs font-black uppercase tracking-widest">
                  {activeImage.category}
                </span>
                <span className="text-xs text-emerald-400 font-mono">{activeImage.location}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black italic uppercase text-white">
                {activeImage.title}
              </h3>
              <p className="text-sm text-slate-300 font-light leading-relaxed">
                {activeImage.desc}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
