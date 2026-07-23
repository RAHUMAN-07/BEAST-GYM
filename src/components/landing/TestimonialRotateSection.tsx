import React from 'react';
import { Star, Quote, Award, CheckCircle2 } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  metric: string;
  avatar: string;
  badge: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'David Miller',
    role: 'Powerlifter & Member',
    quote: 'The equipment quality at Beast Gym is second to none. The heavy platforms, calibrated plates, and coaching pushed my total by 80 lbs.',
    rating: 5,
    metric: '+80 lbs Squat Total',
    avatar: '🏋️',
    badge: 'Verified Lifter',
  },
  {
    id: '2',
    name: 'Sophia Chen',
    role: 'HIIT Athlete',
    quote: 'I lost 25 lbs in 3 months while building serious athletic conditioning. The high-energy community and coaches make workouts addicting.',
    rating: 5,
    metric: '-25 lbs Body Fat',
    avatar: '⚡',
    badge: 'Beast Shredder',
  },
  {
    id: '3',
    name: 'Rohan Sharma',
    role: 'Bodybuilding Competitor',
    quote: 'The personalized Indian macro plans and bio-analytics eliminated guesswork. I hit single-digit body fat for my first stage show.',
    rating: 5,
    metric: '8.5% Body Fat Peak',
    avatar: '🏆',
    badge: 'Physique Pro',
  },
];

export const TestimonialRotateSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#0f172a] relative overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-widest backdrop-blur-md">
            <Award className="w-4 h-4 text-orange-500" /> MEMBER REVIEWS & REPUTATION
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-wider text-white">
            WHAT THE <span className="text-orange-500">TRIBE SAYS</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light">
            Real feedback from dedicated athletes who transformed their body and mindset at Beast Gym.
          </p>
        </div>

        {/* Testimonial Rotate-In Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 rounded-3xl p-8 transition-all duration-500 animate-rotate-in hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/15 flex flex-col justify-between group backdrop-blur-md relative"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="space-y-4">
                {/* Quote Icon & Stars */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <Quote className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-slate-300 font-light italic leading-relaxed pt-2">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {item.avatar}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white uppercase italic group-hover:text-orange-400 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">{item.role}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="px-2.5 py-1 rounded-lg bg-orange-500/15 text-orange-400 font-mono font-bold border border-orange-500/30">
                    {item.metric}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {item.badge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
