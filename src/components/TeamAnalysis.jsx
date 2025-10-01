// src/components/TeamAnalysis.jsx

'use client';
import React from 'react';
import { typeChart } from '@/utils/typeChart';
import { pokemonTypes } from '@/utils/types';

const TypePill = ({ type, score }) => {
  let colorClass = 'bg-slate-600'; // Neutral
  if (score > 1.5) colorClass = 'bg-red-600'; // Very Weak
  else if (score > 0) colorClass = 'bg-red-800'; // Weak
  else if (score < -1.5) colorClass = 'bg-green-600'; // Very Resistant
  else if (score < 0) colorClass = 'bg-green-800'; // Resistant

  return (
    <div className={`flex items-center justify-center p-1 rounded-full text-white text-xs font-bold ${colorClass}`} title={`${score.toFixed(1)}x`}>
      <img src={`/${type}.png`} alt={type} className="w-4 h-4" />
    </div>
  );
};

export default function TeamAnalysis({ team }) {
  if (team.length === 0) return null;

  const analysis = pokemonTypes.reduce((acc, attackingType) => {
    let totalScore = 0;
    
    team.forEach(member => {
      const defendingTypes = member.details.types.map(t => t.type.name);
      let multiplier = 1;
      
      defendingTypes.forEach(defendingType => {
        multiplier *= typeChart[attackingType]?.[defendingType] ?? 1;
      });
      
      if (multiplier >= 2) totalScore += multiplier / 2;
      if (multiplier < 1 && multiplier > 0) totalScore -= (1 / multiplier) / 2;
      if (multiplier === 0) totalScore -= 2;
    });
    
    acc[attackingType] = totalScore;
    return acc;
  }, {});

  return (
    <div className="bg-slate-800 p-4 rounded-lg mt-4">
      <h3 className="text-lg font-bold mb-3 text-slate-200">Team Type Analysis</h3>
      <div className="grid grid-cols-6 md:grid-cols-9 gap-1">
        {pokemonTypes.map(type => (
          <TypePill key={type} type={type} score={analysis[type]} />
        ))}
      </div>
    </div>
  );
}