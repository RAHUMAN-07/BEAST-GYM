import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ShieldAlert, Users, Dumbbell, Utensils } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  // Form states for creating templates
  const [exName, setExName] = useState('');
  const [exMuscle, setExMuscle] = useState('Chest');
  const [exEquipment] = useState('Dumbbells');
  const [exInstructions, setExInstructions] = useState('');
  const [exCategory, setExCategory] = useState('gym');

  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [mealDiet, setMealDiet] = useState('vegetarian');
  const [mealCal, setMealCal] = useState(450);
  const [mealP, setMealP] = useState(30);
  const [mealC, setMealC] = useState(45);
  const [mealF, setMealF] = useState(12);
  const [mealIngredients, setMealIngredients] = useState('');
  const [isIndian] = useState(true);

  const fetchData = async () => {
    try {
      const [sRes, uRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers()
      ]);
      setStats(sRes);
      setUsers(uRes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addExerciseTemplate({
        name: exName,
        muscle_group: exMuscle,
        equipment: exEquipment,
        instructions: exInstructions,
        category: exCategory
      });
      alert('Exercise template added!');
      setExName('');
      setExInstructions('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addMealTemplate({
        name: mealName,
        meal_type: mealType,
        diet_type: mealDiet,
        calories: mealCal,
        protein: mealP,
        carbs: mealC,
        fats: mealF,
        ingredients: mealIngredients,
        is_indian: isIndian
      });
      alert('Meal template added!');
      setMealName('');
      setMealIngredients('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-10 animate-in fade-in">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-amber-400" /> Admin Control Console
        </h2>
        <p className="text-xs text-slate-400 mt-1">Platform management, template content creation, and user administration</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Total Users</p>
          <p className="text-2xl font-extrabold text-white mt-1">{stats?.totalUsers || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Workouts Logged</p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{stats?.totalWorkoutsLogged || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Calories Burned</p>
          <p className="text-2xl font-extrabold text-cyan-400 mt-1">{stats?.totalCaloriesBurned || 0} kcal</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Active Quests</p>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">{stats?.activeChallenges || 0}</p>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-4 h-4 text-emerald-400" /> User Directory ({users.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Goal</th>
                <th className="py-2.5 px-3">Fitness Level</th>
                <th className="py-2.5 px-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3">
                    <p className="font-bold text-white">{u.name}</p>
                    <p className="text-[10px] text-slate-500">{u.email}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${u.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-cyan-400 uppercase">{u.goal_type || 'Maintenance'}</td>
                  <td className="py-3 px-3 capitalize">{u.fitness_level || 'Beginner'}</td>
                  <td className="py-3 px-3 text-slate-500">{u.created_at?.split(' ')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Content Management Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Add Exercise Form */}
        <form onSubmit={handleAddExercise} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-emerald-400" /> Add Exercise Template
          </h3>
          <input
            type="text"
            required
            placeholder="Exercise Name"
            value={exName}
            onChange={(e) => setExName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
          />
          <div className="grid grid-cols-2 gap-2">
            <select value={exMuscle} onChange={(e) => setExMuscle(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs">
              <option value="Chest">Chest</option>
              <option value="Back">Back</option>
              <option value="Legs">Legs</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Biceps">Biceps</option>
              <option value="Triceps">Triceps</option>
            </select>
            <select value={exCategory} onChange={(e) => setExCategory(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs">
              <option value="gym">Gym</option>
              <option value="home">Home</option>
            </select>
          </div>
          <textarea
            required
            placeholder="Step-by-step instructions..."
            value={exInstructions}
            onChange={(e) => setExInstructions(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs h-20"
          />
          <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-500 font-bold text-slate-950 text-xs">Save Exercise</button>
        </form>

        {/* Add Meal Form */}
        <form onSubmit={handleAddMeal} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-amber-400" /> Add Meal Template
          </h3>
          <input
            type="text"
            required
            placeholder="Meal Title (e.g. Paneer Bhurji)"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
          />
          <div className="grid grid-cols-2 gap-2">
            <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs">
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
            <select value={mealDiet} onChange={(e) => setMealDiet(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs">
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <input type="number" placeholder="Cal" value={mealCal} onChange={(e) => setMealCal(parseInt(e.target.value))} className="px-2 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs" />
            <input type="number" placeholder="P (g)" value={mealP} onChange={(e) => setMealP(parseInt(e.target.value))} className="px-2 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs" />
            <input type="number" placeholder="C (g)" value={mealC} onChange={(e) => setMealC(parseInt(e.target.value))} className="px-2 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs" />
            <input type="number" placeholder="F (g)" value={mealF} onChange={(e) => setMealF(parseInt(e.target.value))} className="px-2 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs" />
          </div>
          <input
            type="text"
            required
            placeholder="Ingredients (comma separated)"
            value={mealIngredients}
            onChange={(e) => setMealIngredients(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
          />
          <button type="submit" className="w-full py-2.5 rounded-xl bg-amber-500 font-bold text-slate-950 text-xs">Save Meal Template</button>
        </form>

      </div>
    </div>
  );
};
