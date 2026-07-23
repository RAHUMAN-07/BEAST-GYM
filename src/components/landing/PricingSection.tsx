import React, { useState } from 'react';
import { Zap, Check, ShieldCheck, ArrowRight } from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  badge?: string;
  isPopular?: boolean;
  description: string;
  features: string[];
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Day Pass / Trial',
    monthlyPrice: 15,
    annualPrice: 15,
    description: 'Full single-day access to gym facilities, lockers, and bio-scanners.',
    features: [
      'Full Gym Floor & Free Weights Access',
      'Locker & Sauna Access',
      '1x Protein Shake Voucher',
      'FitPulse App Trial Access',
    ],
  },
  {
    id: 'beast-pro',
    name: 'Beast Pro Membership',
    monthlyPrice: 49,
    annualPrice: 39,
    badge: 'MOST POPULAR',
    isPopular: true,
    description: 'Unlimited facility access, group classes, macro tracking & 3D body analytics.',
    features: [
      'Unlimited 24/7 Beast Gym Access',
      'All Daily HIIT, Strength & Boxing Classes',
      'Personalized Mifflin-St Jeor Macro Plan',
      'Indian & Global High-Protein Diet Database',
      'Form Guidance & Workout Timers',
      'Monthly InBody Composition Scan',
    ],
  },
  {
    id: 'beast-vip',
    name: 'Beast VIP Pass',
    monthlyPrice: 89,
    annualPrice: 71,
    badge: 'ULTIMATE PERFORMANCE',
    description: 'All-inclusive VIP experience with 1-on-1 personal coaching & cryo recovery.',
    features: [
      'Everything in Beast Pro Plan',
      '2x Monthly 1-on-1 Trainer Coaching Sessions',
      'Unlimited Infrared Sauna & Cryo Recovery',
      'Custom Weekly Grocery List Generator',
      'Dedicated Locker & Beast Apparel Pack',
      'Priority Class & Equipment Reservations',
    ],
  },
];

interface PricingSectionProps {
  onSelectPlan: (planName: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className="py-20 bg-[#050a07] border-t border-emerald-900/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-xs font-black uppercase tracking-widest backdrop-blur-md">
            <Zap className="w-4 h-4 text-[#00ff66]" /> TRANSPARENT MEMBERSHIP PLANS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-wider text-white font-anton">
            JOIN THE <span className="text-[#00ff66]">BEAST TRIBE</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light">
            No hidden contracts. No cancellation fees. Choose your training tier and unlock your peak performance.
          </p>

          {/* Billing Toggle (Monthly / Annual) */}
          <div className="pt-4 flex items-center justify-center gap-4">
            <span className={`text-xs font-black uppercase tracking-wider ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>
              Monthly Billing
            </span>
            
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-16 h-9 rounded-full bg-[#080e0a] border border-[#00ff66]/40 p-1 relative transition-colors shadow-inner"
            >
              <div 
                className={`w-7 h-7 rounded-full bg-[#00ff66] shadow-md transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-black uppercase tracking-wider ${isAnnual ? 'text-white' : 'text-slate-400'}`}>
                Annual Billing
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#00ff66] text-[#050a07] font-black text-[10px] uppercase tracking-widest animate-bounce">
                SAVE 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_TIERS.map((tier) => {
            const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;

            return (
              <div
                key={tier.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  tier.isPopular
                    ? 'bg-gradient-to-b from-[#080e0a] via-[#0f1c14] to-[#050a07] border-2 border-[#00ff66] shadow-2xl shadow-[#00ff66]/20 lg:-translate-y-2'
                    : 'bg-[#080e0a] border border-emerald-900/60 hover:border-[#00ff66]/40 shadow-xl'
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#00ff66] text-[#050a07] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#00ff66]/30">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-black text-white uppercase italic mb-2">{tier.name}</h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed mb-6">{tier.description}</p>

                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-white">${price}</span>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      {tier.id === 'starter' ? '/ pass' : '/ month'}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8 pt-6 border-t border-emerald-900/60">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#00ff66]">Included Perks:</p>
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <div className="w-4 h-4 rounded-full bg-[#00ff66]/20 text-[#00ff66] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onSelectPlan(tier.name)}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    tier.isPopular
                      ? 'bg-[#00ff66] hover:bg-[#34d399] text-[#050a07] shadow-xl shadow-[#00ff66]/30 hover:scale-105'
                      : 'bg-white hover:bg-slate-200 text-black shadow-lg hover:scale-105'
                  }`}
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Guarantee Callout */}
        <div className="mt-12 p-6 rounded-2xl bg-[#080e0a] border border-emerald-900/60 text-center flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-400">
          <ShieldCheck className="w-6 h-6 text-[#00ff66] flex-shrink-0" />
          <span><strong>14-Day Beast Satisfaction Guarantee:</strong> If you don't feel stronger within your first 14 days, get a 100% full refund with zero questions asked.</span>
        </div>

      </div>
    </section>
  );
};
