import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Workout } from '../types';
import { 
  Flame, 
  Dumbbell, 
  Droplet, 
  Trophy, 
  TrendingUp, 
  PlusCircle, 
  Play
} from 'lucide-react';

interface DashboardPageProps {
  onStartWorkout: (workout: Workout) => void;
  onOpenMealLogger: () => void;
  onOpenWeightLogger: () => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onStartWorkout,
  onOpenMealLogger,
  onOpenWeightLogger,
  setActiveTab
}) => {
  const { user, profile, goal } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [nutrition, setNutrition] = useState<any>(null);
  const [progressSummary, setProgressSummary] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [wRes, nRes, pRes] = await Promise.all([
        api.getMyPlan(),
        api.getTodayNutrition(),
        api.getProgressSummary()
      ]);
      setWorkouts(wRes);
      setNutrition(nRes);
      setProgressSummary(pRes);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuickWater = async (amount: number) => {
    try {
      await api.logWater(amount);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const todayWorkout = workouts.length > 0 ? workouts[0] : null;

  const targetCal = goal?.tdee_calories || 2200;
  const consumedCal = nutrition?.totals?.calories || 0;
  const calRemaining = Math.max(0, targetCal - consumedCal);
  const calPercent = Math.min(100, Math.round((consumedCal / targetCal) * 100));

  const waterMl = nutrition?.waterMl || 0;

  return (
    <div className="space-y-6 pb-20 md:pb-10 animate-in fade-in">
      {/* Motivation Header Banner */}
      <div className="p-6 rounded-3xl bg-neutral-950 border border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-extrabold uppercase mb-2 border border-orange-500/30 tracking-wider">
            <Flame className="w-3.5 h-3.5 text-orange-500" /> BEAST MODE ATHLETE
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider italic">
            Welcome back, <span className="text-orange-400">{user?.name}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
            Goal: <span className="text-white font-bold">{goal?.goal_type || 'Strength & Hypertrophy'}</span> • Keep dominating your targets
          </p>
        </div>

        {/* Streak & Rank */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-black border border-white/15 text-center shadow-lg">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Workout Streak</p>
            <p className="text-xl font-extrabold text-white flex items-center justify-center gap-1">
              🔥 {progressSummary?.streak || 1} Days
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Workout & Calories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Workout Card */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-950 border border-white/15 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-white" /> Scheduled Session
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold border border-white/20 uppercase tracking-wider">
                {todayWorkout ? todayWorkout.type.toUpperCase() : 'GYM'}
              </span>
            </div>

            {todayWorkout ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-extrabold text-white uppercase tracking-wider">{todayWorkout.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {todayWorkout.exercises?.length || 3} Core Exercises • {todayWorkout.duration_mins} Minutes Target
                  </p>
                </div>

                <div className="space-y-2">
                  {todayWorkout.exercises?.slice(0, 3).map((ex, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-black border border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white uppercase tracking-wider">{ex.exercise_name}</p>
                        <p className="text-[11px] text-slate-400">{ex.sets} Sets × {ex.reps} Reps</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{ex.muscle_group}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4">No workout assigned yet. Complete profile setup!</p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('workouts')}
              className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider"
            >
              View Full Plan
            </button>

            {todayWorkout && (
              <button
                onClick={() => onStartWorkout(todayWorkout)}
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-200 font-black text-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-black text-black" /> Start Session Now
              </button>
            )}
          </div>
        </div>

        {/* Today's Calorie & Macro Target Card */}
        <div className="p-6 rounded-3xl bg-neutral-950 border border-white/15 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-white" /> Daily Caloric Progress
            </h3>
            <button onClick={onOpenMealLogger} className="p-1 text-white hover:bg-neutral-900 rounded-lg">
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Calorie Progress Ring / Bar */}
          <div className="p-4 rounded-2xl bg-black border border-white/10 text-center space-y-2">
            <p className="text-3xl font-black text-white">{consumedCal} <span className="text-xs font-normal text-slate-400">/ {targetCal} kcal</span></p>
            <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all"
                style={{ width: `${calPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">{calRemaining} kcal remaining today</p>
          </div>

          {/* Macros Breakdown Bars */}
          <div className="space-y-2.5 text-xs font-mono">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-white">Protein</span>
                <span className="text-slate-400">{nutrition?.totals?.protein || 0} / {goal?.target_protein || 140}g</span>
              </div>
              <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-white h-full" style={{ width: `${Math.min(100, ((nutrition?.totals?.protein || 0) / (goal?.target_protein || 140)) * 100)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Carbs</span>
                <span className="text-slate-400">{nutrition?.totals?.carbs || 0} / {goal?.target_carbs || 220}g</span>
              </div>
              <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-300 h-full" style={{ width: `${Math.min(100, ((nutrition?.totals?.carbs || 0) / (goal?.target_carbs || 220)) * 100)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-400">Fats</span>
                <span className="text-slate-400">{nutrition?.totals?.fats || 0} / {goal?.target_fats || 60}g</span>
              </div>
              <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-500 h-full" style={{ width: `${Math.min(100, ((nutrition?.totals?.fats || 0) / (goal?.target_fats || 60)) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Trackers & Achievements Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Water Intake Quick Card */}
        <div className="p-5 rounded-3xl bg-neutral-950 border border-white/15 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Water Intake</p>
              <p className="text-lg font-extrabold text-white">{waterMl} <span className="text-xs font-normal text-slate-400">/ 2500 ml</span></p>
            </div>
          </div>

          <button
            onClick={() => handleQuickWater(250)}
            className="px-3 py-2 rounded-xl bg-white text-black hover:bg-slate-200 text-xs font-bold transition-colors flex items-center gap-1 uppercase tracking-wider"
          >
            +250ml
          </button>
        </div>

        {/* Quick Weight Log Card */}
        <div className="p-5 rounded-3xl bg-neutral-950 border border-white/15 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Current Weight</p>
              <p className="text-lg font-extrabold text-white">{profile?.weight_kg || 70} kg</p>
            </div>
          </div>

          <button
            onClick={onOpenWeightLogger}
            className="px-3 py-2 rounded-xl bg-black hover:bg-neutral-900 text-white text-xs font-bold transition-colors border border-white/10 uppercase tracking-wider"
          >
            Log Weight
          </button>
        </div>

        {/* Badges Preview */}
        <div className="p-5 rounded-3xl bg-neutral-950 border border-white/15 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Unlocked Badges</p>
              <p className="text-lg font-extrabold text-white">{progressSummary?.achievements?.length || 2} Badges</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('achievements')}
            className="text-xs font-bold text-white hover:underline uppercase tracking-wider"
          >
            View Badges
          </button>
        </div>

      </div>
    </div>
  );
};
