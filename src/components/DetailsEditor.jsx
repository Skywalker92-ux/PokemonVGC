'use client';
import React from 'react';
import { pokemonTypes } from '@/utils/types.js';

export default function DetailsEditor({ customization, onUpdate, memberId }) {
  const handleDetailChange = (field, value) => {
    onUpdate({ ...customization, [field]: value });
  };

  return (
    <div className="bg-slate-900/50 p-3 rounded-md">
      <h4 className="text-sm font-bold text-slate-400 mb-2">Details</h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <label className="text-xs">Level</label>
          <input 
            type="number"
            min="1"
            max="100"
            value={customization.level}
            onChange={(e) => handleDetailChange('level', parseInt(e.target.value) || 1)}
            className="w-full p-1 bg-slate-800 border border-slate-700 rounded-md"
          />
        </div>
        <div>
          <label className="text-xs">Shiny</label>
          <div className="flex items-center gap-2 mt-1">
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" name={`shiny-${memberId}`} checked={!customization.shiny} onChange={() => handleDetailChange('shiny', false)} /> No
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" name={`shiny-${memberId}`} checked={customization.shiny} onChange={() => handleDetailChange('shiny', true)} /> Yes
            </label>
          </div>
        </div>
        <div>
          <label className="text-xs">Tera Type</label>
          <select 
            value={customization.teraType}
            onChange={(e) => handleDetailChange('teraType', e.target.value)}
            className="w-full p-1 bg-slate-800 border border-slate-700 rounded-md capitalize"
          >
            {pokemonTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}