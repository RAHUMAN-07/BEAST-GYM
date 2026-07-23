/* ─────────────────────────────────────────────────────────────────────────
   BEAST GYM — Workout Planner Page
   Multi-step form → generates personalized 7-day split with daily progression
───────────────────────────────────────────────────────────────────────── */
import React, { useState } from 'react';
import {
  User, Target, Calendar, ChevronRight, ChevronLeft,
  Dumbbell, Flame, Activity, CheckCircle2, ArrowRight,
  RotateCcw, TrendingUp, Clock, Zap, Shield
} from 'lucide-react';
import { ScrollFlyInHeadline } from '../components/common/ScrollFlyInHeadline';

// ─── Types ─────────────────────────────────────────────────────────────────
interface FormData {
  name: string;
  age: string;
  weight: string;       // kg
  height: string;       // cm
  gender: 'male' | 'female' | 'other' | '';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | '';
  goal: 'lose_fat' | 'build_muscle' | 'strength' | 'endurance' | 'general' | '';
  daysPerWeek: '3' | '4' | '5' | '6' | '';
  equipment: 'gym' | 'home' | 'minimal' | '';
  focusArea: string[];
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  tip: string;
}

interface DayPlan {
  day: string;
  type: string;
  focus: string;
  color: string;
  isRest: boolean;
  exercises: Exercise[];
  progressionNote: string;
}

// ─── Exercise Database ──────────────────────────────────────────────────────
const EXERCISES: Record<string, Exercise[]> = {
  chest: [
    { name: 'Barbell Bench Press', sets: 4, reps: '6-8', rest: '3 min', tip: 'Retract scapula, drive feet into floor' },
    { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '90 sec', tip: 'Keep elbows at 45° to protect shoulders' },
    { name: 'Cable Flyes', sets: 3, reps: '12-15', rest: '60 sec', tip: 'Squeeze at the peak contraction' },
    { name: 'Decline Push-Ups', sets: 3, reps: 'To failure', rest: '60 sec', tip: 'Full range of motion for maximum stretch' },
  ],
  back: [
    { name: 'Deadlift', sets: 4, reps: '4-6', rest: '4 min', tip: 'Neutral spine, push floor away — do not pull' },
    { name: 'Weighted Pull-Ups', sets: 4, reps: '6-8', rest: '2 min', tip: 'Full dead hang at bottom, chin over bar at top' },
    { name: 'Seated Cable Row', sets: 3, reps: '10-12', rest: '90 sec', tip: 'Squeeze shoulder blades together at end' },
    { name: 'Single-Arm Dumbbell Row', sets: 3, reps: '12 each', rest: '60 sec', tip: 'Elbow drives back past hip level' },
  ],
  legs: [
    { name: 'Barbell Back Squat', sets: 4, reps: '6-8', rest: '3 min', tip: 'Knees track over toes, depth below parallel' },
    { name: 'Romanian Deadlift', sets: 3, reps: '10-12', rest: '2 min', tip: 'Hinge at hips, keep bar close to legs' },
    { name: 'Leg Press', sets: 3, reps: '12-15', rest: '90 sec', tip: 'Vary foot placement to target different heads' },
    { name: 'Walking Lunges', sets: 3, reps: '12 each', rest: '60 sec', tip: 'Step long enough so front knee stays behind toes' },
    { name: 'Seated Calf Raise', sets: 4, reps: '15-20', rest: '45 sec', tip: 'Full stretch at bottom, pause at top' },
  ],
  shoulders: [
    { name: 'Overhead Press (Barbell)', sets: 4, reps: '6-8', rest: '3 min', tip: 'Bar path slightly back, elbows slightly forward' },
    { name: 'Lateral Raises', sets: 4, reps: '15-20', rest: '45 sec', tip: 'Lead with elbows, slight internal rotation' },
    { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '60 sec', tip: 'Pull to forehead level, externally rotate at end' },
    { name: 'Arnold Press', sets: 3, reps: '10-12', rest: '90 sec', tip: 'Full rotation through range of motion' },
  ],
  arms: [
    { name: 'EZ-Bar Curl', sets: 4, reps: '8-10', rest: '90 sec', tip: 'Keep elbows fixed at sides, full extension' },
    { name: 'Skull Crushers', sets: 4, reps: '10-12', rest: '90 sec', tip: 'Lower bar to forehead level slowly' },
    { name: 'Hammer Curls', sets: 3, reps: '12-15', rest: '60 sec', tip: 'Neutral grip targets brachialis & brachioradialis' },
    { name: 'Tricep Rope Pushdown', sets: 3, reps: '12-15', rest: '60 sec', tip: 'Flare rope out at bottom, elbows stationary' },
  ],
  cardio_hiit: [
    { name: 'Assault Bike Intervals', sets: 8, reps: '20 sec on / 10 sec off', rest: '2 min after all', tip: 'Max effort every interval — go all out' },
    { name: 'Battle Rope Slams', sets: 5, reps: '30 sec', rest: '30 sec', tip: 'Full body drive from legs through shoulders' },
    { name: 'Box Jumps', sets: 4, reps: '8 explosive', rest: '60 sec', tip: 'Soft landing, step down not jump down' },
    { name: 'Prowler Sled Push', sets: 4, reps: '20 m', rest: '90 sec', tip: 'Low body angle, drive through hips' },
  ],
  core: [
    { name: 'Weighted Cable Crunches', sets: 4, reps: '15-20', rest: '45 sec', tip: 'Round your lower back into the crunch' },
    { name: 'Hanging Leg Raises', sets: 3, reps: '12-15', rest: '60 sec', tip: 'No swinging — control the movement' },
    { name: 'Ab Wheel Rollout', sets: 3, reps: '10-12', rest: '60 sec', tip: 'Brace core before extending, pull back with lats' },
    { name: 'Plank Hold', sets: 3, reps: '60 sec', rest: '30 sec', tip: 'Squeeze glutes and abs simultaneously' },
  ],
};

