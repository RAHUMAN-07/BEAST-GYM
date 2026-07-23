import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  Activity, 
  TrendingUp, 
  Users, 
  Trophy, 
  ShieldAlert, 
  Settings,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onStartOnboarding: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onStartOnboarding }) => {
  const { user, isOnboarded } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'diet', label: 'Diet & Macros', icon: Utensils },
    { id: 'trackers', label: 'Trackers', icon: Activity },
    { id: 'progress', label: 'Analytics', icon: TrendingUp },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'achievements', label: 'Badges', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Console', icon: ShieldAlert });
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-black/90 backdrop-blur-md border-r border-white/10 p-4 sticky top-16 h-[calc(100vh-4rem)] z-30">
        {/* Profile Onboarding Banner */}
        {!isOnboarded && user && (
          <div className="mb-4 p-3.5 rounded-2xl bg-neutral-900 border border-white/15 shadow-lg">
            <p className="text-xs font-bold text-white flex items-center gap-1.5 mb-1 tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-white" /> Setup Profile
            </p>
            <p className="text-[11px] text-slate-400 mb-2">Configure goals for custom workout & diet plans.</p>
            <button
              onClick={onStartOnboarding}
              className="w-full py-1.5 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-extrabold shadow-md transition-all uppercase tracking-wider"
            >
              Start Onboarding
            </button>
          </div>
        )}

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-black shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                <span className="uppercase tracking-wider">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="pt-4 border-t border-white/10 text-[10px] text-slate-500 text-center font-mono uppercase tracking-widest">
          <p>FitPulse Pro v2.4</p>
          <p className="text-white">Liquid Chrome</p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-lg border-t border-white/10 px-2 py-1 flex justify-around">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
                isActive ? 'text-white font-extrabold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
