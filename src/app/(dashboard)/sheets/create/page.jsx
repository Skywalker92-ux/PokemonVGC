// src/app/sheets/create/page.jsx

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

function generateShortId(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

export default function CreateSheetPage() {
  const { session } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [pasteData, setPasteData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      setError('Necesitas iniciar sesión para crear un Team Sheet.');
      return;
    }
    if (!pasteData.trim()) {
      setError('El campo del equipo no puede estar vacío.');
      return;
    }

    setLoading(true);
    setError('');

    const newSheet = {
      title: title || 'Sin Título',
      paste_data: pasteData,
      user_id: session.user.id,
      short_id: generateShortId(),
    };

    try {
      const { error: insertError } = await supabase.from('sheets').insert([newSheet]);
      if (insertError) throw insertError;

      // ▼▼▼ CAMBIO PRINCIPAL AQUÍ ▼▼▼
      // Redirigimos con un parámetro 'created=true' en la URL
      router.push(`/sheets/${newSheet.short_id}?created=true`);

    } catch (err) {
      console.error('Error creating sheet:', err);
      setError('Hubo un error al crear el sheet. El short_id puede que ya exista, intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-4xl font-bold mb-4">Crear un Nuevo Team Sheet</h1>
      <p className="text-slate-400 mb-6">Pega un equipo en formato de Showdown para generar un enlace compartible.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-slate-300 mb-1">Título (Opcional)</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Equipo para el Torneo de Mayo"
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label htmlFor="pasteData" className="block text-sm font-semibold text-slate-300 mb-1">Equipo en Formato Showdown</label>
          <textarea
            id="pasteData"
            value={pasteData}
            onChange={(e) => setPasteData(e.target.value)}
            placeholder="Pega tu equipo aquí..."
            required
            className="w-full h-72 p-2 bg-slate-800 border border-slate-700 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-500 rounded-md font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-wait"
        >
          {loading ? 'Creando...' : 'Crear Team Sheet'}
        </button>
      </form>
    </div>
  );
}