// src/utils/teamFormatter.js

const showdownStatMap = {
  hp: 'HP',
  atk: 'Atk',
  def: 'Def',
  spa: 'SpA',
  spd: 'SpD',
  spe: 'Spe'
};

export function titleCase(str) {
  if (!str) return '';
  // Si la cadena ya contiene un guion (como 'nidoran-m'), la capitaliza de forma especial.
  if (str.includes('-')) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  }
  // Si no, capitaliza cada palabra separada por espacio.
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function formatPokemon(member) {
  const { details, customization } = member;

  const evsString = Object.entries(customization.evs)
    .filter(([, value]) => value > 0)
    .map(([stat, value]) => `${value} ${showdownStatMap[stat]}`)
    .join(' / ');

  const natureString = customization.nature ? `${titleCase(customization.nature)} Nature` : '';

  const movesString = customization.moves
    .filter(move => move)
    .map(move => `- ${titleCase(move.replace(/-/g, ' '))}`)
    .join('\n');

  const itemString = customization.item ? `@ ${titleCase(customization.item.replace(/-/g, ' '))}` : '';
  const abilityString = customization.ability ? `Ability: ${titleCase(customization.ability.replace(/-/g, ' '))}` : '';
  const teraTypeString = customization.teraType ? `Tera Type: ${titleCase(customization.teraType)}` : '';
  const shinyString = customization.shiny ? 'Shiny: Yes' : '';
  
  return [
    `${titleCase(details.name)} ${itemString}`,
    abilityString,
    shinyString,
    `Level: ${customization.level}`,
    teraTypeString,
    evsString ? `EVs: ${evsString}`: '',
    natureString,
    movesString
  ].filter(Boolean).join('\n');
}

export function exportTeamToString(team) {
  return team.map(formatPokemon).join('\n\n');
}