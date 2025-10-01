'use client';
import React from 'react';
export default function LoadTeamModal({ isOpen, onClose, savedTeams, onLoad, onDelete, onShare }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-2xl flex flex-col gap-4 border border-slate-700">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Cargar Equipo</h2>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-white">&times;</button>
        </div>
        
        <div className="max-h-96 overflow-y-auto pr-2">
          {savedTeams.length === 0 ? (
            <p className="text-center text-slate-400 py-8">No tienes equipos guardados.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {savedTeams.map(team => (
                <li key={team.id} className="bg-slate-900 p-3 rounded-md flex justify-between items-center">
                  <span className="font-semibold">{team.team_name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onShare(team)}
                      className="px-4 py-1 bg-green-600 hover:bg-green-500 rounded-md text-sm font-semibold"
                    >
                      Compartir
                    </button>
                    <button 
                      onClick={() => onLoad(team)}
                      className="px-4 py-1 bg-sky-600 hover:bg-sky-500 rounded-md text-sm font-semibold"
                    >
                      Cargar
                    </button>
                    <button 
                      onClick={() => onDelete(team.id)}
                      className="px-4 py-1 bg-red-600 hover:bg-red-500 rounded-md text-sm font-semibold"
                    >
                      Borrar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}