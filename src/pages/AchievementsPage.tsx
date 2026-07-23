import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Achievement } from '../types';
import { Trophy, Lock } from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    api.getProgressSummary().then(res => setAchievements(res.achievements || []));
  }, []);

  const allBadges = [
    { key: 'first_step', title: 'First Step', desc: 'Registered and initialized fitness profile', icon: '🏆' },
    { key: 'water_warrior', title: 'Hydration Hero', desc: 'Logged over 2,000ml of water in a day', icon: '💧' },
    { key: 'first_workout', title: 'First Workout Complete', desc: 'Logged your very first workout session', icon: '🏋️' },
    { key: 'workout_5', title: 'Consistent Beast', desc: 'Completed 5 full workout sessions', icon: '🔥' },
    { key: 'macro_master', title: 'Macro Master', desc: 'Hit 100% of daily protein target', icon: '🥗' },
    { key: 'streak_7', title: '7-Day Iron Streak', desc: 'Logged activity 7 days in a row', icon: '⚡' }
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-10 animate-in fade-in">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" /> Milestones & Achievements
        </h2>
        <p className="text-xs text-slate-400 mt-1">Unlock gamified trophies by staying consistent with your workouts and diet</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {allBadges.map((badge) => {
          const isUnlocked = achievements.some(a => a.badge_key === badge.key || a.title === badge.title);
          return (
            <div
              key={badge.key}
              className={`p-6 rounded-3xl border flex flex-col items-center text-center space-y-3 transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-amber-500/40 shadow-xl shadow-amber-500/5'
                  : 'bg-slate-900/60 border-slate-800 opacity-60'
              }`}
            >
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-inner ${
                isUnlocked ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-slate-800 border border-slate-700'
              }`}>
                {isUnlocked ? badge.icon : <Lock className="w-6 h-6 text-slate-500" />}
              </div>

              <div>
                <h4 className={`font-extrabold text-base ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>{badge.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{badge.desc}</p>
              </div>

              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                isUnlocked
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-800 text-slate-500'
              }`}>
                {isUnlocked ? 'Unlocked ✓' : 'Locked'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
