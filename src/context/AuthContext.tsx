import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Profile, Goal } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  goal: Goal | null;
  token: string | null;
  isOnboarded: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setIsOnboarded: (val: boolean) => void;
  setUserData: (user: User, profile?: Profile, goal?: Goal) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('fitpulse_token'));
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await api.getMe();
      setUser(data.user);
      setProfile(data.profile);
      setGoal(data.goal);
      setIsOnboarded(data.isOnboarded);
    } catch (err) {
      console.error('Refresh user failed:', err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password });
    localStorage.setItem('fitpulse_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setProfile(data.profile || null);
    setGoal(data.goal || null);
    setIsOnboarded(data.isOnboarded || false);
    return data;
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await api.register({ name, email, password });
    localStorage.setItem('fitpulse_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setIsOnboarded(false);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('fitpulse_token');
    setToken(null);
    setUser(null);
    setProfile(null);
    setGoal(null);
    setIsOnboarded(false);
  };

  const setUserData = (newUser: User, newProfile?: Profile, newGoal?: Goal) => {
    setUser(newUser);
    if (newProfile) setProfile(newProfile);
    if (newGoal) setGoal(newGoal);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        goal,
        token,
        isOnboarded,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        setIsOnboarded,
        setUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
