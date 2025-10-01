'use client';
import React from 'react';

const statLabels = {
  hp: 'HP',
  atk: 'Ataque',
  def: 'Defensa',
  spa: 'At. Esp.',
  spd: 'Def. Esp.',
  spe: 'Velocidad'
};

export default function StatDisplay({ finalStats, evs }) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-400 block mb-1">Estadísticas Finales (Nivel 50)</label>
      <div className="bg-slate-900 p-2 rounded-md">
        <ul>
          {Object.entries(finalStats).map(([stat, value]) => (
            <li key={stat} className="grid grid-cols-4 items-center gap-2 text-sm mb-1">
              <span className="font-bold uppercase text-slate-500">{statLabels[stat]}</span>
              <div className="col-span-2 bg-slate-700 h-4 rounded-full">
                <div 
                  className="bg-sky-500 h-4 rounded-full" 
                  style={{ width: `${(evs[stat] / 252) * 100}%` }}
                ></div>
              </div>
              <span className="font-bold text-lg text-right">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}