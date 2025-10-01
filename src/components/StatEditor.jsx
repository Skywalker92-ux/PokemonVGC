'use client';
import React from 'react';
import { calculateStats } from '@/utils/statCalculator.js';
import { genericEvSpreads, pokemonPresets, ivSpreads } from '@/utils/presets.js';

const EV_LIMIT = 510;
const STAT_LIMIT = 252;
const IV_LIMIT = 31;
const STAT_NAMES_FULL = { hp: 'HP', atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed' };
const STAT_MAP_API = { hp: 'hp', attack: 'atk', defense: 'def', 'special-attack': 'spa', 'special-defense': 'spd', speed: 'spe' };

export default function StatEditor({ member, onCustomizationChange }) {
  // --- GUARD: Add this block to prevent crashes on load ---
  if (!member || !member.details || !member.customization) {
    return <div className="bg-slate-700/50 p-4 rounded-lg text-slate-400">Cargando...</div>;
  }
  // --- End of GUARD ---

  const { details, customization } = member;
  const { evs, ivs } = customization;

  const pokemonName = details.name.toLowerCase();
  
  const baseStats = {};
  details.stats.forEach(stat => {
    const statKey = STAT_MAP_API[stat.stat.name];
    baseStats[statKey] = stat.base_stat;
  });

  const finalStats = calculateStats(details, customization);
  const totalEvs = Object.values(evs).reduce((sum, val) => sum + val, 0);
  const remainingEvs = 510 - totalEvs;

  const handleEvChange = (stat, value) => {
    const newValue = Math.max(0, Math.min(STAT_LIMIT, Number(value)));
    const currentStatEv = evs[stat];
    const diff = newValue - currentStatEv;
    if (totalEvs + diff > EV_LIMIT) {
      const allowedDiff = EV_LIMIT - totalEvs;
      const adjustedValue = currentStatEv + allowedDiff;
      onCustomizationChange({ ...customization, evs: { ...evs, [stat]: adjustedValue } });
    } else {
      onCustomizationChange({ ...customization, evs: { ...evs, [stat]: newValue } });
    }
  };

  const handleEvBlur = (stat, value) => {
    const numericValue = parseInt(value, 10) || 0;
    const correctedValue = Math.round(numericValue / 4) * 4;
    if (correctedValue !== numericValue) {
      handleEvChange(stat, correctedValue);
    }
  };
  
  const handleIvChange = (stat, value) => {
    const newValue = Math.max(0, Math.min(IV_LIMIT, Number(value)));
    onCustomizationChange({ ...customization, ivs: { ...ivs, [stat]: newValue } });
  };
  
  const handleIvSpreadChange = (e) => {
    const selectedLabel = e.target.value;
    const selectedSpread = ivSpreads.find(s => s.label === selectedLabel);
    if (selectedSpread && selectedSpread.spread) {
      onCustomizationChange({ ...customization, ivs: selectedSpread.spread });
    }
  };

  const getEvBarColor = (currentEvs) => {
    if (currentEvs <= 0) return 'bg-slate-700';
    if (currentEvs < 100) return 'bg-red-500';
    if (currentEvs < 200) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-slate-700/50 p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-4 text-slate-200">Editor de Estadísticas</h3>
      
      {/* --- CHANGED: The container now only holds one select --- */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        {/* --- REMOVED: The EV Spread selector has been deleted --- */}
        
        {/* This is the remaining IV Spread selector */}
        <select 
          onChange={handleIvSpreadChange}
          className="w-full p-2 rounded-md bg-slate-800 border border-slate-600"
          value="placeholder"
        >
          <option value="placeholder" disabled>{ivSpreads[0].label}</option>
          {ivSpreads.slice(1).map(s => (
            <option key={s.label} value={s.label}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-[80px_1fr_45px_40px] gap-x-3 gap-y-2 items-center text-sm">
        <span className="font-bold text-slate-400">Base</span>
        <span className="font-bold text-slate-400">EVs</span>
        <span className="font-bold text-slate-400 text-center">IVs</span>
        <span className="font-bold text-slate-400 text-right">Total</span>
        
        {Object.keys(STAT_NAMES_FULL).map(statKey => {
          const baseStatValue = baseStats[statKey];
          const currentEvs = evs[statKey];
          
          return (
            <React.Fragment key={statKey}>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-300">{STAT_NAMES_FULL[statKey]}</span>
                <span className="w-6 text-right font-mono">{baseStatValue}</span>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="252"
                    step="4"
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer pokeball-slider"
                    value={currentEvs}
                    onChange={(e) => handleEvChange(statKey, e.target.value)}
                    style={{'--slider-fill-percentage': `${(currentEvs / 252) * 100}%`}}
                  />
                  <input
                    type="number"
                    min="0"
                    max="252"
                    className="w-16 p-1 rounded-md bg-slate-900 border border-slate-700 text-center"
                    value={currentEvs}
                    onChange={(e) => handleEvChange(statKey, e.target.value)}
                    onBlur={(e) => handleEvBlur(statKey, e.target.value)}
                  />
                </div>
                <div className="w-full bg-slate-700 h-1 rounded-full mt-1">
                  <div 
                    className={`${getEvBarColor(currentEvs)} h-1 rounded-full`}
                    style={{ width: `${(currentEvs / 252) * 100}%` }}
                  />
                </div>
              </div>
              
              <input
                type="number"
                min="0"
                max="31"
                value={ivs[statKey]}
                onChange={(e) => handleIvChange(statKey, e.target.value)}
                className="w-full p-1 bg-slate-900 border border-slate-700 text-center"
              />
              
              <span className="font-bold text-lg text-right font-mono">{finalStats[statKey]}</span>
            </React.Fragment>
          );
        })}
      </div>
       <div className="text-right text-sm font-bold text-green-400 mt-4">
         Restantes: {remainingEvs}
       </div>
    </div>
  );
}