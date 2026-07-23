import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell, User as UserIcon, LogOut, ShieldAlert, Bell, Sparkles, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onStartOnboarding: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const PUBLIC_NAV = [
  { id: 'home',     label: 'Home' },
  { id: 'about',    label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'gallery',  label: 'Gallery' },
  { id: 'planner',  label: '🎯 Get My Plan', highlight: true },
  { id: 'contact',  label: 'Contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onStartOnboarding, activeTab, setActiveTab }) => {
  const { user, logout, isOnboarded } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#050a07]/90 backdrop-blur-xl border-b border-[#00ff66]/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <div
          onClick={() => { setActiveTab(user ? 'dashboard' : 'home'); setMobileMenuOpen(false); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#00ff66] text-[#050a07] flex items-center justify-center shadow-lg shadow-[#00ff66]/30 group-hover:scale-105 transition-all">
            <Dumbbell className="w-6 h-6 transform -rotate-12" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase italic font-anton">
              BEAST<span className="text-[#00ff66]"> GYM</span>
            </span>
            <span className="hidden sm:block text-[9px] uppercase font-extrabold tracking-widest text-[#10b981] font-mono">
              ATHLETIC SANCTUARY
            </span>
          </div>
        </div>

        {/* Desktop Public Nav (only when logged out) */}
        {!user && (
          <nav className="hidden md:flex items-center gap-1">
            {PUBLIC_NAV.map(n => (
              <button
                key={n.id}
                onClick={() => setActiveTab(n.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  (n as { highlight?: boolean }).highlight
                    ? activeTab === n.id
                      ? 'bg-[#00ff66] text-[#050a07] shadow-lg shadow-[#00ff66]/40 scale-105 font-bold'
                      : 'bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40 hover:bg-[#00ff66] hover:text-[#050a07] hover:scale-105'
                    : activeTab === n.id
                      ? 'bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30'
                      : 'text-slate-400 hover:text-white hover:bg-emerald-950/40'
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {!isOnboarded && (
                <button
                  onClick={onStartOnboarding}
                  className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#00ff66] text-[#050a07] font-extrabold text-xs shadow-lg shadow-[#00ff66]/20 transition-all uppercase tracking-wider hover:bg-[#34d399]"
                >
                  <Sparkles className="w-4 h-4" />
                  Complete Setup
                </button>
              )}

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-slate-300 hover:text-[#00ff66] rounded-xl hover:bg-[#0f1c14] border border-emerald-900 transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00ff66]" />
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-[#080e0a] border border-emerald-900 rounded-2xl shadow-2xl p-4 text-xs z-50">
                    <h4 className="font-bold text-white mb-2 flex items-center justify-between tracking-wider uppercase font-anton">
                      Notifications
                      <span className="text-[10px] text-[#00ff66] font-mono">Live</span>
                    </h4>
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-[#050a07] border border-emerald-950">
                        <p className="font-semibold text-white">Hydration Target 💧</p>
                        <p className="text-slate-400 text-[11px]">Log your morning 500ml water target!</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#050a07] border border-emerald-950">
                        <p className="font-semibold text-white">Push Day Routine 🏋️</p>
                        <p className="text-slate-400 text-[11px]">Chest & Triceps routine active for today.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-[#080e0a] hover:bg-[#0f1c14] border border-emerald-900 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#00ff66] text-[#050a07] font-black flex items-center justify-center text-sm shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-xs font-bold text-white">{user.name}</span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#080e0a] border border-emerald-900 rounded-2xl shadow-2xl p-2 text-xs z-50">
                    <div className="px-3 py-2 border-b border-emerald-950 mb-1">
                      <p className="font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/30">
                        {user.role}
                      </span>
                    </div>
                    <button onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#0f1c14] text-white flex items-center gap-2 font-semibold">
                      <UserIcon className="w-4 h-4 text-[#00ff66]" /> Settings
                    </button>
                    {user.role === 'admin' && (
                      <button onClick={() => { setActiveTab('admin'); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-white flex items-center gap-2 font-semibold">
                        <ShieldAlert className="w-4 h-4 text-orange-400" /> Admin Console
                      </button>
                    )}
                    <button onClick={() => { logout(); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 flex items-center gap-2 mt-1 border-t border-slate-800 font-semibold">
                      <LogOut className="w-4 h-4 text-slate-400" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <button onClick={() => onOpenAuth('login')} className="hidden sm:block px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wider">
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-5 py-2.5 text-xs font-black bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition-all uppercase tracking-wider"
              >
                Join Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && !user && (
        <div className="md:hidden bg-[#0b1329] border-t border-slate-800 px-4 py-4 space-y-1">
          {PUBLIC_NAV.map(n => (
            <button
              key={n.id}
              onClick={() => { setActiveTab(n.id); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === n.id
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              {n.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800">
            <button onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase text-slate-300 hover:text-white">Log In</button>
          </div>
        </div>
      )}
    </header>
  );
};
