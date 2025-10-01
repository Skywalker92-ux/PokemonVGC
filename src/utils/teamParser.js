// src/utils/teamParser.js

function parsePokemon(pokemonString) {
  const lines = pokemonString.trim().split('\n');
  const firstLine = lines.shift().trim();
  
  const nameItemRegex = /^(.*?)(?:\s*@\s*(.*?))?$/;
  const firstLineMatch = firstLine.match(nameItemRegex);
  if (!firstLineMatch) return null;

  let name = firstLineMatch[1].trim();
  name = name.replace(/\s*\(.*?\)\s*/g, '').trim();
  
  // ▼▼▼ CAMBIO PRINCIPAL: ASEGURAMOS QUE TODO SEA MINÚSCULAS ANTES DE BUSCAR EN LA API ▼▼▼
  const processedName = name.toLowerCase().replace(/ /g, '-');

  const pokemonData = {
    name: processedName,
    item: firstLineMatch[2] ? firstLineMatch[2].trim().toLowerCase().replace(/ /g, '-') : null,
    ability: null, nature: null,
    evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    moves: [], level: 50, shiny: false, teraType: null,
  };

  lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('Ability:')) pokemonData.ability = line.substring(8).trim().toLowerCase().replace(/ /g, '-');
    else if (line.startsWith('Tera Type:')) pokemonData.teraType = line.substring(10).trim().toLowerCase();
    else if (line.startsWith('Shiny: Yes')) pokemonData.shiny = true;
    else if (line.startsWith('Level:')) pokemonData.level = parseInt(line.substring(6).trim(), 10) || 50;
    else if (line.startsWith('EVs:')) {
      const evsString = line.substring(4).trim();
      evsString.split('/').forEach(stat => {
        const parts = stat.trim().split(' ');
        if (parts.length < 2) return;
        const value = parseInt(parts[0], 10);
        const key = parts[1].toLowerCase();
        if (!isNaN(value) && pokemonData.evs.hasOwnProperty(key)) pokemonData.evs[key] = value;
      });
    } else if (line.endsWith(' Nature')) pokemonData.nature = line.split(' ')[0].toLowerCase();
    else if (line.startsWith('-')) pokemonData.moves.push(line.substring(1).trim().toLowerCase().replace(/ /g, '-'));
  });
  
  while (pokemonData.moves.length < 4) pokemonData.moves.push(null);
  return pokemonData;
}

export function parseTeamFromString(teamString) {
  const pokemonBlocks = teamString.trim().split(/\n\s*\n/);
  return pokemonBlocks.map(parsePokemon).filter(Boolean);
}