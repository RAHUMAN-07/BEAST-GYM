import React, { useState, useEffect } from 'react';
import type { Workout, Exercise } from '../types';
import { api } from '../services/api';
import { 
  Dumbbell, 
  Search, 
  Play, 
  Clock
} from 'lucide-react';

interface WorkoutsPageProps {
  onStartWorkout: (workout: Workout) => void;
}

export const WorkoutsPage: React.FC<WorkoutsPageProps> = ({ onStartWorkout }) => {
  const [myWorkouts, setMyWorkouts] = useState<Workout[]>([]);
  const [catalog, setCatalog] = useState<Exercise[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [category, setCategory] = useState<'all' | 'gym' | 'home'>('all');
  const [search, setSearch] = useState('');

  const fetchWorkouts = async () => {
    try {
      const plans = await api.getMyPlan();
      setMyWorkouts(plans);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCatalog = async () => {
    try {
      let params = `category=${category === 'all' ? '' : category}`;
      if (selectedMuscle) params += `&muscle=${selectedMuscle}`;
      if (search) params += `&search=${search}`;
      const res = await api.getExerciseTemplates(params);
      setCatalog(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [selectedMuscle, category, search]);

  return (
    <div className="space-y-6 pb-20 md:pb-10 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-red-500" /> Workout Routines & Exercises
          </h2>
          <p className="text-xs text-neutral-400 mt-1">Personalized plans tailored to your goal and available equipment</p>
        </div>

        {/* Setting Toggle */}
        <div className="flex items-center gap-2 p-1 bg-neutral-900 border border-neutral-800 rounded-2xl">
          {(['all', 'gym', 'home'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                category === cat
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* My Active Workout Plans Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Your Weekly Workout Routines</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {myWorkouts.map((w) => (
            <div key={w.id} className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between hover:border-red-600/40 transition-all group shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-red-600/20 text-red-400 text-[10px] font-bold uppercase">
                    {w.schedule_day || 'Day'}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" /> {w.duration_mins}m
                  </span>
                </div>

                <h4 className="font-extrabold text-white text-lg group-hover:text-red-500 transition-colors">{w.title}</h4>
                <p className="text-xs text-neutral-400 mt-1 mb-4">{w.exercises?.length || 0} Exercises included</p>

                <div className="space-y-2">
                  {w.exercises?.map((ex, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{ex.exercise_name}</span>
                      <span className="text-[10px] text-red-400 font-mono">{ex.sets} × {ex.reps}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onStartWorkout(w)}
                className="mt-6 w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 font-extrabold text-white text-xs shadow-lg shadow-red-600/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white text-white" /> Start Workout Session
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Search & Catalog */}
      <div className="pt-6 border-t border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Exercise Library ({catalog.length})</h3>

          {/* Search bar & muscle filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exercise..."
                className="pl-9 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
              />
            </div>

            <select
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs"
            >
              <option value="">All Muscle Groups</option>
              <option value="Chest">Chest</option>
              <option value="Back">Back</option>
              <option value="Legs">Legs</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Biceps">Biceps</option>
              <option value="Triceps">Triceps</option>
              <option value="Core">Core</option>
            </select>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalog.map((ex) => (
            <div key={ex.id} className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{ex.name}</h4>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-600/20 text-red-400 border border-red-600/30 mt-1">
                    {ex.muscle_group}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">{ex.equipment}</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">{ex.instructions}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
