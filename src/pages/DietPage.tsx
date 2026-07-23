import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Meal } from '../types';
import { 
  Utensils, 
  PlusCircle, 
  ShoppingCart
} from 'lucide-react';

interface DietPageProps {
  onOpenMealLogger: () => void;
  onOpenGroceryList: () => void;
}

export const DietPage: React.FC<DietPageProps> = ({ onOpenMealLogger, onOpenGroceryList }) => {
  const { goal } = useAuth();
  const [meals, setMeals] = useState<{ [key: string]: Meal[] }>({});
  const [isIndianOnly, setIsIndianOnly] = useState(true);

  const fetchMealPlan = async () => {
    try {
      const res = await api.getMealPlan(`isIndianOnly=${isIndianOnly}`);
      setMeals(res.meals);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMealPlan();
  }, [isIndianOnly]);

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

  return (
    <div className="space-y-6 pb-20 md:pb-10 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Utensils className="w-6 h-6 text-red-500" /> Nutrition & Meal Suggestions
          </h2>
          <p className="text-xs text-neutral-400 mt-1">Custom macro splits with high-protein Indian & Global food options</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Indian Cuisine Toggle */}
          <button
            onClick={() => setIsIndianOnly(!isIndianOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              isIndianOnly
                ? 'bg-red-600/20 border-red-600/40 text-red-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400'
            }`}
          >
            🍛 Indian Food Options {isIndianOnly ? 'Active' : 'All'}
          </button>

          <button
            onClick={onOpenGroceryList}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <ShoppingCart className="w-4 h-4 text-white" /> Grocery List
          </button>

          <button
            onClick={onOpenMealLogger}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-transform hover:scale-105 shadow-md flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-white" /> Log Meal
          </button>
        </div>
      </div>

      {/* Target Macro Cards Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center shadow-xl">
        <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
          <p className="text-[10px] text-neutral-400 font-bold uppercase">Daily Target</p>
          <p className="text-xl font-extrabold text-white mt-1">{goal?.tdee_calories || 2200} <span className="text-xs font-normal text-neutral-400">kcal</span></p>
        </div>

        <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
          <p className="text-[10px] text-neutral-400 font-bold uppercase">Target Protein</p>
          <p className="text-xl font-extrabold text-red-500 mt-1">{goal?.target_protein || 140}g</p>
        </div>

        <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
          <p className="text-[10px] text-neutral-400 font-bold uppercase">Target Carbs</p>
          <p className="text-xl font-extrabold text-white mt-1">{goal?.target_carbs || 220}g</p>
        </div>

        <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
          <p className="text-[10px] text-neutral-400 font-bold uppercase">Target Fats</p>
          <p className="text-xl font-extrabold text-red-400 mt-1">{goal?.target_fats || 60}g</p>
        </div>
      </div>

      {/* Meals by Type Grid */}
      <div className="space-y-6">
        {mealTypes.map((type) => {
          const list = meals[type] || [];
          return (
            <div key={type} className="space-y-3">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" /> {type.toUpperCase()} RECOMMENDATIONS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((m) => (
                  <div key={m.id} className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3 hover:border-red-600/40 transition-all shadow-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-600/20 text-red-400 border border-red-600/30 mb-1">
                          {m.diet_type}
                        </span>
                        <h4 className="font-bold text-white text-base">{m.name}</h4>
                      </div>
                      <span className="text-sm font-extrabold text-red-500">{m.calories} kcal</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-neutral-800">
                      <div>
                        <p className="text-[10px] text-neutral-400 font-semibold">P</p>
                        <p className="font-bold text-red-500">{m.protein}g</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-400 font-semibold">C</p>
                        <p className="font-bold text-white">{m.carbs}g</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-400 font-semibold">F</p>
                        <p className="font-bold text-red-400">{m.fats}g</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-neutral-400 line-clamp-2">
                      <span className="text-neutral-500 font-semibold">Ingredients: </span>{m.ingredients}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
