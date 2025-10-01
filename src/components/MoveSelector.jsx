
'use client';
import React from 'react';
import { moveData } from '@/utils/moves';


const TypePill = ({ type }) => {
  if (!type) return null;
  return <img src={`/${type}.png`} alt={type} title={type} className="h-4" />;
};

const CategoryIcon = ({ category }) => {
  const icons = {
    physical: '/physical.png',
    special: '/special.png',
    status: '/status.png',
  };
  if (!icons[category]) return null;
  return <img src={icons[category]} alt={category} title={category} className="w-6 h-6" />;
};

export default function MoveSelector({ learnableMoves, selectedMove, onSelect }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [containerRef]);

  const availableMoves = learnableMoves
    .map(moveInfo => moveData[moveInfo.move.name])
    .filter(Boolean)
    .filter(move => move.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a,b) => a.name.localeCompare(b.name));

  const groupedMoves = availableMoves.reduce((groups, move) => {
    const group = move.group || 'Moves';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(move);
    return groups;
  }, {});
  
  const currentMove = moveData[selectedMove];

  const handleSelect = (moveId) => {
    onSelect(moveId);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 flex items-center justify-between text-left"
      >
        {currentMove ? (
          <span className="capitalize">{currentMove.name}</span>
        ) : (
          <span className="text-slate-400">- Vacío -</span>
        )}
        <span className="text-slate-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-20 top-full mt-1 w-[600px] bg-slate-800 border border-slate-600 rounded-md shadow-lg max-h-96 flex flex-col">
          <input
            type="search"
            placeholder="Buscar movimiento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 bg-slate-900 border-b border-slate-600 sticky top-0 focus:outline-none focus:ring-2 focus:ring-sky-500"
            autoFocus
          />
          <ul className="overflow-y-auto p-1">
            {Object.entries(groupedMoves).map(([group, moves]) => (
              <li key={group}>
                <h3 className="text-sm font-bold text-sky-400 mt-2 mb-1 px-2">{group}</h3>
                <div className="grid grid-cols-[150px_60px_40px_40px_40px_1fr] gap-x-2 text-xs font-bold text-slate-400 px-2 py-1 border-b border-slate-700">
                  <span>Name</span>
                  <span>Type</span>
                  <span>Cat</span>
                  <span>Pow</span>
                  <span>Acc</span>
                  <span>Description</span>
                </div>
                <ul>
                  {moves.map(move => (
                    <li key={move.name} onClick={() => handleSelect(move.name.toLowerCase().replace(/ /g, '-'))}
                        className="p-2 grid grid-cols-[150px_60px_40px_40px_40px_1fr] gap-x-2 items-center hover:bg-slate-700 rounded-md cursor-pointer text-sm">
                      <span className="font-bold truncate text-white">{move.name}</span>
                      <TypePill type={move.type} />
                      <CategoryIcon category={move.category} />
                      <span className="text-center">{move.power || '-'}</span>
                      <span className="text-center">{move.accuracy || '-'}</span>
                      <span className="text-xs text-slate-400 truncate">{move.description}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            {availableMoves.length === 0 && <li className="p-4 text-center text-slate-400">No se encontraron movimientos.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}