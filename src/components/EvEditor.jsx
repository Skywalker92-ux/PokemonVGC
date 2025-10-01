'use client';
import React from 'react';
import { evSpreads } from '@/utils/presets.js';

const EV_LIMIT = 510;
const STAT_LIMIT = 252;
const STAT_NAMES = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

export default function EvEditor({ evs, onEvChange }) {
  const totalEvs = Object.values(evs).reduce((sum, ev) => sum + ev, 0);

  const handleChange = (stat, value) => {
    const numericValue = parseInt(value, 10) || 0;
    
    if (numericValue < 0 || numericValue > STAT_LIMIT) return;
    const newEvs = { ...evs, [stat]: numericValue };
    const newTotal = Object.values(newEvs).reduce((sum, ev) => sum + ev, 0);
    if (newTotal > EV_LIMIT) return;

    onEvChange(newEvs);
  };

  const handleSpreadChange = (e) => {
    const selectedLabel = e.target.value;
    const selectedSpread = evSpreads.find(s => s.label === selectedLabel);
    
    if (selectedSpread && selectedSpread.spread) {
      onEvChange(selectedSpread.spread);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <select 
          onChange={handleSpreadChange}
          className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 capitalize"
        >
          {evSpreads.map(s => (
            <option key={s.label} value={s.label}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-slate-400">Puntos de Esfuerzo (EVs)</label>
        <span className={`text-sm font-bold ${totalEvs > EV_LIMIT ? 'text-red-500' : 'text-green-400'}`}>
          Total: {totalEvs} / {EV_LIMIT}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {STAT_NAMES.map(stat => (
          <div key={stat}>
            <label className="text-xs uppercase font-bold text-slate-500">{stat}</label>
            <input
              type="number"
              step="4"
              min="0"
              max="252"
              className="w-full p-1 rounded-md bg-slate-900 border border-slate-700 text-center"
              value={evs[stat]}
              onChange={(e) => handleChange(stat, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}