import React, { useState } from 'react';
import { Flame, Trophy, CheckCircle2, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Transformation {
  id: string;
  name: string;
  age: number;
  duration: string;
  weightLost: string;
  muscleGained: string;
  program: string;
  quote: string;
  beforeLabel: string;
  afterLabel: string;
  beforeStats: string;
  afterStats: string;
  rating: number;
}

const TRANSFORMATIONS: Transformation[] = [
  {
    id: '1',
    name: 'Marcus Vance',
    age: 29,
    duration: '16 Weeks',
    weightLost: '18 kg (40 lbs)',
    muscleGained: '+5.5 kg Muscle',
    program: 'Beast Hypertrophy & Shred',
    quote: "Beast Gym completely reshaped my discipline. The trainers and bio-tracking tools pushed me to limits I didn't know I possessed.",
    beforeLabel: 'Day 1 — 102 kg',
    afterLabel: 'Week 16 — 84 kg',
    beforeStats: '28% Body Fat',
    afterStats: '10.5% Body Fat',
    rating: 5,
  },
  {
    id: '2',
    name: 'Elena Rostova',
    age: 26,
    duration: '12 Weeks',
    weightLost: '12 kg (26 lbs)',
    muscleGained: '+3.2 kg Lean Mass',
    program: 'HIIT Conditioning & Glute Power',
    quote: "The energy at Beast Gym is electric! The class schedules, coaching, and nutrition macros made my transformation seamless.",
    beforeLabel: 'Day 1 — 74 kg',
    afterLabel: 'Week 12 — 62 kg',
    beforeStats: '31% Body Fat',
    afterStats: '16% Body Fat',
    rating: 5,
  },
  {
    id: '3',
    name: 'Vikram Singh',
    age: 34,
    duration: '20 Weeks',
    weightLost: '22 kg (48 lbs)',
    muscleGained: '+8.0 kg Pure Strength',
    program: 'Beast Powerlifting & Macro Protocol',
    quote: "I broke through a 3-year plateau within my first month. The 3D form tracking and customized Indian high-protein diet plan were game changers.",
    beforeLabel: 'Day 1 — 110 kg',
    afterLabel: 'Week 20 — 88 kg',
    beforeStats: '33% Body Fat',
    afterStats: '12% Body Fat',
    rating: 5,
  },
];

export const TransformationGallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100

  const activeItem = TRANSFORMATIONS[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TRANSFORMATIONS.length);
    setSliderPos(50);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TRANSFORMATIONS.length) % TRANSFORMATIONS.length);
    setSliderPos(50);
  };

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-widest backdrop-blur-md">
            <Trophy className="w-4 h-4 text-orange-500" /> REAL RESULTS, ZERO EXCUSES
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-wider text-white">
            TRANSFORMATION <span className="text-orange-500">HALL OF FAME</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Drag the interactive slider below to reveal real member transformations achieved through Beast Gym's high-performance training and macro nutrition protocols.
          </p>
        </div>

        {/* Gallery Interactive Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/90 border border-orange-500/25 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Interactive Before/After Visualizer */}
          <div className="lg:col-span-7 relative h-[360px] sm:h-[440px] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl select-none group">
            
            {/* Background After State */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-500 to-orange-400 flex items-center justify-center mb-4 shadow-xl shadow-orange-500/30 animate-pulse">
                <Flame className="w-12 h-12 text-white" />
              </div>
              <span className="px-4 py-1.5 rounded-full bg-orange-500 text-white font-black text-xs uppercase tracking-widest mb-2">
                AFTER ({activeItem.afterLabel})
              </span>
              <p className="text-3xl font-black text-white">{activeItem.afterStats}</p>
              <p className="text-xs text-orange-400 font-bold mt-1 uppercase tracking-wider">{activeItem.muscleGained}</p>
            </div>

            {/* Overlay Before State with Clip Path */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center border-r-2 border-orange-500"
              style={{ width: `${sliderPos}%`, overflow: 'hidden' }}
            >
              <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center mb-4">
                <span className="text-3xl font-black text-slate-400">DAY 1</span>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-widest mb-2 whitespace-nowrap">
                BEFORE ({activeItem.beforeLabel})
              </span>
              <p className="text-3xl font-black text-slate-300 whitespace-nowrap">{activeItem.beforeStats}</p>
              <p className="text-xs text-slate-400 font-semibold mt-1 uppercase tracking-wider whitespace-nowrap">Starting Point</p>
            </div>

            {/* Interactive Slider Line Control */}
            <input 
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />

            {/* Visual Divider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-orange-500 pointer-events-none z-20 shadow-[0_0_15px_#ff5722]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-orange-500 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-black">
                ↔
              </div>
            </div>

            <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-[10px] text-slate-300 font-mono z-10">
              Drag slider left / right
            </div>
          </div>

          {/* Right Column: Member Story Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-white italic uppercase">{activeItem.name}, {activeItem.age}</h3>
                <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mt-0.5">{activeItem.program}</p>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: activeItem.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />
                ))}
              </div>
            </div>

            <p className="text-sm text-slate-300 font-light italic leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              "{activeItem.quote}"
            </p>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Weight Reduced</p>
                <p className="text-xl font-black text-orange-400 mt-1">{activeItem.weightLost}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Timeframe</p>
                <p className="text-xl font-black text-blue-400 mt-1">{activeItem.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Verified Beast Gym Member Transformation</span>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex gap-1.5">
                {TRANSFORMATIONS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setActiveIndex(idx); setSliderPos(50); }}
                    className={`h-2.5 rounded-full transition-all ${idx === activeIndex ? 'w-8 bg-orange-500' : 'w-2.5 bg-slate-700'}`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-orange-500 text-white transition-colors border border-slate-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-orange-500 text-white transition-colors border border-slate-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