// ─── Workout Split Generator ────────────────────────────────────────────────
function generateSplit(data: FormData): DayPlan[] {
  const days = parseInt(data.daysPerWeek || '4');
  const goal = data.goal;

  // Adjust reps based on goal — used in customiseExercises below

  // Progression note per week
  const progressionNotes = {
    strength: 'Progressive Overload: Add 2.5kg to main lift each session. Track every set.',
    build_muscle: 'Volume Progression: Add 1 set every 2 weeks. When all reps hit top of range, add weight.',
    lose_fat: 'Density Block: Reduce rest by 5 sec each week. Maintain perfect form over load.',
    endurance: 'Duration Progression: Add 30 sec to each interval set each week.',
    general: 'Linear Progression: Increase weight or reps each session — small wins compound.',
  };

  // Adjust exercises to match goal rep range
  const customiseExercises = (exList: Exercise[]): Exercise[] =>
    exList.map(ex => ({
      ...ex,
      reps: goal === 'strength' ? '3-5' : goal === 'lose_fat' || goal === 'endurance' ? '15-20' : ex.reps,
      rest: goal === 'strength' ? '3-4 min' : goal === 'lose_fat' ? '30-45 sec' : ex.rest,
      sets: goal === 'strength' ? 5 : goal === 'build_muscle' ? ex.sets : 3,
    }));

  const note = progressionNotes[goal as keyof typeof progressionNotes] || progressionNotes.general;

  const splits: Record<string, DayPlan[]> = {
    '3': [
      {
        day: 'Monday', type: 'Full Body A', focus: 'Strength Focus',
        color: 'orange', isRest: false,
        exercises: customiseExercises([...EXERCISES.chest.slice(0, 2), ...EXERCISES.back.slice(0, 2), ...EXERCISES.legs.slice(0, 2)]),
        progressionNote: note,
      },
      { day: 'Tuesday', type: 'Rest / Recovery', focus: 'Active Recovery', color: 'slate', isRest: true, exercises: [], progressionNote: '' },
      {
        day: 'Wednesday', type: 'Full Body B', focus: 'Hypertrophy Focus',
        color: 'blue', isRest: false,
        exercises: customiseExercises([...EXERCISES.shoulders, ...EXERCISES.arms.slice(0, 3), ...EXERCISES.core.slice(0, 2)]),
        progressionNote: note,
      },
      { day: 'Thursday', type: 'Rest / Recovery', focus: 'Active Recovery', color: 'slate', isRest: true, exercises: [], progressionNote: '' },
      {
        day: 'Friday', type: 'Full Body C', focus: 'Power + Conditioning',
        color: 'emerald', isRest: false,
        exercises: customiseExercises([...EXERCISES.legs.slice(0, 3), ...EXERCISES.cardio_hiit.slice(0, 2), ...EXERCISES.core.slice(0, 2)]),
        progressionNote: note,
      },
      { day: 'Saturday', type: 'Rest / Recovery', focus: 'Full Rest', color: 'slate', isRest: true, exercises: [], progressionNote: '' },
      { day: 'Sunday', type: 'Rest / Recovery', focus: 'Full Rest', color: 'slate', isRest: true, exercises: [], progressionNote: '' },
    ],
    '4': [
      {
        day: 'Monday', type: 'Push Day', focus: 'Chest · Shoulders · Triceps',
        color: 'orange', isRest: false,
        exercises: customiseExercises([...EXERCISES.chest, ...EXERCISES.shoulders.slice(0, 2), ...EXERCISES.arms.slice(1, 3)]),
        progressionNote: note,
      },
      {
        day: 'Tuesday', type: 'Pull Day', focus: 'Back · Biceps',
        color: 'blue', isRest: false,
        exercises: customiseExercises([...EXERCISES.back, ...EXERCISES.arms.slice(0, 2)]),
        progressionNote: note,
      },
      { day: 'Wednesday', type: 'Rest / Recovery', focus: 'Active Recovery', color: 'slate', isRest: true, exercises: [], progressionNote: '' },
      {
        day: 'Thursday', type: 'Leg Day', focus: 'Quads · Hamstrings · Glutes · Calves',
        color: 'emerald', isRest: false,
        exercises: customiseExercises(EXERCISES.legs),
        progressionNote: note,
      },
      {
        day: 'Friday', type: 'Shoulders + Arms', focus: 'Delts · Bis · Tris',
        color: 'violet', isRest: false,
        exercises: customiseExercises([...EXERCISES.shoulders, ...EXERCISES.arms]),
        progressionNote: note,
      },
      { day: 'Saturday', type: 'Rest / Recovery', focus: 'Full Rest', color: 'slate', isRest: true, exercises: [], progressionNote: '' },
      { day: 'Sunday', type: 'Rest / Recovery', focus: 'Full Rest', color: 'slate', isRest: true, exercises: [], progressionNote: '' },
    ],
    '5': [
      {
        day: 'Monday', type: 'Push Day A', focus: 'Chest · Shoulders · Triceps',
        color: 'orange', isRest: false,
        exercises: customiseExercises([...EXERCISES.chest, ...EXERCISES.shoulders.slice(0, 2), ...EXERCISES.arms.slice(1, 3)]),
        progressionNote: note,
      },
      {
        day: 'Tuesday', type: 'Pull Day A', focus: 'Back · Biceps',
        color: 'blue', isRest: false,
        exercises: customiseExercises([...EXERCISES.back, ...EXERCISES.arms.slice(0, 2)]),
        progressionNote: note,
      },
      {
        day: 'Wednesday', type: 'Leg Day', focus: 'Quads · Hamstrings · Glutes · Calves',
        color: 'emerald', isRest: false,
        exercises: customiseExercises(EXERCISES.legs),
        progressionNote: note,
      },
      {
        day: 'Thursday', type: 'Push Day B', focus: 'Incline Chest · Shoulders · Core',
        color: 'amber', isRest: false,
        exercises: customiseExercises([...EXERCISES.chest.slice(1), ...EXERCISES.shoulders.slice(1), ...EXERCISES.core.slice(0, 3)]),
        progressionNote: note,
      },
      {
        day: 'Friday', type: 'Pull Day B + HIIT', focus: 'Back · Arms · Conditioning',
        color: 'rose', isRest: false,
        exercises: customiseExercises([...EXERCISES.back.slice(1), ...EXERCISES.arms, ...EXERCISES.cardio_hiit.slice(0, 2)]),
        progressionNote: note,
      },
      { day: 'Saturday', type: 'Rest / Recovery', focus: 'Full Rest', color: 'slate', isRest: true, exercises: [], progressionNote: '' },
      { day: 'Sunday', type: 'Rest / Recovery', focus: 'Full Rest', color: 'slate', isRest: true, exercises: [], progressionNote: '' },
    ],
    '6': [
      {
        day: 'Monday', type: 'Push Day A', focus: 'Chest · Shoulders · Triceps',
        color: 'orange', isRest: false,
        exercises: customiseExercises([...EXERCISES.chest, ...EXERCISES.shoulders.slice(0, 2), ...EXERCISES.arms.slice(1, 3)]),
        progressionNote: note,
      },
      {
        day: 'Tuesday', type: 'Pull Day A', focus: 'Back · Biceps',
        color: 'blue', isRest: false,
        exercises: customiseExercises([...EXERCISES.back, ...EXERCISES.arms.slice(0, 2)]),
        progressionNote: note,
      },
      {
        day: 'Wednesday', type: 'Leg Day A', focus: 'Quad Dominant · Calves',
        color: 'emerald', isRest: false,
        exercises: customiseExercises(EXERCISES.legs.slice(0, 4)),
        progressionNote: note,
      },
      {
        day: 'Thursday', type: 'Push Day B', focus: 'Incline · Shoulder Volume',
        color: 'violet', isRest: false,
        exercises: customiseExercises([...EXERCISES.chest.slice(1), ...EXERCISES.shoulders, ...EXERCISES.arms.slice(1, 3)]),
        progressionNote: note,
      },
      {
        day: 'Friday', type: 'Pull Day B', focus: 'Back Width · Arm Detail',
        color: 'rose', isRest: false,
        exercises: customiseExercises([...EXERCISES.back.slice(1), ...EXERCISES.arms]),
        progressionNote: note,
      },
      {
        day: 'Saturday', type: 'Leg Day B + Core', focus: 'Posterior Chain · Abs',
        color: 'amber', isRest: false,
        exercises: customiseExercises([...EXERCISES.legs.slice(1, 4), ...EXERCISES.core]),
        progressionNote: note,
      },
      { day: 'Sunday', type: 'Rest / Recovery', focus: 'Full Rest', color: 'slate', isRest: true, exercises: [], progressionNote: '' },
    ],
  };

  return splits[String(days)] || splits['4'];
}

