import React, { useState } from 'react';
import { api } from '../../services/api';
import { X, Utensils } from 'lucide-react';

interface MealLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MealLoggerModal: React.FC<MealLoggerModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [calories, setCalories] = useState('450');
  const [protein, setProtein] = useState('30');
  const [carbs, setCarbs] = useState('45');
  const [fats, setFats] = useState('12');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickPreset = (name: string, cal: number, p: number, c: number, f: number) => {
    setMealName(name);
    setCalories(cal.toString());
    setProtein(p.toString());
    setCarbs(c.toString());
    setFats(f.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.logMeal({
        meal_name: mealName,
        meal_type: mealType,
        calories: parseInt(calories) || 0,
        protein: parseInt(protein) || 0,
        carbs: parseInt(carbs) || 0,
        fats: parseInt(fats) || 0
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Utensils className="w-5 h-5 text-amber-400" /> Log Meal & Calories
        </h3>
        <p className="text-xs text-slate-400 mb-4">Add your consumed food to track daily macros</p>

        {/* Quick presets */}
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Quick Presets</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { name: 'Paneer Bhurji + Roti', cal: 480, p: 26, c: 45, f: 18 },
              { name: 'Chicken Tikka + Rice', cal: 560, p: 48, c: 55, f: 12 },
              { name: 'Moong Dal Chela', cal: 320, p: 20, c: 38, f: 8 },
              { name: 'Whey Shake + Banana', cal: 350, p: 32, c: 35, f: 4 }
            ].map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleQuickPreset(p.name, p.cal, p.p, p.c, p.f)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-amber-300 font-semibold border border-slate-700/60 transition-colors"
              >
                + {p.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Meal Title</label>
            <input
              type="text"
              required
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="e.g. Oatmeal with Almonds"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Calories (kcal)</label>
              <input
                type="number"
                required
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">Protein (g)</label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">Carbs (g)</label>
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 font-bold text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">Fats (g)</label>
              <input
                type="number"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 font-bold text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-bold text-slate-950 text-xs shadow-lg shadow-emerald-500/20"
          >
            {loading ? 'Logging...' : 'Log Consumed Meal'}
          </button>
        </form>
      </div>
    </div>
  );
};
