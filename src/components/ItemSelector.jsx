
'use client';
import React from 'react';
import { competitiveItems, getItemSpriteUrl } from '@/utils/items';


const sortedCompetitiveItems = [...competitiveItems].sort((a, b) => a.name.localeCompare(b.name));

export default function ItemSelector({ selectedItem, onSelect }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState(''); 
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [containerRef]);


  const filteredItems = sortedCompetitiveItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const groupedItems = filteredItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  const handleSelect = (item) => {
    onSelect(item.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const currentItem = sortedCompetitiveItems.find(item => item.id === selectedItem);
  
  const handleImageError = (e) => {
    e.currentTarget.src = '/placeholder-item.png';
    e.currentTarget.onerror = null;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="text-sm font-semibold text-slate-400 block mb-1">Objeto</label>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 flex items-center justify-between text-left"
      >
        {currentItem ? (
          <div className="flex items-center gap-2">
            <img src={getItemSpriteUrl(currentItem.id)} alt={currentItem.name} className="w-6 h-6" onError={handleImageError} />
            <span className="capitalize">{currentItem.name}</span>
          </div>
        ) : (
          <span className="text-slate-400">- Ninguno -</span>
        )}
        <span className="text-slate-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 top-full mt-1 w-[550px] bg-slate-800 border border-slate-600 rounded-md shadow-lg max-h-80 flex flex-col">
          <input
            type="search"
            placeholder="Buscar objeto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 bg-slate-900 border-b border-slate-600 sticky top-0 focus:outline-none focus:ring-2 focus:ring-sky-500"
            autoFocus
          />

          <ul className="overflow-y-auto p-2">
            {Object.entries(groupedItems).map(([category, items]) => (
              <li key={category}>
                <h3 className="text-sm font-bold text-sky-400 mt-2 mb-1 px-2">{category}</h3>
                <ul>
                  {items.map(item => (
                    <li 
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="p-2 flex gap-3 items-center hover:bg-slate-700 rounded-md cursor-pointer"
                    >
                      <img src={getItemSpriteUrl(item.id)} alt={item.name} className="w-8 h-8" onError={handleImageError} />
                      <div>
                        <p className="font-semibold capitalize">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
             {filteredItems.length === 0 && (
              <li className="p-4 text-center text-slate-400">No se encontraron objetos.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}