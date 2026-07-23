import React, { useState } from 'react';
import { Calendar, Clock, User, Flame, CheckCircle2, ShieldCheck, Dumbbell, Zap } from 'lucide-react';

interface GymClass {
  id: string;
  title: string;
  category: 'strength' | 'hiit' | 'boxing' | 'yoga';
  time: string;
  duration: string;
  trainer: string;
  intensity: 'High' | 'Extreme' | 'Moderate';
  capacity: number;
  booked: number;
  location: string;
  description: string;
}

const CLASSES: GymClass[] = [
  {
    id: 'c1',
    title: 'Beast Heavy Duty Squat & Deadlift',
    category: 'strength',
    time: '07:00 AM - 08:15 AM',
    duration: '75 mins',
    trainer: 'Coach Rex Steel',
    intensity: 'Extreme',
    capacity: 12,
    booked: 9,
    location: 'Zone A - Power Racks',
    description: 'Barbell fundamentals, velocity monitoring, compound maximum loading, and squat form correction.',
  },
  {
    id: 'c2',
    title: 'Metabolic Beast Burner (HIIT)',
    category: 'hiit',
    time: '08:30 AM - 09:15 AM',
    duration: '45 mins',
    trainer: 'Sarah Vance',
    intensity: 'High',
    capacity: 20,
    booked: 16,
    location: 'Zone C - Turf Arena',
    description: 'Sled pushes, assault bikes, kettlebell snatches, and heart-rate zone conditioning.',
  },
  {
    id: 'c3',
    title: 'Heavy Bag Boxing & Power Strikes',
    category: 'boxing',
    time: '05:30 PM - 06:30 PM',
    duration: '60 mins',
    trainer: 'Tyson Blade',
    intensity: 'Extreme',
    capacity: 15,
    booked: 14,
    location: 'Ring 1 - Combat Room',
    description: 'Footwork drills, 12-round heavy bag combinations, slip rope defense, and core burnout.',
  },
  {
    id: 'c4',
    title: 'Athletic Mobility & Cryo Recovery',
    category: 'yoga',
    time: '07:00 PM - 07:45 PM',
    duration: '45 mins',
    trainer: 'Maya Lin',
    intensity: 'Moderate',
    capacity: 18,
    booked: 8,
    location: 'Zen Suite & Sauna',
    description: 'Deep fascia release, dynamic hip mobility, PNF stretching, and guided diaphragmatic breathing.',
  },
  {
    id: 'c5',
    title: 'Hypertrophy Upper Body Blast',
    category: 'strength',
    time: '06:00 PM - 07:15 PM',
    duration: '75 mins',
    trainer: 'Coach Rex Steel',
    intensity: 'High',
    capacity: 14,
    booked: 11,
    location: 'Zone B - Cable & Dumbbells',
    description: 'Chest dips, mechanical drop sets, lat pullover variations, and arm pump supersets.',
  },
];

export const ClassScheduleSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [bookedIds, setBookedIds] = useState<string[]>([]);
  const [bookingSuccessModal, setBookingSuccessModal] = useState<GymClass | null>(null);

  const filteredClasses = activeCategory === 'all' 
    ? CLASSES 
    : CLASSES.filter((c) => c.category === activeCategory);

  const handleBookClass = (gymClass: GymClass) => {
    if (bookedIds.includes(gymClass.id)) return;
    setBookedIds([...bookedIds, gymClass.id]);
    setBookingSuccessModal(gymClass);
  };

  return (
    <section className="py-20 bg-slate-950/60 border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest backdrop-blur-md mb-3">
              <Calendar className="w-4 h-4 text-blue-400" /> DAILY BEAST SCHEDULE
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-wider text-white">
              CLASS & <span className="text-orange-500">WORKOUT SCHEDULE</span>
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl font-light">
              Reserve your spot in high-intensity small group coaching sessions led by IFBB & CSCS certified trainers.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Classes' },
              { id: 'strength', label: 'Strength & Power' },
              { id: 'hiit', label: 'HIIT & Cardio' },
              { id: 'boxing', label: 'Boxing & Combat' },
              { id: 'yoga', label: 'Mobility & Recovery' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                  activeCategory === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-400 shadow-lg shadow-orange-500/20 scale-105'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((item) => {
            const isBooked = bookedIds.includes(item.id);
            const seatsLeft = item.capacity - item.booked - (isBooked ? 1 : 0);

            return (
              <div 
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-orange-500/40 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col justify-between group backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      item.intensity === 'Extreme'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        : item.intensity === 'High'
                        ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}>
                      <Flame className="w-3 h-3 inline mr-1" />
                      {item.intensity} Intensity
                    </span>

                    <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      {item.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white group-hover:text-orange-400 transition-colors uppercase italic mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 font-light leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <div className="space-y-2 mb-6 pt-4 border-t border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-2 font-semibold">
                        <Clock className="w-4 h-4 text-orange-500" /> Time Slot:
                      </span>
                      <span className="font-mono text-white font-bold">{item.time}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-2 font-semibold">
                        <User className="w-4 h-4 text-blue-400" /> Lead Coach:
                      </span>
                      <span className="text-white font-bold">{item.trainer}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-2 font-semibold">
                        <Dumbbell className="w-4 h-4 text-slate-400" /> Zone:
                      </span>
                      <span className="text-slate-300 font-medium">{item.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-slate-400">Available Spots</span>
                    <span className={`font-mono font-bold ${seatsLeft <= 3 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                      {seatsLeft} of {item.capacity} left
                    </span>
                  </div>

                  {/* Capacity Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-5">
                    <div 
                      className={`h-full rounded-full ${seatsLeft <= 3 ? 'bg-rose-500' : 'bg-gradient-to-r from-orange-500 to-blue-500'}`}
                      style={{ width: `${((item.capacity - seatsLeft) / item.capacity) * 100}%` }}
                    />
                  </div>

                  <button
                    onClick={() => handleBookClass(item)}
                    disabled={isBooked || seatsLeft <= 0}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      isBooked
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                        : seatsLeft <= 0
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-white hover:bg-orange-500 text-black hover:text-white shadow-lg hover:shadow-orange-500/25 hover:scale-[1.02]'
                    }`}
                  >
                    {isBooked ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Spot Reserved!
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" /> Reserve Spot Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Booking Modal Toast */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center mx-auto text-orange-400">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-white uppercase italic">SPOT CONFIRMED!</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              You are officially registered for <span className="text-orange-400 font-bold">{bookingSuccessModal.title}</span> with {bookingSuccessModal.trainer}.
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-left space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Time:</span>
                <span className="text-white font-bold">{bookingSuccessModal.time}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Location:</span>
                <span className="text-orange-400 font-bold">{bookingSuccessModal.location}</span>
              </div>
            </div>

            <button
              onClick={() => setBookingSuccessModal(null)}
              className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 font-black text-white text-xs uppercase tracking-widest shadow-lg shadow-orange-500/30 transition-all"
            >
              Great, Let's Lift!
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
