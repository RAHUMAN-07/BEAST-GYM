import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { TrendingUp, Activity, PlusCircle, Scale } from 'lucide-react';

interface ProgressPageProps {
  onOpenWeightLogger: () => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ onOpenWeightLogger }) => {
  const [summary, setSummary] = useState<any>(null);
  const [measurements, setMeasurements] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const [sRes, mRes] = await Promise.all([
        api.getProgressSummary(),
        api.getBodyMeasurementsHistory()
      ]);
      setSummary(sRes);
      setMeasurements(mRes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const weightData = summary?.weightHistory?.map((item: any) => ({
    date: item.date_logged.split('T')[0],
    weight: item.weight_kg
  })) || [
    { date: '2026-07-01', weight: 74 },
    { date: '2026-07-07', weight: 74.8 },
    { date: '2026-07-14', weight: 75.5 },
    { date: '2026-07-17', weight: 76 }
  ];

  const calorieData = summary?.calorieHistory?.map((item: any) => ({
    date: item.date_logged.split('T')[0],
    calories: item.total_calories
  })) || [
    { date: '2026-07-11', calories: 2350 },
    { date: '2026-07-12', calories: 2600 },
    { date: '2026-07-13', calories: 2500 },
    { date: '2026-07-14', calories: 2800 },
    { date: '2026-07-15', calories: 2750 },
    { date: '2026-07-16', calories: 2650 },
    { date: '2026-07-17', calories: 2800 }
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-10 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-red-500" /> Body Progress & Analytics
          </h2>
          <p className="text-xs text-neutral-400 mt-1">Visualize weight trends, daily calories, and body measurements</p>
        </div>

        <button
          onClick={onOpenWeightLogger}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-white text-xs shadow-lg shadow-red-600/20 hover:scale-105 transition-transform flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4 text-white" /> Log Body Measurements
        </button>
      </div>

      {/* Recharts Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weight Trend Chart */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-red-500" /> Weight Progress Trend (kg)
            </h3>
            <span className="text-xs font-bold text-red-500">Target: 80.0 kg</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="date" stroke="#a3a3a3" fontSize={11} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#a3a3a3" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#121212', borderColor: '#262626', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="weight" stroke="#dc2626" strokeWidth={3} dot={{ fill: '#dc2626', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calorie Intake Bar Chart */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-white" /> Calorie History (Last 7 Days)
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calorieData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="date" stroke="#a3a3a3" fontSize={11} />
                <YAxis stroke="#a3a3a3" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#121212', borderColor: '#262626', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                <Bar dataKey="calories" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Body Measurements History Table */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Body Measurements Log</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Weight</th>
                <th className="py-2.5 px-3">Chest</th>
                <th className="py-2.5 px-3">Waist</th>
                <th className="py-2.5 px-3">Biceps</th>
                <th className="py-2.5 px-3">Thighs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 font-semibold text-white">
              {measurements.map((m, idx) => (
                <tr key={idx} className="hover:bg-neutral-800/50">
                  <td className="py-3 px-3 text-neutral-400">{m.date_logged?.split('T')[0] || 'Today'}</td>
                  <td className="py-3 px-3 text-red-500 font-bold">{m.weight_kg ? `${m.weight_kg} kg` : '-'}</td>
                  <td className="py-3 px-3">{m.chest_cm ? `${m.chest_cm} cm` : '-'}</td>
                  <td className="py-3 px-3">{m.waist_cm ? `${m.waist_cm} cm` : '-'}</td>
                  <td className="py-3 px-3">{m.biceps_cm ? `${m.biceps_cm} cm` : '-'}</td>
                  <td className="py-3 px-3">{m.thighs_cm ? `${m.thighs_cm} cm` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
