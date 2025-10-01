

'use client';
import React, { useState } from 'react';

export default function ImportModal({ isOpen, onClose, onImport }) {
  const [importText, setImportText] = useState('');

  if (!isOpen) return null;

  const handleImportClick = () => {
    onImport(importText);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-2xl flex flex-col gap-4 border border-slate-700">
        <h2 className="text-2xl font-bold">Importar Equipo</h2>
        <p className="text-sm text-slate-400">Pega aquí el texto de tu equipo desde Pokémon Showdown.</p>
        <textarea
          className="w-full h-64 p-2 bg-slate-900 rounded-md border border-slate-600 font-mono text-sm"
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="Pega tu equipo aquí..."
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleImportClick}
            disabled={!importText.trim()}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Importar Equipo
          </button>
        </div>
      </div>
    </div>
  );
}