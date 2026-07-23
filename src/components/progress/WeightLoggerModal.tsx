import React, { useState } from 'react';
import { api } from '../../services/api';
import { X, Scale } from 'lucide-react';

interface WeightLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const WeightLoggerModal: React.FC<WeightLoggerModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [weightKg, setWeightKg] = useState('76');
  const [chestCm, setChestCm] = useState('102');
  const [waistCm, setWaistCm] = useState('82');
  const [bicepsCm, setBicepsCm] = useState('38');
  const [thighsCm, setThighsCm] = useState('58');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.logBodyMeasurements({
        weight_kg: weightKg,
        chest_cm: chestCm,
        waist_cm: waistCm,
        biceps_cm: bicepsCm,
        thighs_cm: thighsCm
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-400" /> Log Weight & Body Tape
        </h3>
        <p className="text-xs text-slate-400 mb-4">Record your current scale weight and tape measurements</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Body Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              required
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Chest (cm)</label>
              <input
                type="number"
                step="0.5"
                value={chestCm}
                onChange={(e) => setChestCm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Waist (cm)</label>
              <input
                type="number"
                step="0.5"
                value={waistCm}
                onChange={(e) => setWaistCm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Biceps (cm)</label>
              <input
                type="number"
                step="0.5"
                value={bicepsCm}
                onChange={(e) => setBicepsCm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Thighs (cm)</label>
              <input
                type="number"
                step="0.5"
                value={thighsCm}
                onChange={(e) => setThighsCm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-bold text-slate-950 text-xs shadow-lg shadow-emerald-500/20"
          >
            {loading ? 'Saving...' : 'Save Measurements'}
          </button>
        </form>
      </div>
    </div>
  );
};
