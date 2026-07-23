import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { AuthModal } from './components/auth/AuthModal';
import { OpeningScreen } from './components/common/OpeningScreen';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { ActiveWorkoutModal } from './components/workouts/ActiveWorkoutModal';
import { MealLoggerModal } from './components/nutrition/MealLoggerModal';
import { GroceryListModal } from './components/nutrition/GroceryListModal';
import { WeightLoggerModal } from './components/progress/WeightLoggerModal';

import { LandingPage } from './pages/LandingPage';
import { WorkoutPlannerPage } from './pages/WorkoutPlannerPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkoutsPage } from './pages/WorkoutsPage';
import { DietPage } from './pages/DietPage';
import { ProgressPage } from './pages/ProgressPage';
import { TrackersPage } from './pages/TrackersPage';
import { CommunityPage } from './pages/CommunityPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { AdminPage } from './pages/AdminPage';
import { SettingsPage } from './pages/SettingsPage';
import type { Workout } from './types';

const MainApp: React.FC = () => {
  const { user, isOnboarded, isLoading } = useAuth();

  const [showOpening, setShowOpening] = useState(() => {
    return !sessionStorage.getItem('fitpulse_intro_seen');
  });

  const handleOpeningComplete = () => {
    sessionStorage.setItem('fitpulse_intro_seen', '1');
    setShowOpening(false);
  };

  const [activeTab, setActiveTab] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [mealLoggerOpen, setMealLoggerOpen] = useState(false);
  const [groceryListOpen, setGroceryListOpen] = useState(false);
  const [weightLoggerOpen, setWeightLoggerOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070d19] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-orange-400">Loading Beast Gym...</p>
      </div>
    );
  }

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    if (!isOnboarded) {
      setOnboardingOpen(true);
    } else {
      setActiveTab('dashboard');
    }
  };

  // Determine which tab/page to show
  const currentTab = user
    ? activeTab === 'home' || activeTab === 'about' || activeTab === 'services' || activeTab === 'gallery' || activeTab === 'contact' || activeTab === 'planner'
      ? 'dashboard'
      : activeTab
    : activeTab === 'home' || activeTab === '' ? 'home' : activeTab;

  return (
    <div className="min-h-screen bg-[#050a07] text-white flex flex-col relative overflow-x-hidden">
      {/* Cinematic Opening Screen */}
      {showOpening && <OpeningScreen onComplete={handleOpeningComplete} />}

      {/* Top Navigation — single layer */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onStartOnboarding={() => setOnboardingOpen(true)}
        activeTab={currentTab}
        setActiveTab={setActiveTab}
      />

      {/* ─── SINGLE CONTENT AREA — no sidebar ─────────────────────────── */}
      <main className="flex-1 relative z-10">

        {/* ── PUBLIC PAGES ─────────────────────────────────── */}
        {!user && currentTab === 'home' && (
          <LandingPage
            onGetStarted={() => handleOpenAuth('signup')}
            onLogin={() => handleOpenAuth('login')}
            onGoToPlanner={() => setActiveTab('planner')}
          />
        )}
        {!user && currentTab === 'planner' && (
          <WorkoutPlannerPage onGetStarted={() => handleOpenAuth('signup')} />
        )}
        {!user && currentTab === 'about' && <AboutPage />}
        {!user && currentTab === 'services' && (
          <ServicesPage onGetStarted={() => handleOpenAuth('signup')} />
        )}
        {!user && currentTab === 'gallery' && <GalleryPage />}
        {!user && currentTab === 'contact' && <ContactPage />}

        {/* ── AUTHENTICATED PAGES ──────────────────────────── */}
        {user && currentTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <DashboardPage
              onStartWorkout={(w) => setActiveWorkout(w)}
              onOpenMealLogger={() => setMealLoggerOpen(true)}
              onOpenWeightLogger={() => setWeightLoggerOpen(true)}
              setActiveTab={setActiveTab}
            />
          </div>
        )}
        {user && currentTab === 'workouts' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <WorkoutsPage onStartWorkout={(w) => setActiveWorkout(w)} />
          </div>
        )}
        {user && currentTab === 'diet' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <DietPage
              onOpenMealLogger={() => setMealLoggerOpen(true)}
              onOpenGroceryList={() => setGroceryListOpen(true)}
            />
          </div>
        )}
        {user && currentTab === 'progress' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ProgressPage onOpenWeightLogger={() => setWeightLoggerOpen(true)} />
          </div>
        )}
        {user && currentTab === 'trackers' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <TrackersPage />
          </div>
        )}
        {user && currentTab === 'community' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <CommunityPage />
          </div>
        )}
        {user && currentTab === 'achievements' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <AchievementsPage />
          </div>
        )}
        {user && currentTab === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <AdminPage />
          </div>
        )}
        {user && currentTab === 'settings' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <SettingsPage onStartOnboarding={() => setOnboardingOpen(true)} />
          </div>
        )}
      </main>

      {/* ── MODALS ──────────────────────────────────────────── */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />
      <OnboardingWizard
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onComplete={() => setActiveTab('dashboard')}
      />
      <ActiveWorkoutModal
        workout={activeWorkout}
        isOpen={!!activeWorkout}
        onClose={() => setActiveWorkout(null)}
        onFinishSuccess={() => setActiveTab('dashboard')}
      />
      <MealLoggerModal
        isOpen={mealLoggerOpen}
        onClose={() => setMealLoggerOpen(false)}
        onSuccess={() => {}}
      />
      <GroceryListModal
        isOpen={groceryListOpen}
        onClose={() => setGroceryListOpen(false)}
      />
      <WeightLoggerModal
        isOpen={weightLoggerOpen}
        onClose={() => setWeightLoggerOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
