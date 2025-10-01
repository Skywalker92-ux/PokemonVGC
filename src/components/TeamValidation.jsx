'use client';
import React from 'react';

export default function TeamValidation({ warnings }) {
  if (warnings.length === 0) return null;

  return (
    <div className="bg-yellow-900/50 border border-yellow-700 p-3 rounded-lg mt-4">
      <h4 className="text-md font-bold text-yellow-300 mb-2">Segun las reglas oficiales establecidas por The Pokémon Company para sus torneos competitivos, conocidos como VGC (Video Game Championships).</h4>
      <h3 className="text-md font-bold text-yellow-300 mb-2">Advertencias del Formato</h3>
      <ul className="list-disc list-inside space-y-1">
        {warnings.map((warning, index) => (
          <li key={index} className="text-sm text-yellow-200">
            {warning}
          </li>
        ))}
      </ul>
    </div>
  );
}