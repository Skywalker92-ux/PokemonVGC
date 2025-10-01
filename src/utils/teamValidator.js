// src/utils/teamValidator.js

// Lista de Pokémon restringidos (puedes expandir esta lista según el formato VGC actual)
const restrictedPokemon = [
  'mewtwo', 'lugia', 'ho-oh', 'kyogre', 'groudon', 'rayquaza',
  'dialga', 'palkia', 'giratina', 'reshiram', 'zekrom', 'kyurem',
  'xerneas', 'yveltal', 'zygarde', 'solgaleo', 'lunala', 'necrozma',
  'zacian', 'zamazenta', 'eternatus', 'calyrex', 'koraidon', 'miraidon'
];

export function validateTeam(team) {
  const warnings = [];
  if (!team || team.length === 0) return warnings;

  // --- Validación de Cláusula de Especie (No repetir Pokémon) ---
  const speciesCount = {};
  team.forEach(member => {
    const speciesName = member.details.name;
    speciesCount[speciesName] = (speciesCount[speciesName] || 0) + 1;
  });
  for (const species in speciesCount) {
    if (speciesCount[species] > 1) {
      warnings.push(`Cláusula de Especie: Tienes ${speciesCount[species]} ${species}.`);
    }
  }

  // --- Validación de Cláusula de Objeto (No repetir objetos) ---
  const itemCount = {};
  team.forEach(member => {
    const itemName = member.customization.item;
    if (itemName) {
      itemCount[itemName] = (itemCount[itemName] || 0) + 1;
    }
  });
  for (const item in itemCount) {
    if (itemCount[item] > 1) {
      warnings.push(`Cláusula de Objeto: Hay ${itemCount[item]} Pokémon con ${item.replace(/-/g, ' ')}.`);
    }
  }
  
  // --- Validación de Pokémon Restringidos ---
  const restrictedCount = team.filter(member => restrictedPokemon.includes(member.details.name)).length;
  // La regla suele ser un máximo de 2, pero puede cambiar.
  if (restrictedCount > 2) {
    warnings.push(`Restringidos: Tienes ${restrictedCount} Pokémon restringidos (máximo 2).`);
  }

  // --- Validación de Movimientos y Habilidades Ilegales ---
  team.forEach(member => {
    const pokemonName = member.details.name.charAt(0).toUpperCase() + member.details.name.slice(1);

    // Validar Habilidad
    const legalAbilities = member.details.abilities.map(a => a.ability.name);
    if (member.customization.ability && !legalAbilities.includes(member.customization.ability)) {
      warnings.push(`${pokemonName}: Habilidad ilegal seleccionada.`);
    }

    // Validar Movimientos
    const legalMoves = member.details.moves.map(m => m.move.name);
    member.customization.moves.forEach(move => {
      if (move && !legalMoves.includes(move)) {
        warnings.push(`${pokemonName}: Movimiento ilegal seleccionado (${move.replace(/-/g, ' ')}).`);
      }
    });
  });

  return warnings;
}