// ─── BMR / TDEE Calculator ──────────────────────────────────────────────────
function calcTDEE(data: FormData): { bmr: number; tdee: number; target: number; protein: number; carbs: number; fat: number } {
  const w = parseFloat(data.weight) || 70;
  const h = parseFloat(data.height) || 170;
  const a = parseInt(data.age) || 25;
  const isMale = data.gender !== 'female';
  const bmr = isMale
    ? 10 * w + 6.25 * h - 5 * a + 5
    : 10 * w + 6.25 * h - 5 * a - 161;
  const activityFactor = { '3': 1.375, '4': 1.55, '5': 1.725, '6': 1.9 }[data.daysPerWeek || '4'] || 1.55;
  const tdee = Math.round(bmr * activityFactor);
  const target = data.goal === 'lose_fat' ? tdee - 400 : data.goal === 'build_muscle' ? tdee + 300 : tdee;
  const protein = Math.round(w * 2.2);
  const fat = Math.round((target * 0.25) / 9);
  const carbs = Math.round((target - protein * 4 - fat * 9) / 4);
  return { bmr: Math.round(bmr), tdee, target, protein, carbs, fat };
}

// ─── Colour map ─────────────────────────────────────────────────────────────
const COLORS: Record<string, string> = {
  orange: 'border-[#00ff66]/60 bg-[#00ff66]/10',
  blue:   'border-emerald-500/60 bg-emerald-500/10',
  emerald:'border-emerald-400/60 bg-emerald-400/10',
  violet: 'border-teal-500/60 bg-teal-500/10',
  rose:   'border-green-500/60 bg-green-500/10',
  amber:  'border-emerald-600/60 bg-emerald-600/10',
  slate:  'border-emerald-950 bg-[#080e0a]',
};
const TEXT_COLORS: Record<string, string> = {
  orange: 'text-[#00ff66]', blue: 'text-emerald-400', emerald: 'text-[#00ff66]',
  violet: 'text-emerald-300', rose: 'text-[#00ff66]', amber: 'text-emerald-400', slate: 'text-slate-500',
};

