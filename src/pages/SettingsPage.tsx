import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, RefreshCw } from 'lucide-react';

interface SettingsPageProps {
  onStartOnboarding: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onStartOnboarding }) => {
  const { user, profile, goal } = useAuth();

  return (
    <div className="space-y-6 pb-20 md:pb-10 animate-in fade-in max-w-4xl">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-400" /> Account & Profile Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">Manage account security, personal metrics, and goal preferences</p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-lg">
              {user?.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{user?.name}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={onStartOnboarding}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Re-run Onboarding Setup
          </button>
        </div>

        {/* Current Config Values */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4 border-t border-slate-800">
          <div>
            <p className="text-[10px] text-slate-500 font-semibold">Goal Type</p>
            <p className="font-bold text-cyan-400 uppercase">{goal?.goal_type || 'Maintenance'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-semibold">Calorie Target</p>
            <p className="font-bold text-white">{goal?.tdee_calories || 2200} kcal</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-semibold">Dietary Preference</p>
            <p className="font-bold text-amber-400 capitalize">{profile?.dietary_pref || 'Vegetarian'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-semibold">Fitness Level</p>
            <p className="font-bold text-emerald-400 capitalize">{profile?.fitness_level || 'Intermediate'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
