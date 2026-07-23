import React, { useState } from 'react';
import { Award, MessageSquare, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface Trainer {
  id: string;
  name: string;
  role: string;
  certifications: string[];
  specialties: string[];
  clientsTransformed: number;
  experience: string;
  quote: string;
  avatar: string;
  bio: string;
}

const TRAINERS: Trainer[] = [
  {
    id: 't1',
    name: 'Rex "The Anvil" Steel',
    role: 'Head Strength & Hypertrophy Director',
    certifications: ['CSCS', 'IFBB Pro Coach', 'USA Powerlifting Level 2'],
    specialties: ['Compound Hypertrophy', 'Deadlift & Squat Mechanics', 'Prep Coaching'],
    clientsTransformed: 340,
    experience: '12 Years',
    quote: 'Heavy weight builds unbreakable muscle; iron discipline builds an unbreakable mind.',
    avatar: '🏋️‍♂️',
    bio: 'Former national powerlifting champion specializing in periodized heavy compound progression and elite physique sculpting.',
  },
  {
    id: 't2',
    name: 'Sarah Vance',
    role: 'Lead Conditioning & HIIT Specialist',
    certifications: ['NASM CPT', 'CrossFit Level 3', 'Precision Nutrition L2'],
    specialties: ['Metabolic Conditioning', 'Fat Loss Protocols', 'Glute & Leg Sculpting'],
    clientsTransformed: 280,
    experience: '8 Years',
    quote: 'Excuses don’t burn calories. Sweat, focus, and consistency produce unshakeable results.',
    avatar: '🏃‍♀️',
    bio: 'Metabolic rate expert dedicated to pushing cardiovascular threshold and body composition optimization.',
  },
  {
    id: 't3',
    name: 'Tyson "The Blade" Ruiz',
    role: 'Combat Athletics & Striking Coach',
    certifications: ['Golden Gloves Champion', 'CSCS', 'Muay Thai Master Kru'],
    specialties: ['Boxing Footwork', 'Heavy Bag Power Conditioning', 'Core & Agility'],
    clientsTransformed: 210,
    experience: '10 Years',
    quote: 'Speed kills, power paralyzes, but endurance wins the long war.',
    avatar: '🥊',
    bio: 'Professional boxing trainer bringing fight-camp intensity to everyday athletes seeking explosive functional power.',
  },
  {
    id: 't4',
    name: 'Dr. Aris Thorne',
    role: 'Bio-Mechanics & Recovery Director',
    certifications: ['DPT (Doctor of Physical Therapy)', 'FMS Level 2', 'CSCS'],
    specialties: ['Joint Longevity', 'Postural Correction', 'Active Tissue Release'],
    clientsTransformed: 195,
    experience: '9 Years',
    quote: 'Train hard, recover harder. Optimize your biomechanics to prevent injury and unlock peak force output.',
    avatar: '🩺',
    bio: 'Doctor of physical therapy blending rehabilitation protocols with heavy strength training.',
  },
];

export const TrainerProfilesSection: React.FC = () => {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [bookedTrainer, setBookedTrainer] = useState<string | null>(null);

  const handleBookSession = (trainer: Trainer) => {
    setBookedTrainer(trainer.name);
    setTimeout(() => {
      setBookedTrainer(null);
      setSelectedTrainer(null);
    }, 2500);
  };

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-widest backdrop-blur-md">
            <Award className="w-4 h-4 text-orange-500" /> WORLD-CLASS ATHLETIC COACHES
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-wider text-white">
            MEET THE <span className="text-orange-500">BEAST COACHES</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light">
            Our certified master trainers are elite athletes and biomechanists dedicated to guiding your transformation.
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRAINERS.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-orange-500/15 flex flex-col justify-between group backdrop-blur-md relative"
            >
              <div>
                {/* Avatar Icon / Graphic */}
                <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 group-hover:border-orange-500/40 transition-all shadow-inner">
                  {trainer.avatar}
                </div>

                <h3 className="text-xl font-black text-white uppercase italic group-hover:text-orange-400 transition-colors">
                  {trainer.name}
                </h3>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
                  {trainer.role}
                </p>

                {/* Certifications Badge */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {trainer.certifications.map((cert, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-slate-300 border border-slate-800">
                      {cert}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-400 font-light leading-relaxed italic mb-4">
                  "{trainer.quote}"
                </p>
              </div>

              <div>
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs mb-4">
                  <span className="text-slate-400">Transformed</span>
                  <span className="font-mono font-bold text-orange-400">{trainer.clientsTransformed}+ Athletes</span>
                </div>

                <button
                  onClick={() => setSelectedTrainer(trainer)}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-orange-500 text-white font-extrabold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-1 group-hover:shadow-lg"
                >
                  Book 1-on-1 Session <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Trainer Consultation Drawer Modal */}
      {selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedTrainer(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {bookedTrainer ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase italic">SESSION BOOKED!</h3>
                <p className="text-sm text-slate-300">
                  Your 1-on-1 consultation with <span className="text-orange-400 font-bold">{bookedTrainer}</span> has been confirmed. Our team will contact you within 2 hours.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center text-3xl">
                    {selectedTrainer.avatar}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase italic">{selectedTrainer.name}</h3>
                    <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">{selectedTrainer.role}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-light bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  {selectedTrainer.bio}
                </p>

                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Core Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainer.specialties.map((spec, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                        ✓ {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleBookSession(selectedTrainer)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Confirm Free 30-Min Strategy Call
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
