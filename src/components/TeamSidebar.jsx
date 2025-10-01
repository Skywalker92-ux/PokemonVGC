// src/components/TeamSidebar.jsx

'use client';
import React from 'react';
import TeamAnalysis from './TeamAnalysis.jsx';

// El componente de validación y su lógica han sido eliminados de este archivo.
export default function TeamSidebar({ 
  team, activeMemberId, onTabClick, pokemonSelectorComponent, 
  teamName, onTeamNameChange, onSaveTeam, isTeamEmpty, 
  isPublic, onIsPublicChange, 
  onLoadClick, onImportClick, onExportClick 
}) {
  return (
    <aside className="w-full lg:w-[350px] flex-shrink-0 flex flex-col gap-4">
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <input
            type="text"
            value={teamName}
            onChange={(e) => onTeamNameChange(e.target.value)}
            className="bg-transparent text-xl font-bold text-slate-200 w-full focus:outline-none focus:ring-1 focus:ring-sky-500 rounded-md px-2 py-1 -ml-2"
            placeholder="Nombre del Equipo"
          />
          <button
            onClick={onSaveTeam}
            disabled={isTeamEmpty}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-md font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            Guardar
          </button>
        </div>
        
        <div className="mb-3">
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input 
              type="checkbox"
              checked={isPublic}
              onChange={(e) => onIsPublicChange(e.target.checked)}
              className="w-4 h-4 bg-slate-700 border-slate-600 rounded text-sky-500 focus:ring-sky-500"
            />
            Hacer este equipo público
          </label>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
            <button onClick={onLoadClick} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-sm rounded-md font-semibold">Cargar</button>
            <button onClick={onImportClick} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-sm rounded-md font-semibold">Importar</button>
            <button onClick={onExportClick} disabled={isTeamEmpty} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-sm rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed">Exportar</button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {team.map(member => {
            const animatedSprite = member.customization.shiny 
              ? member.details.sprites.other.showdown.front_shiny 
              : member.details.sprites.other.showdown.front_default;
            const staticSprite = member.customization.shiny 
              ? member.details.sprites.front_shiny 
              : member.details.sprites.front_default;
            const spriteUrl = animatedSprite || staticSprite;
            
            return (
              <button key={member.id} onClick={() => onTabClick(member.id)} 
                className={`pt-2 pb-1 px-1 rounded-md transition-colors border-2 ${
                  activeMemberId === member.id 
                    ? 'bg-sky-700/50 border-sky-500' 
                    : 'bg-slate-700 hover:bg-slate-600 border-transparent'
                }`}
              >
                <img src={spriteUrl} alt={member.details.name} className="mx-auto w-14 h-14" />
                <p className="text-xs capitalize text-center truncate text-slate-300 mt-1">
                  Lv. {member.customization.level}
                </p>
              </button>
            );
          })}
          {[...Array(6 - team.length)].map((_, i) => (
            <div key={i} className="flex items-center justify-center bg-slate-800/50 rounded-md border-2 border-dashed border-slate-700 aspect-square">
              <span className="text-3xl text-slate-600">+</span>
            </div>
          ))}
        </div>
        <TeamAnalysis team={team} />
      </div>
      {pokemonSelectorComponent}
    </aside>
  );
}