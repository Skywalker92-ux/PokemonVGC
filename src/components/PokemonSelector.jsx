'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonCard from './PokemonCard.jsx';

/**
 * Componente que muestra una lista buscable de Pokémon.
 * @param {{ onPokemonSelect: (pokemon: {name: string, url: string}) => void }} props
 */
export default function PokemonSelector({ onPokemonSelect }) {

  const [allPokemon, setAllPokemon] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=1025') 
      .then(response => {
        setAllPokemon(response.data.results);
      })
      .catch(error => {
        console.error("Hubo un error al obtener los datos de la PokeAPI:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); 

  const filteredPokemon = allPokemon.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p className="mt-8 text-center text-slate-400">Cargando Pokémon...</p>;
  }

  return (
    <div className="mt-8 p-4 border border-slate-700 rounded-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Selecciona un Pokémon</h2>
      <input
        type="search"
        placeholder="Buscar por nombre..."
        className="w-full p-2 rounded-md bg-slate-800 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      
      <ul className="mt-4 h-96 overflow-y-auto pr-2">
        {filteredPokemon.length > 0 ? (
          filteredPokemon.map((pokemon) => (
            <PokemonCard 
              key={pokemon.name} 
              pokemon={pokemon} 
              onSelect={onPokemonSelect} 
            />
          ))
        ) : (
          <p className="text-center text-slate-400 mt-4">No se encontraron Pokémon.</p>
        )}
      </ul>
    </div>
  );
}