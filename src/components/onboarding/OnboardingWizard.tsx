import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Dumbbell, 
  Utensils, 
  Target, 
  User as UserIcon,
  Zap,
  Sparkles
} from 'lucide-react';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ isOpen, onClose, onComplete }) => {
  const { user, setUserData, setIsOnboarded } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    age: 26,
    gender: 'male',
    height_cm: 175,
    weight_kg: 70,
    target_weight_kg: 75,
    fitness_level: 'intermediate',
    activity_level: 'moderate',
    body_type: 'mesomorph',
    workout_exp: 'intermediate',
    workout_setting: 'gym',
    goal_type: 'bulking',
    custom_goal: '',
    dietary_pref: 'vegetarian',
    health_restrictions: ''
  });

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Live BMR / TDEE Calculation for Step 5 preview
  const calculateLiveMacros = () => {
    const isMale = formData.gender === 'male';
    const bmr = 10 * formData.weight_kg + 6.25 * formData.height_cm - 5 * formData.age + (isMale ? 5 : -161);
    const mults: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const tdee = Math.round(bmr * (mults[formData.activity_level] || 1.4));

    let calories = tdee;
    if (formData.goal_type === 'bulking') calories += 450;
    else if (formData.goal_type === 'weight_loss') calories -= 500;
    else if (formData.goal_type === 'cutting') calories -= 400;
    else if (formData.goal_type === 'strength') calories += 250;
    else if (formData.goal_type === 'cardio') calories -= 300;

    calories = Math.max(1200, Math.round(calories));
    const protein = Math.round(formData.weight_kg * (formData.goal_type === 'bulking' || formData.goal_type === 'cutting' ? 2.2 : 1.8));
    const fats = Math.round((calories * 0.25) / 9);
    const carbs = Math.max(0, Math.round((calories - (protein * 4 + fats * 9)) / 4));

    return { bmr: Math.round(bmr), tdee: calories, protein, carbs, fats };
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const res = await api.saveOnboarding(formData);
      setIsOnboarded(true);
      if (user) {
        setUserData(user, { user_id: user.id, ...formData } as any, { user_id: user.id, ...formData, tdee_calories: res.summary.tdee, target_protein: res.summary.proteinGrams, target_carbs: res.summary.carbGrams, target_fats: res.summary.fatGrams } as any);
      }
      onComplete();
      onClose();
    } catch (err) {
      console.error('Onboarding submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const macros = calculateLiveMacros();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header Step Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span>FITNESS ONBOARDING</span>
            <span className="text-emerald-400">Step {step} of 5</span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-full flex-1 transition-all duration-300 ${
                  s <= step ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : 'bg-transparent'
                } ${s !== 5 ? 'border-r border-slate-900' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Form Body Step Switcher */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Personal Details</h4>
                  <p className="text-xs text-slate-400">Help us calculate your basal metabolic rate (BMR)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange('age', parseInt(e.target.value) || 20)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={formData.height_cm}
                    onChange={(e) => handleChange('height_cm', parseFloat(e.target.value) || 170)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Current Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.weight_kg}
                    onChange={(e) => handleChange('weight_kg', parseFloat(e.target.value) || 70)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Metrics & Experience */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Activity & Experience</h4>
                  <p className="text-xs text-slate-400">Tell us about your daily activity and preferred workout environment</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Workout Environment</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['gym', 'home'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChange('workout_setting', opt)}
                        className={`p-3 rounded-xl border text-xs font-bold uppercase transition-all ${
                          formData.workout_setting === opt
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {opt === 'gym' ? '🏋️ Gym Workout' : '🏠 Home Bodyweight'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Activity Level</label>
                  <select
                    value={formData.activity_level}
                    onChange={(e) => handleChange('activity_level', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  >
                    <option value="sedentary">Sedentary (Little/no exercise)</option>
                    <option value="light">Lightly Active (1-3 days/week)</option>
                    <option value="moderate">Moderately Active (3-5 days/week)</option>
                    <option value="active">Very Active (6-7 days intense)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Fitness Level</label>
                    <select
                      value={formData.fitness_level}
                      onChange={(e) => handleChange('fitness_level', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Body Type</label>
                    <select
                      value={formData.body_type}
                      onChange={(e) => handleChange('body_type', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                    >
                      <option value="ectomorph">Ectomorph (Lean / Hardgainer)</option>
                      <option value="mesomorph">Mesomorph (Athletic / Muscular)</option>
                      <option value="endomorph">Endomorph (Gain weight easily)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Goal Selection */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-fire-500/20 text-fire-400 flex items-center justify-center font-bold">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Choose Primary Goal</h4>
                  <p className="text-xs text-slate-400">Select your fitness objective for tailored routines & diet</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'bulking', name: 'Bulking', desc: 'Gain Muscle Mass' },
                  { id: 'weight_loss', name: 'Weight Loss', desc: 'Burn Fat' },
                  { id: 'cutting', name: 'Cutting', desc: 'Preserve Muscle & Lean Out' },
                  { id: 'strength', name: 'Strength Training', desc: 'Build Power' },
                  { id: 'maintenance', name: 'Maintenance', desc: 'Stay Fit & Healthy' },
                  { id: 'cardio', name: 'Cardio & Stamina', desc: 'Heart Health' },
                  { id: 'flexibility', name: 'Mobility', desc: 'Flexibility & Joints' },
                  { id: 'endurance', name: 'Endurance', desc: 'Stamina Building' },
                  { id: 'custom', name: 'Custom Goal', desc: 'Personal Target' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleChange('goal_type', g.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      formData.goal_type === g.id
                        ? 'bg-emerald-500/20 border-emerald-500 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-800/80 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <p className={`text-xs font-bold ${formData.goal_type === g.id ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {g.name}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{g.desc}</p>
                  </button>
                ))}
              </div>

              {formData.goal_type === 'custom' && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={formData.custom_goal}
                    onChange={(e) => handleChange('custom_goal', e.target.value)}
                    placeholder="Describe your custom fitness goal..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Dietary Preferences & Restrictions */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Diet & Health Preferences</h4>
                  <p className="text-xs text-slate-400">We offer specialized Indian & Global food options</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Diet Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'vegetarian', label: '🌱 Vegetarian (Paneer, Dal, Tofu)' },
                      { id: 'non-vegetarian', label: '🍗 Non-Vegetarian (Eggs, Chicken)' },
                      { id: 'vegan', label: '🌿 Vegan (100% Plant Based)' },
                      { id: 'flexitarian', label: '🥗 Flexitarian / All Options' }
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => handleChange('dietary_pref', d.id)}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                          formData.dietary_pref === d.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Health Restrictions / Injuries (Optional)</label>
                  <input
                    type="text"
                    value={formData.health_restrictions}
                    onChange={(e) => handleChange('health_restrictions', e.target.value)}
                    placeholder="e.g. Knee pain, lactose intolerance, lower back sensitivity"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Calculated Plan Summary Preview */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Personalized AI Fitness Plan</h4>
                  <p className="text-xs text-slate-400">Calculated based on your Mifflin-St Jeor metabolic profile</p>
                </div>
              </div>

              {/* Macro & Calorie Summary Grid */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Daily Target Caloric Intake</p>
                    <p className="text-2xl font-extrabold text-emerald-400 flex items-baseline gap-1">
                      {macros.tdee} <span className="text-xs font-semibold text-slate-300">kcal/day</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Est. BMR</p>
                    <p className="text-sm font-bold text-cyan-400">{macros.bmr} kcal</p>
                  </div>
                </div>

                {/* Macro Split Cards */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-center">
                    <p className="text-[10px] text-slate-400 font-semibold">PROTEIN</p>
                    <p className="text-base font-extrabold text-emerald-400">{macros.protein}g</p>
                    <p className="text-[9px] text-slate-500">{(macros.protein * 4)} kcal</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-center">
                    <p className="text-[10px] text-slate-400 font-semibold">CARBS</p>
                    <p className="text-base font-extrabold text-cyan-400">{macros.carbs}g</p>
                    <p className="text-[9px] text-slate-500">{(macros.carbs * 4)} kcal</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-center">
                    <p className="text-[10px] text-slate-400 font-semibold">FATS</p>
                    <p className="text-base font-extrabold text-amber-400">{macros.fats}g</p>
                    <p className="text-[9px] text-slate-500">{(macros.fats * 9)} kcal</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Routine: 3-Day Split ({formData.workout_setting.toUpperCase()}) for {formData.goal_type.toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-bold text-slate-950 text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform flex items-center gap-1.5"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-bold text-slate-950 text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform flex items-center gap-1.5"
            >
              {loading ? 'Generating Plan...' : 'Generate My Fitness Journey'} <Check className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
