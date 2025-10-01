import React from 'react';

/**
 * @param {{
 * pokemon: {name: string, url: string},
 * onSelect: (pokemon: {name: string, url: string}) => void
 * }} props
 */
export default function PokemonCard({ pokemon, onSelect }) { 
  const pokemonId = pokemon.url.split('/')[6];
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

  return (
    <li
      className="flex items-center p-2 hover:bg-slate-800 rounded-md cursor-pointer transition-colors"
      onClick={() => onSelect(pokemon)} 
    >
      <img src={imageUrl} alt={pokemon.name} className="w-10 h-10 mr-4" />
      <span className="text-lg capitalize">{pokemon.name}</span>
    </li>
  );
}