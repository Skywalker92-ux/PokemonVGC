// src/components/PokemonEditor.jsx

'use client';
import React, { useState } from 'react';
import StatEditor from './StatEditor.jsx';
import DetailsEditor from './DetailsEditor.jsx';
import ItemSelector from './ItemSelector.jsx';
import MoveSelector from './MoveSelector.jsx';
import AbilitySelector from './AbilitySelector.jsx';
import TeamValidation from './TeamValidation.jsx';
import { getNatureEffectText } from '@/utils/statCalculator.js';
import { validateTeam } from '@/utils/teamValidator.js';

const TabButton = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-md ${
      isActive 
        ? 'text-white bg-slate-700/50' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
    }`}
  >
    {children}
  </button>
);

export default function PokemonEditor({ team, member, onRemove, onUpdate, natures }) {
  const [activeTab, setActiveTab] = useState('Stats');
  const { id, details, customization } = member;

  const handleFieldChange = (fieldName, value) => {
    onUpdate(id, { ...customization, [fieldName]: value });
  };
  
  const handleMoveChange = (moveIndex, newMove) => {
    const newMoves = [...customization.moves];
    newMoves[moveIndex] = newMove;
    onUpdate(id, { ...customization, moves: newMoves });
  };

  const TypePill = ({ type }) => (
    <img src={`/${type}.png`} alt={type} title={type} className="h-5" />
  );
  
  const animatedSprite = customization.shiny 
    ? details.sprites.other.showdown.front_shiny 
    : details.sprites.other.showdown.front_default;
  const staticSprite = customization.shiny 
    ? details.sprites.front_shiny 
    : details.sprites.front_default;
  const spriteUrl = animatedSprite || staticSprite;
  
  const validationWarnings = validateTeam(team);

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 w-full">
      <header className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <img src={spriteUrl} alt={details.name} className="w-24 h-24 -mt-8" />
          <div>
            <h2 className="text-3xl font-bold capitalize">{details.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              {details.types.map(({ type }) => (
                <TypePill key={type.name} type={type.name} />
              ))}
            </div>
          </div>
        </div>
        <button onClick={() => onRemove(id)} className="text-2xl text-red-500 hover:text-red-400 font-bold">&times;</button>
      </header>
      
      <nav className="flex border-b border-slate-700 mb-6">
        <TabButton isActive={activeTab === 'Stats'} onClick={() => setActiveTab('Stats')}>Stats</TabButton>
        <TabButton isActive={activeTab === 'Moves'} onClick={() => setActiveTab('Moves')}>Moves</TabButton>
        <TabButton isActive={activeTab === 'Details'} onClick={() => setActiveTab('Details')}>Details</TabButton>
      </nav>

      <TeamValidation warnings={validationWarnings} />

      <div className="min-h-[350px] mt-4">
        {activeTab === 'Details' && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <ItemSelector 
              selectedItem={customization.item}
              onSelect={(itemId) => handleFieldChange('item', itemId)}
            />
            <AbilitySelector
              availableAbilities={details.abilities}
              selectedAbility={customization.ability}
              onSelect={(abilityName) => handleFieldChange('ability', abilityName)}
            />
             <div>
              <label className="text-sm font-semibold text-slate-400 block mb-1">Naturaleza</label>
              <select 
                className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 capitalize"
                value={customization.nature || ''}
                onChange={(e) => handleFieldChange('nature', e.target.value)}
              >
                {natures.map(nature => (
                  <option key={nature.name} value={nature.name}>
                    {nature.name.charAt(0).toUpperCase() + nature.name.slice(1)}
                    {getNatureEffectText(nature.name)}
                  </option>
                ))}
              </select>
            </div>
            <DetailsEditor 
              customization={customization}
              onUpdate={(newDetails) => onUpdate(id, newDetails)}
              memberId={id}
            />
          </div>
        )}
        {activeTab === 'Stats' && (
          <StatEditor 
            member={member} 
            onCustomizationChange={(newCustomization) => onUpdate(id, newCustomization)} 
          />
        )}
        {activeTab === 'Moves' && (
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map(index => (
              <MoveSelector
                key={index}
                learnableMoves={details.moves}
                selectedMove={customization.moves[index]}
                onSelect={(moveName) => handleMoveChange(index, moveName)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}