'use client';
import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false); 
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onAuth(email, password, isSigningUp);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-sm flex flex-col gap-4 border border-slate-700">
        <h2 className="text-2xl font-bold text-center">{isSigningUp ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="email@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-md bg-slate-900 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-md bg-slate-900 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
            minLength="6"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-md font-semibold transition-colors"
          >
            {isSigningUp ? 'Registrarse' : 'Entrar'}
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
        <button 
          onClick={() => { setIsSigningUp(!isSigningUp); setError(''); }}
          className="text-sm text-slate-400 hover:text-white"
        >
          {isSigningUp ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
        <button onClick={onClose} className="text-center text-xs text-slate-500 hover:text-slate-300 mt-2">Cerrar</button>
      </div>
    </div>
  );
}