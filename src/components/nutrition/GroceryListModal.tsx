import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { X, ShoppingCart, Check, Copy } from 'lucide-react';

interface GroceryListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroceryListModal: React.FC<GroceryListModalProps> = ({ isOpen, onClose }) => {
  const [items, setItems] = useState<string[]>([]);
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getGroceryList().then(res => setItems(res.items || []));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleCheck = (item: string) => {
    setCheckedMap(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const handleCopy = () => {
    const text = items.map(i => `- ${i}`).join('\n');
    navigator.clipboard.writeText(`FitPulse Grocery Checklist:\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[85vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-cyan-400" /> Smart Grocery List
          </h3>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] font-semibold flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {items.map((item, idx) => {
            const isChecked = !!checkedMap[item];
            return (
              <button
                key={idx}
                onClick={() => toggleCheck(item)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                  isChecked
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 line-through'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{item}</span>
                <span className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600'}`}>
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
