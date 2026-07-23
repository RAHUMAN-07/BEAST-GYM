import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Challenge } from '../types';
import { Users, Trophy, Megaphone } from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [joinedMap, setJoinedMap] = useState<Record<number, boolean>>({});

  const fetchData = async () => {
    try {
      const [cRes, lRes, tRes] = await Promise.all([
        api.getChallenges(),
        api.getLeaderboard(),
        api.getTips()
      ]);
      setChallenges(cRes);
      setLeaderboard(lRes);
      setTips(tRes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleJoin = async (id: number) => {
    try {
      await api.joinChallenge(id);
      setJoinedMap(prev => ({ ...prev, [id]: true }));
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-10 animate-in fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-400" /> Fitness Community & Leaderboard
        </h2>
        <p className="text-xs text-slate-400 mt-1">Participate in monthly community quests and rank up on the global leaderboard</p>
      </div>

      {/* Monthly Challenges Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-400" /> Active Community Challenges
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map((c) => {
            const isJoined = !!joinedMap[c.id];
            return (
              <div key={c.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase">
                      {c.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{c.participants_count} Joined</span>
                  </div>

                  <h4 className="font-bold text-white text-base">{c.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{c.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400">Target: {c.goal_target}</span>
                  <button
                    onClick={() => handleJoin(c.id)}
                    disabled={isJoined}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isJoined
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-md hover:scale-105'
                    }`}
                  >
                    {isJoined ? 'Joined ✓' : 'Join Quest'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Leaderboard & Tips Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Global Leaderboard */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" /> Global Top Champions
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Athlete</th>
                  <th className="py-2.5 px-3">Workouts</th>
                  <th className="py-2.5 px-3">Calories Burned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-200">
                {leaderboard.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      {idx === 0 && '🥇'}
                      {idx === 1 && '🥈'}
                      {idx === 2 && '🥉'}
                      {idx > 2 && `#${idx + 1}`}
                    </td>
                    <td className="py-3 px-3 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-bold text-white">{user.name}</span>
                    </td>
                    <td className="py-3 px-3 text-cyan-400">{user.total_workouts || 0} sessions</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">{user.total_calories || 0} kcal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coach Advice & Fitness Tips Feed */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Megaphone className="w-4 h-4 text-cyan-400" /> Trainer Tips & Updates
          </h3>

          <div className="space-y-3">
            {tips.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 text-xs">{t.title}</span>
                  <span className="text-[10px] text-slate-500">{t.author}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{t.content}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
