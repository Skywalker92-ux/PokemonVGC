
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NavLink = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`block p-2 rounded-md font-semibold transition-colors ${
        isActive 
          ? 'bg-sky-800/50 text-sky-300' 
          : 'hover:bg-slate-700 text-slate-300'
      }`}>
      {children}
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="bg-slate-900 w-64 p-4 border-r border-slate-800 hidden lg:block">
      <h2 className="text-lg font-semibold mb-4 text-slate-300">MENU</h2>
      <ul className="flex flex-col gap-2">
        <li>
          <NavLink href="/">Teambuilder</NavLink>
        </li>
        <li>
          <NavLink href="/sheets/create">Crear Team Sheet</NavLink>
        </li>
        <li>
          <NavLink href="/community">Equipos Públicos</NavLink>
        </li>
      </ul>
    </aside>
  );
}