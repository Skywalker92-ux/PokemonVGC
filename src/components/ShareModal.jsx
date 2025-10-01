'use client';
import React from 'react';

export default function ShareModal({ isOpen, onClose, shareUrl }) {
  const [copySuccess, setCopySuccess] = React.useState('');
  const inputRef = React.useRef(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    inputRef.current.select();
    document.execCommand('copy');
    setCopySuccess('¡Enlace Copiado!');
    setTimeout(() => setCopySuccess(''), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg flex flex-col gap-4 border border-slate-700">
        <h2 className="text-2xl font-bold text-emerald-400">¡Team Sheet Creado con Éxito!</h2>
        <p className="text-slate-300">Comparte este enlace con tus amigos o guárdalo para más tarde.</p>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            readOnly
            value={shareUrl}
            className="w-full p-2 bg-slate-900 border border-slate-600 rounded-md font-mono text-sm"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-md font-semibold transition-colors flex-shrink-0"
          >
            {copySuccess || 'Copiar'}
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-2 w-full px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-md transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}