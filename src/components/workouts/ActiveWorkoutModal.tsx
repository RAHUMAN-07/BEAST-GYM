import React, { useState, useEffect } from 'react';
import type { Workout } from '../../types';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import { 
  Timer as TimerIcon, 
  CheckCircle, 
  X, 
  RefreshCw, 
  Trophy,
  Volume2
} from 'lucide-react';

interface ActiveWorkoutModalProps {
  workout: Workout | null;
  isOpen: boolean;
  onClose: () => void;
  onFinishSuccess: () => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  workout,
  isOpen,
  onClose,
  onFinishSuccess
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  
  // Rest Timer State
  const [restTimerSeconds, setRestTimerSeconds] = useState<number | null>(null);
  const [selectedSubstitute, setSelectedSubstitute] = useState<any | null>(null);
  const [substituteList, setSubstituteList] = useState<any[]>([]);
  const [notes, setNotes] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);

  // Main Workout Elapsed Timer
  useEffect(() => {
    let interval: any = null;
    if (isOpen) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else {
      setSecondsElapsed(0);
      setCompletedSets({});
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  // Rest Countdown Timer
  useEffect(() => {
    let restInterval: any = null;
    if (restTimerSeconds !== null && restTimerSeconds > 0) {
      restInterval = setInterval(() => {
        setRestTimerSeconds(prev => (prev !== null && prev > 1 ? prev - 1 : null));
      }, 1000);
    }
    return () => clearInterval(restInterval);
  }, [restTimerSeconds]);

  if (!isOpen || !workout) return null;

  const toggleSet = (exId: number, setIndex: number, restSecs: number) => {
    const key = `${exId}_${setIndex}`;
    const nextState = !completedSets[key];
    setCompletedSets(prev => ({ ...prev, [key]: nextState }));

    if (nextState) {
      // Trigger Rest Timer Countdown
      setRestTimerSeconds(restSecs || 60);
      playBeep();
    }
  };

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 660;
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Fallback if browser audio blocked
    }
  };

  const handleFetchSubstitutes = async (exName: string) => {
    try {
      const res = await api.getExerciseSubstitutes(exName);
      setSubstituteList(res.substitutes);
      setSelectedSubstitute(res.primary);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFinishWorkout = async () => {
    setIsFinishing(true);
    const durationMins = Math.max(1, Math.round(secondsElapsed / 60));
    const caloriesBurned = Math.round(durationMins * 7.5); // Est ~7.5 kcal/min

    try {
      await api.logWorkout({
        workout_id: workout.id,
        workout_title: workout.title,
        duration_mins: durationMins,
        calories_burned: caloriesBurned,
        notes
      });

      // Confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setIsFinishing(false);
        onFinishSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Finish workout failed:', err);
      setIsFinishing(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const exercises = workout.exercises || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active Session
              </span>
              <span className="text-xs text-slate-400 font-mono">{workout.type.toUpperCase()}</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">{workout.title}</h3>
          </div>

          {/* Active Timer Display */}
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-2xl bg-slate-800 border border-slate-700/80 text-emerald-400 font-mono font-bold text-lg flex items-center gap-2 shadow-inner">
              <TimerIcon className="w-5 h-5 animate-pulse text-emerald-500" />
              {formatTime(secondsElapsed)}
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Exercises List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {exercises.map((ex) => (
            <div key={ex.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{ex.exercise_name}</h4>
                  <p className="text-xs text-slate-400 font-medium">Target: <span className="text-cyan-400">{ex.muscle_group}</span> • {ex.reps} reps</p>
                  <p className="text-[11px] text-slate-500 mt-1">{ex.instructions}</p>
                </div>

                <button
                  onClick={() => handleFetchSubstitutes(ex.exercise_name)}
                  className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3 text-cyan-400" /> Substitute
                </button>
              </div>

              {/* Sets Checkbox Row */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-700/40">
                {Array.from({ length: ex.sets || 3 }).map((_, idx) => {
                  const isDone = !!completedSets[`${ex.id}_${idx}`];
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleSet(ex.id, idx, ex.rest_seconds)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isDone
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <CheckCircle className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-400' : 'text-slate-600'}`} />
                      Set {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Notes Input */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Workout Notes / Weights Lifted (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bench press hit 75kg for 8 reps, felt strong!"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Rest Timer Modal Overlay */}
        {restTimerSeconds !== null && (
          <div className="absolute inset-x-4 bottom-20 z-50 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-emerald-500/50 shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Volume2 className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Rest Timer Active</p>
                <p className="text-[11px] text-slate-400">Catch your breath for the next set</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-extrabold text-emerald-400">
                {restTimerSeconds}s
              </span>
              <button
                onClick={() => setRestTimerSeconds(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Skip Rest
              </button>
            </div>
          </div>
        )}

        {/* Substitutes Popover */}
        {selectedSubstitute && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-6 flex items-center justify-center">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-white text-base">Exercise Alternatives</h4>
                <button onClick={() => setSelectedSubstitute(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-3">Targeting {selectedSubstitute.muscle_group}:</p>
              <div className="space-y-2">
                {substituteList.map((sub: any) => (
                  <div key={sub.id} className="p-3 rounded-xl bg-slate-800 border border-slate-700/60 text-xs">
                    <p className="font-bold text-emerald-400">{sub.name}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{sub.instructions}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Finish Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Est. Calories: <span className="font-bold text-emerald-400">{Math.round((secondsElapsed / 60) * 7.5)} kcal</span>
          </p>

          <button
            onClick={handleFinishWorkout}
            disabled={isFinishing}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-bold text-slate-950 text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform flex items-center gap-2"
          >
            {isFinishing ? 'Logging...' : 'Finish & Save Workout'} <Trophy className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