// ── STEP COMPONENTS ─────────────────────────────────────────────────────────

interface StepProps { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }

const Step1: React.FC<StepProps> = ({ form, setForm }) => (
  <div className="space-y-6">
    <div className="text-center space-y-2">
      <div className="w-16 h-16 rounded-2xl bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30 flex items-center justify-center mx-auto mb-4">
        <User className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black italic uppercase text-white font-anton">About You</h2>
      <p className="text-xs text-slate-400 font-light">Let's build your profile to personalise your plan</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <Field label="Your Name" placeholder="e.g. Alex Johnson" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
      <Field label="Age" placeholder="e.g. 24" value={form.age} onChange={v => setForm(p => ({ ...p, age: v }))} type="number" />
      <Field label="Weight (kg)" placeholder="e.g. 75" value={form.weight} onChange={v => setForm(p => ({ ...p, weight: v }))} type="number" />
      <Field label="Height (cm)" placeholder="e.g. 178" value={form.height} onChange={v => setForm(p => ({ ...p, height: v }))} type="number" />
    </div>
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Gender</label>
      <div className="flex flex-wrap gap-3">
        {(['male', 'female', 'other'] as const).map(g => (
          <button key={g} onClick={() => setForm(p => ({ ...p, gender: g }))}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all capitalize ${form.gender === g ? 'bg-[#00ff66] border-[#00ff66] text-[#050a07] shadow-lg shadow-[#00ff66]/30 font-bold' : 'bg-[#050a07] border-emerald-900 text-slate-300 hover:border-[#00ff66]/50'}`}>
            {g}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const Step2: React.FC<StepProps> = ({ form, setForm }) => (
  <div className="space-y-6">
    <div className="text-center space-y-2">
      <div className="w-16 h-16 rounded-2xl bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30 flex items-center justify-center mx-auto mb-4">
        <Target className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black italic uppercase text-white font-anton">Your Goal</h2>
      <p className="text-xs text-slate-400 font-light">Your primary goal shapes every rep, set, and macro</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { id: 'build_muscle', label: '💪 Build Muscle', desc: 'Hypertrophy-focused volume training' },
        { id: 'lose_fat', label: '🔥 Burn Fat', desc: 'Metabolic conditioning & calorie deficit' },
        { id: 'strength', label: '⚡ Raw Strength', desc: 'Heavy compound lifts, low-rep power' },
        { id: 'endurance', label: '🏃 Endurance', desc: 'Cardiovascular & stamina development' },
        { id: 'general', label: '🎯 General Fitness', desc: 'Balanced health & athletic performance' },
      ].map(opt => (
        <button key={opt.id} onClick={() => setForm(p => ({ ...p, goal: opt.id as FormData['goal'] }))}
          className={`p-5 rounded-2xl border text-left transition-all ${form.goal === opt.id ? 'bg-[#00ff66]/15 border-[#00ff66] shadow-lg shadow-[#00ff66]/20 scale-[1.02]' : 'bg-[#050a07] border-emerald-900 hover:border-emerald-700'}`}>
          <p className="text-sm font-black text-white">{opt.label}</p>
          <p className="text-xs text-slate-400 mt-1 font-light">{opt.desc}</p>
          {form.goal === opt.id && <CheckCircle2 className="w-4 h-4 text-[#00ff66] mt-2" />}
        </button>
      ))}
    </div>
  </div>
);

const Step3: React.FC<StepProps> = ({ form, setForm }) => (
  <div className="space-y-6">
    <div className="text-center space-y-2">
      <div className="w-16 h-16 rounded-2xl bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30 flex items-center justify-center mx-auto mb-4">
        <Dumbbell className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black italic uppercase text-white font-anton">Experience Level</h2>
      <p className="text-xs text-slate-400 font-light">Honest self-assessment gives you the best possible plan</p>
    </div>
    <div className="space-y-4">
      {[
        { id: 'beginner', label: '🌱 Beginner', desc: 'Less than 1 year of consistent training. Focus on form, foundational strength, and building the habit.' },
        { id: 'intermediate', label: '💪 Intermediate', desc: '1–3 years training. Comfortable with compound lifts. Ready for more structured periodization.' },
        { id: 'advanced', label: '⚡ Advanced', desc: '3+ years training. Experienced with progressive overload, familiar with periodization concepts.' },
      ].map(opt => (
        <button key={opt.id} onClick={() => setForm(p => ({ ...p, fitnessLevel: opt.id as FormData['fitnessLevel'] }))}
          className={`w-full p-5 rounded-2xl border text-left transition-all ${form.fitnessLevel === opt.id ? 'bg-[#00ff66]/15 border-[#00ff66] shadow-lg shadow-[#00ff66]/20 scale-[1.01]' : 'bg-[#050a07] border-emerald-900 hover:border-emerald-700'}`}>
          <p className="text-sm font-black text-white">{opt.label}</p>
          <p className="text-xs text-slate-400 mt-1 font-light">{opt.desc}</p>
        </button>
      ))}
    </div>
  </div>
);

const Step4: React.FC<StepProps> = ({ form, setForm }) => (
  <div className="space-y-6">
    <div className="text-center space-y-2">
      <div className="w-16 h-16 rounded-2xl bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30 flex items-center justify-center mx-auto mb-4">
        <Calendar className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black italic uppercase text-white font-anton">Schedule & Equipment</h2>
      <p className="text-xs text-slate-400 font-light">We'll build around your real availability</p>
    </div>

    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Days Per Week You Can Train</label>
      <div className="flex flex-wrap gap-3">
        {(['3', '4', '5', '6'] as const).map(d => (
          <button key={d} onClick={() => setForm(p => ({ ...p, daysPerWeek: d }))}
            className={`w-16 h-16 rounded-2xl text-lg font-black border transition-all ${form.daysPerWeek === d ? 'bg-[#00ff66] border-[#00ff66] text-[#050a07] shadow-lg shadow-[#00ff66]/30 scale-110' : 'bg-[#050a07] border-emerald-900 text-slate-300 hover:border-emerald-700'}`}>
            {d}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-2 font-light">Minimum 3 days recommended for meaningful progress</p>
    </div>

    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Training Environment</label>
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: 'gym', label: '🏋️ Full Gym', desc: 'All equipment' },
          { id: 'home', label: '🏠 Home Gym', desc: 'Dumbbells & bench' },
          { id: 'minimal', label: '⚡ Minimal', desc: 'Bodyweight only' },
        ].map(opt => (
          <button key={opt.id} onClick={() => setForm(p => ({ ...p, equipment: opt.id as FormData['equipment'] }))}
            className={`p-4 rounded-2xl border text-center transition-all ${form.equipment === opt.id ? 'bg-[#00ff66]/15 border-[#00ff66] shadow-lg' : 'bg-[#050a07] border-emerald-900 hover:border-emerald-700'}`}>
            <p className="text-xl mb-1">{opt.label.split(' ')[0]}</p>
            <p className="text-[10px] font-black text-white uppercase tracking-wider">{opt.label.split(' ').slice(1).join(' ')}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ─── Field helper ─────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-[#050a07] border border-emerald-900 text-sm text-white placeholder:text-slate-600 focus:border-[#00ff66] focus:outline-none transition-all"
      />
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────
interface WorkoutPlannerPageProps { onGetStarted: () => void; }

export const WorkoutPlannerPage: React.FC<WorkoutPlannerPageProps> = ({ onGetStarted }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    name: '', age: '', weight: '', height: '', gender: '',
    fitnessLevel: '', goal: '', daysPerWeek: '', equipment: '', focusArea: [],
  });
  const [plan, setPlan] = useState<DayPlan[] | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [generating, setGenerating] = useState(false);

  const steps = [
    { label: 'Profile', icon: <User className="w-4 h-4" /> },
    { label: 'Goal', icon: <Target className="w-4 h-4" /> },
    { label: 'Level', icon: <Dumbbell className="w-4 h-4" /> },
    { label: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
  ];

  const canProceed = [
    form.name && form.age && form.gender,
    form.goal,
    form.fitnessLevel,
    form.daysPerWeek && form.equipment,
  ][step];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const generated = generateSplit(form);
      setPlan(generated);
      setGenerating(false);
      setSelectedDay(0);
    }, 1800);
  };

  const macros = form.weight && form.height && form.age && form.goal && form.daysPerWeek ? calcTDEE(form) : null;

  if (generating) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6 px-4 bg-[#050a07]">
        <div className="w-20 h-20 rounded-2xl bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/30 flex items-center justify-center shadow-lg shadow-[#00ff66]/20">
          <Dumbbell className="w-10 h-10 animate-bounce" />
        </div>
        <h2 className="text-2xl font-black italic uppercase text-white text-center font-anton">Generating Your Beast Plan...</h2>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#00ff66] animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
          ))}
        </div>
        <p className="text-xs text-slate-400 font-mono text-center max-w-xs">
          Calculating TDEE · Selecting exercises · Structuring progression...
        </p>
      </div>
    );
  }

  if (plan) {
    const day = plan[selectedDay];
    const macroData = macros;
    const activeDays = plan.filter(d => !d.isRest);

    return (
      <div className="min-h-screen text-white pb-20 bg-[#050a07]">
        {/* Header */}
        <div className="bg-[#080e0a] border-b border-emerald-900/40 py-10 px-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-xs font-black uppercase tracking-widest mb-4">
            <CheckCircle2 className="w-4 h-4" /> Your Beast Plan is Ready
          </span>
          <h1 className="text-3xl sm:text-5xl font-black italic uppercase text-white mb-2 font-anton">
            {form.name ? `${form.name}'s` : 'Your'} <span className="text-[#00ff66]">7-Day Split</span>
          </h1>
          <p className="text-slate-400 text-sm font-light">
            {activeDays.length} training days · {form.goal?.replace(/_/g, ' ')} protocol · {form.fitnessLevel} level
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <button onClick={() => { setPlan(null); setStep(0); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f1c14] border border-emerald-900 text-xs font-black uppercase text-slate-300 hover:text-white hover:border-[#00ff66] transition-all">
              <RotateCcw className="w-4 h-4" /> Rebuild Plan
            </button>
            <button onClick={onGetStarted} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#00ff66] text-[#050a07] font-black text-xs uppercase shadow-lg shadow-[#00ff66]/20 hover:scale-105 transition-all">
              Join Beast Gym to Track Progress <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Weekly Schedule + Macros */}
          <div className="space-y-6 lg:col-span-1">

            {/* Macro Card */}
            {macroData && (
              <div className="p-6 rounded-3xl bg-[#080e0a] border border-emerald-900/60">
                <h3 className="text-sm font-black italic uppercase text-white mb-4 flex items-center gap-2 font-anton">
                  <Flame className="w-4 h-4 text-[#00ff66]" /> Daily Nutrition Targets
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Target Calories</span>
                    <span className="text-lg font-black text-[#00ff66]">{macroData.target} kcal</span>
                  </div>
                  {[
                    { label: 'Protein', value: `${macroData.protein}g`, color: 'bg-[#00ff66]', pct: Math.min(100, macroData.protein / 250 * 100) },
                    { label: 'Carbs', value: `${macroData.carbs}g`, color: 'bg-emerald-400', pct: Math.min(100, macroData.carbs / 400 * 100) },
                    { label: 'Fat', value: `${macroData.fat}g`, color: 'bg-teal-400', pct: Math.min(100, macroData.fat / 100 * 100) },
                  ].map(m => (
                    <div key={m.label}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400 font-semibold">{m.label}</span>
                        <span className="text-white font-black">{m.value}</span>
                      </div>
                      <div className="h-1.5 bg-[#050a07] rounded-full overflow-hidden">
                        <div className={`h-full ${m.color} rounded-full transition-all duration-1000`} style={{ width: `${m.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7-Day Week Grid */}
            <div className="p-6 rounded-3xl bg-[#080e0a] border border-emerald-900/60">
              <h3 className="text-sm font-black italic uppercase text-white mb-4 flex items-center gap-2 font-anton">
                <Calendar className="w-4 h-4 text-emerald-400" /> Weekly Schedule
              </h3>
              <div className="space-y-2">
                {plan.map((d, i) => (
                  <button
                    key={d.day}
                    onClick={() => !d.isRest && setSelectedDay(i)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                      selectedDay === i && !d.isRest
                        ? `${COLORS[d.color]} border-current scale-[1.02] shadow-md`
                        : d.isRest
                          ? 'bg-[#050a07]/50 border-emerald-950/50 opacity-50 cursor-default'
                          : 'bg-[#050a07] border-emerald-900 hover:border-emerald-700 cursor-pointer'
                    }`}
                  >
                    <span className={`text-[10px] font-black w-5 ${selectedDay === i ? TEXT_COLORS[d.color] : 'text-slate-500'}`}>
                      {d.day.slice(0, 3).toUpperCase()}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-black truncate ${d.isRest ? 'text-slate-600' : 'text-white'}`}>{d.type}</p>
                      <p className="text-[10px] text-slate-500 truncate">{d.focus}</p>
                    </div>
                    {!d.isRest && <div className={`w-2 h-2 rounded-full ${TEXT_COLORS[d.color].replace('text-', 'bg-')}`} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Progression Principles */}
            <div className="p-6 rounded-3xl bg-[#080e0a] border border-[#00ff66]/30">
              <h3 className="text-sm font-black italic uppercase text-white mb-4 flex items-center gap-2 font-anton">
                <TrendingUp className="w-4 h-4 text-[#00ff66]" /> Progression Protocol
              </h3>
              <div className="space-y-3 text-xs text-slate-300 font-light leading-relaxed">
                {[
                  { icon: '📈', text: 'Track every set, rep, and weight in a log.' },
                  { icon: '⚡', text: plan.find(d => !d.isRest)?.progressionNote || 'Add weight or reps each session.' },
                  { icon: '💤', text: 'Prioritise 7–9 hours sleep — recovery is 50% of your gains.' },
                  { icon: '💧', text: 'Drink 35ml × bodyweight(kg) of water daily.' },
                  { icon: '🍗', text: `Hit your ${macroData?.protein ?? 150}g daily protein target consistently.` },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Day Detail */}
          <div className="lg:col-span-2 space-y-6">
            {day.isRest ? (
              <div className="p-12 rounded-3xl bg-[#080e0a] border border-emerald-900/60 text-center">
                <p className="text-5xl mb-4">😴</p>
                <h3 className="text-2xl font-black italic uppercase text-white mb-2 font-anton">{day.day} — Rest Day</h3>
                <p className="text-slate-400 text-sm font-light">Active recovery: 20-min walk, foam rolling, and stretching. Muscles grow during rest, not during training.</p>
              </div>
            ) : (
              <>
                <div className={`p-6 rounded-3xl border ${COLORS[day.color]}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-xs font-black uppercase tracking-widest ${TEXT_COLORS[day.color]} mb-1`}>{day.day}</p>
                      <h2 className="text-2xl font-black italic uppercase text-white font-anton">{day.type}</h2>
                      <p className="text-sm text-slate-400 font-light mt-1">{day.focus}</p>
                    </div>
                    <div className="flex gap-4 text-right">
                      <div>
                        <p className="text-xs text-slate-500">Exercises</p>
                        <p className="text-2xl font-black text-white font-anton">{day.exercises.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Est. Time</p>
                        <p className="text-2xl font-black text-white font-anton">{Math.round(day.exercises.length * 12)}m</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {day.exercises.map((ex, ei) => (
                    <div key={ei} className="p-5 rounded-2xl bg-[#080e0a] border border-emerald-900/60 hover:border-[#00ff66]/50 transition-all group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${TEXT_COLORS[day.color]} bg-[#050a07] border border-emerald-900`}>
                              {ei + 1}
                            </span>
                            <h4 className="text-sm font-black text-white group-hover:text-[#00ff66] transition-colors">{ex.name}</h4>
                          </div>
                          <p className="text-[11px] text-slate-500 font-light italic flex items-center gap-1.5 mt-1">
                            <Shield className="w-3 h-3 text-[#00ff66]" /> {ex.tip}
                          </p>
                        </div>
                        <div className="flex gap-4 text-right flex-shrink-0">
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Sets</p>
                            <p className="text-xl font-black text-white font-anton">{ex.sets}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Reps</p>
                            <p className="text-base font-black text-white font-anton">{ex.reps}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Rest</p>
                            <p className="text-xs font-bold text-slate-300 mt-1">{ex.rest}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`p-4 rounded-2xl border ${COLORS[day.color]} text-xs`}>
                  <div className="flex items-start gap-2">
                    <Zap className={`w-4 h-4 flex-shrink-0 mt-0.5 ${TEXT_COLORS[day.color]}`} />
                    <div>
                      <p className={`font-black uppercase tracking-wider ${TEXT_COLORS[day.color]} mb-1`}>Weekly Progression Note</p>
                      <p className="text-slate-300 font-light">{day.progressionNote}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* CTA */}
            <div className="p-8 rounded-3xl bg-[#080e0a] border border-[#00ff66]/30 text-center space-y-4 shadow-2xl">
              <h3 className="text-xl font-black italic uppercase text-white font-anton">Ready to Execute This Plan?</h3>
              <p className="text-slate-400 text-sm font-light">Join Beast Gym and track every session, every meal, and every milestone in our app.</p>
              <button onClick={onGetStarted} className="px-8 py-4 rounded-2xl bg-[#00ff66] text-[#050a07] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#00ff66]/20 hover:scale-105 transition-all flex items-center gap-2 mx-auto font-anton">
                Start Your Beast Journey <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── FORM WIZARD ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-white bg-[#050a07]">
      {/* Hero */}
      <section className="py-20 px-4 bg-[#050a07] text-center border-b border-emerald-900/40 relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-xs font-black uppercase tracking-widest">
            <Activity className="w-4 h-4 animate-pulse text-[#00ff66]" /> FREE PERSONALISED PLAN
          </span>

          <ScrollFlyInHeadline
            text="GET YOUR BEAST PLAN"
            highlightWords={['BEAST', 'PLAN']}
            subtext="Answer 4 quick questions. We'll generate a science-backed weekly workout split, daily progression plan, and personalised macro targets — all free."
          />

          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400 pt-2">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-[#00ff66]" /> Takes 60 seconds</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> No signup required</span>
            <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4 text-[#00ff66]" /> Science-backed protocol</span>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 px-4 bg-[#080e0a]">
        <div className="max-w-2xl mx-auto">

          {/* Step Progress */}
          <div className="flex items-center justify-between mb-10 relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-emerald-950 z-0" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-[#00ff66] z-0 transition-all duration-500 shadow-[0_0_10px_#00ff66]"
              style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s, i) => (
              <div key={s.label} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all ${
                  i < step ? 'bg-[#00ff66] border-[#00ff66] text-[#050a07]'
                  : i === step ? 'bg-[#00ff66] border-[#00ff66] text-[#050a07] shadow-lg shadow-[#00ff66]/40 scale-110'
                  : 'bg-[#050a07] border-emerald-900 text-slate-500'
                }`}>
                  {i < step ? <CheckCircle2 className="w-5 h-5" /> : s.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${i === step ? 'text-[#00ff66]' : i < step ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-[#080e0a] border border-emerald-900/60 rounded-3xl p-8 backdrop-blur-md mb-6 shadow-2xl">
            {step === 0 && <Step1 form={form} setForm={setForm} />}
            {step === 1 && <Step2 form={form} setForm={setForm} />}
            {step === 2 && <Step3 form={form} setForm={setForm} />}
            {step === 3 && <Step4 form={form} setForm={setForm} />}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0f1c14] border border-emerald-900 text-xs font-black uppercase text-slate-300 disabled:opacity-30 hover:border-[#00ff66] hover:text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#00ff66] text-[#050a07] font-black text-xs uppercase tracking-widest shadow-lg shadow-[#00ff66]/20 disabled:opacity-40 hover:scale-105 transition-all font-anton"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={!canProceed}
                className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-[#00ff66] text-[#050a07] font-black text-sm uppercase tracking-widest shadow-xl shadow-[#00ff66]/30 disabled:opacity-40 hover:scale-105 transition-all font-anton"
              >
                <Flame className="w-5 h-5 text-[#050a07]" /> Generate My Beast Plan
              </button>
            )}
          </div>

          <p className="text-center text-[11px] text-slate-600 mt-4 font-mono">Step {step + 1} of {steps.length} · No email required · 100% free</p>
        </div>
      </section>
    </div>
  );
};

