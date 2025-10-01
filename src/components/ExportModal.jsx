

'use client';
import React from 'react';

export default function ExportModal({ isOpen, onClose, textToExport }) {
  const [copySuccess, setCopySuccess] = React.useState('');
  const textAreaRef = React.useRef(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    textAreaRef.current.select();
    document.execCommand('copy');
    setCopySuccess('¡Copiado!');
    setTimeout(() => setCopySuccess(''), 2000); 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-2xl flex flex-col gap-4 border border-slate-700">
        <h2 className="text-2xl font-bold">Exportar Equipo</h2>
        <textarea
          ref={textAreaRef}
          readOnly
          className="w-full h-64 p-2 bg-slate-900 rounded-md border border-slate-600 font-mono text-sm"
          value={textToExport}
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-md transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-md font-semibold transition-colors"
          >
            {copySuccess || 'Copiar al Portapapeles'}
          </button>
        </div>
      </div>
    </div>
  );
}