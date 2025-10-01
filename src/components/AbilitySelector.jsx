'use client';
import React from 'react';
import { abilityData } from '@/utils/abilities';

export default function AbilitySelector({ availableAbilities, selectedAbility, onSelect }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [containerRef]);

  const handleSelect = (abilityName) => {
    onSelect(abilityName);
    setIsOpen(false);
  };

  const currentAbility = abilityData[selectedAbility] || { name: selectedAbility };
  
  const normalAbilities = availableAbilities.filter(a => !a.is_hidden);
  const hiddenAbility = availableAbilities.find(a => a.is_hidden);

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="text-sm font-semibold text-slate-400 block mb-1">Habilidad</label>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 flex items-center justify-between text-left"
      >
        <span className="capitalize">{currentAbility.name.replace('-', ' ')}</span>
        <span className="text-slate-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 top-full mt-1 w-full bg-slate-800 border border-slate-600 rounded-md shadow-lg max-h-80 overflow-y-auto p-2">
          <ul>
            {normalAbilities.length > 0 && (
              <li>
                <h3 className="text-xs font-bold text-slate-500 mt-1 mb-1 px-2">Abilities</h3>
                <ul>
                  {normalAbilities.map(({ ability }) => (
                    <li 
                      key={ability.name}
                      onClick={() => handleSelect(ability.name)}
                      className="p-2 hover:bg-slate-700 rounded-md cursor-pointer"
                    >
                      <p className="font-semibold capitalize">{ability.name.replace('-', ' ')}</p>
                      <p className="text-xs text-slate-400">{abilityData[ability.name]?.description || 'No description available.'}</p>
                    </li>
                  ))}
                </ul>
              </li>
            )}
            {hiddenAbility && (
              <li>
                <h3 className="text-xs font-bold text-slate-500 mt-2 mb-1 px-2">Hidden Ability</h3>
                <ul>
                   <li 
                      key={hiddenAbility.ability.name}
                      onClick={() => handleSelect(hiddenAbility.ability.name)}
                      className="p-2 hover:bg-slate-700 rounded-md cursor-pointer"
                    >
                      <p className="font-semibold capitalize">{hiddenAbility.ability.name.replace('-', ' ')}</p>
                      <p className="text-xs text-slate-400">{abilityData[hiddenAbility.ability.name]?.description || 'No description available.'}</p>
                    </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}