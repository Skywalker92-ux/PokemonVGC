

'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Header({ onAuthClick }) {
  const { session, signOut } = useAuth();

  return (
    <header className="bg-slate-900 p-4 flex justify-between items-center border-b border-slate-800">
      <Link href="/" className="text-xl font-bold">VGC Platform</Link>
      
      <div className="flex items-center gap-4">
        {session ? (
          <div className='flex items-center gap-4'>
            <span className='text-sm text-slate-400 hidden sm:block'>{session.user.email}</span>
            <button onClick={signOut} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md font-semibold text-sm transition-colors">Salir</button>
          </div>
        ) : (
          <button onClick={onAuthClick} className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-md font-semibold text-sm transition-colors">Entrar</button>
        )}
      </div>
    </header>
  );
}