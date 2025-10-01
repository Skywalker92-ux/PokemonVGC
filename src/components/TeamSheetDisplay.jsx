'use client';
import React from 'react';
import { titleCase } from '@/utils/teamFormatter';

export default function TeamSheetDisplay({ team, pasteData }) {
  if (!team || team.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-6 flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-xl text-slate-400">Cargando detalles del equipo...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 overflow-x-auto min-h-[400px]">
      <div className="whitespace-pre-wrap font-mono text-sm text-slate-300">
        {team.map((member, index) => (
          <div key={member.id || index} className="mb-6 last:mb-0 border-b border-slate-700 pb-4 last:border-b-0 flex items-start gap-4">
            <img
              src={member.customization.shiny ? member.details.sprites.front_shiny : member.details.sprites.front_default}
              alt={member.details.name}
              className="w-16 h-16 flex-shrink-0"
              onError={(e) => { e.currentTarget.src = '/pokeball.png'; e.currentTarget.onerror = null; }}
            />
            <div>
              <h3 className="text-xl font-semibold text-sky-400">{titleCase(member.details.name)} @ {member.customization.item ? titleCase(member.customization.item) : 'Sin Objeto'}</h3>
              <p className="text-sm text-slate-400">Ability: {member.customization.ability ? titleCase(member.customization.ability) : 'Desconocida'}</p>
              {member.customization.shiny && <p className="text-sm text-slate-400">Shiny: Yes</p>}
              <p className="text-sm text-slate-400">Level: {member.customization.level}</p>
              <p className="text-sm text-slate-400">Tera Type: {member.customization.teraType ? titleCase(member.customization.teraType) : 'Normal'}</p>
              {Object.values(member.customization.evs).some(val => val > 0) && (
                <p className="text-sm text-slate-400">
                  EVs: {Object.entries(member.customization.evs)
                      .filter(([, value]) => value > 0)
                      .map(([stat, value]) => `${value} ${stat.toUpperCase()}`)
                      .join(' / ')}
                </p>
              )}
              <p className="text-sm text-slate-400">{member.customization.nature ? titleCase(member.customization.nature) + ' Nature' : 'Sin Naturaleza'}</p>
              {member.customization.moves && member.customization.moves.filter(m => m).length > 0 && (
                <div className="mt-2">
                  {member.customization.moves.filter(m => m).map((move, moveIndex) => (
                    <p key={moveIndex} className="text-sm text-slate-400">- {titleCase(move)}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}