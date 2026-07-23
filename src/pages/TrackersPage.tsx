import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Droplet, 
  Moon, 
  Footprints, 
  Bell
} from 'lucide-react';

export const TrackersPage: React.FC = () => {
  const [waterTotal, setWaterTotal] = useState(1750);
  const [sleepHours, setSleepHours] = useState('7.5');
  const [stepsCount, setStepsCount] = useState('8420');
  const [reminders, setReminders] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const [nRes, rRes] = await Promise.all([
        api.getTodayNutrition(),
        api.getReminders()
      ]);
      setWaterTotal(nRes.waterMl || 0);
      setReminders(rRes);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddWater = async (amt: number) => {
    try {
      const res = await api.logWater(amt);
      setWaterTotal(res.totalMl);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSleepSteps = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.logSleepSteps({ sleep_hours: sleepHours, steps_count: stepsCount });
      alert('Sleep and Steps data logged!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleReminder = async (type: string, timeStr: string, currentEnabled: number) => {
    try {
      await api.toggleReminder({ reminder_type: type, time_str: timeStr, is_enabled: !currentEnabled });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-10 animate-in fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Droplet className="w-6 h-6 text-cyan-400" /> Daily Trackers & Reminders
        </h2>
        <p className="text-xs text-slate-400 mt-1">Log hydration, sleep duration, daily steps, and manage notification schedules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Water Tracker Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-cyan-400" /> Hydration Tracker
            </h3>
            <span className="text-xs font-bold text-cyan-400">{waterTotal} / 2500 ml</span>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center space-y-2">
            <p className="text-3xl font-extrabold text-cyan-300">{waterTotal} ml</p>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full transition-all" style={{ width: `${Math.min(100, (waterTotal / 2500) * 100)}%` }} />
            </div>
            <p className="text-[11px] text-cyan-400 font-medium">{Math.max(0, 2500 - waterTotal)} ml left for today's goal</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[250, 500, 750].map((amt) => (
              <button
                key={amt}
                onClick={() => handleAddWater(amt)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 transition-colors border border-slate-700"
              >
                +{amt}ml
              </button>
            ))}
          </div>
        </div>

        {/* Sleep & Step Tracker Form */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Moon className="w-4 h-4 text-indigo-400" /> Sleep & Daily Steps
          </h3>

          <form onSubmit={handleSaveSleepSteps} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-indigo-400" /> Sleep Duration (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5 text-emerald-400" /> Step Counter
              </label>
              <input
                type="number"
                value={stepsCount}
                onChange={(e) => setStepsCount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-bold text-slate-950 text-xs shadow-md transition-transform hover:scale-[1.02]"
            >
              Log Sleep & Steps
            </button>
          </form>
        </div>

        {/* Reminders & Alerts Settings */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-amber-400" /> Reminder Alerts
          </h3>

          <div className="space-y-3">
            {[
              { type: 'workout', label: 'Workout Reminder 🏋️', time: '08:00 AM' },
              { type: 'water', label: 'Water Hydration 💧', time: '11:00 AM' },
              { type: 'meal', label: 'Meal Logging 🥗', time: '01:00 PM' }
            ].map((r) => {
              const rem = reminders.find(item => item.reminder_type === r.type);
              const enabled = rem ? rem.is_enabled === 1 : true;
              return (
                <div key={r.type} className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-200 text-xs">{r.label}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{r.time}</p>
                  </div>

                  <button
                    onClick={() => handleToggleReminder(r.type, r.time, enabled ? 1 : 0)}
                    className={`w-10 h-6 rounded-full transition-colors relative ${enabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-slate-950 transition-transform ${enabled ? 'left-5' : 'left-1'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
