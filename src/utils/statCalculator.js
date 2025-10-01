// src/utils/statCalculator.js

const NATURES = {
  hardy: { atk: 1.0, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.0 },
  lonely: { atk: 1.1, def: 0.9, spa: 1.0, spd: 1.0, spe: 1.0 },
  brave: { atk: 1.1, def: 1.0, spa: 1.0, spd: 1.0, spe: 0.9 },
  adamant: { atk: 1.1, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.0 },
  naughty: { atk: 1.1, def: 1.0, spa: 1.0, spd: 0.9, spe: 1.0 },
  bold: { atk: 0.9, def: 1.1, spa: 1.0, spd: 1.0, spe: 1.0 },
  docile: { atk: 1.0, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.0 },
  relaxed: { atk: 1.0, def: 1.1, spa: 1.0, spd: 1.0, spe: 0.9 },
  impish: { atk: 1.0, def: 1.1, spa: 0.9, spd: 1.0, spe: 1.0 },
  lax: { atk: 1.0, def: 1.1, spa: 1.0, spd: 0.9, spe: 1.0 },
  timid: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.1 },
  hasty: { atk: 1.0, def: 0.9, spa: 1.0, spd: 1.0, spe: 1.1 },
  serious: { atk: 1.0, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.0 },
  jolly: { atk: 1.0, def: 1.0, spa: 0.9, spd: 1.0, spe: 1.1 },
  naive: { atk: 1.0, def: 1.0, spa: 1.0, spd: 0.9, spe: 1.1 },
  modest: { atk: 0.9, def: 1.0, spa: 1.1, spd: 1.0, spe: 1.0 },
  mild: { atk: 1.0, def: 0.9, spa: 1.1, spd: 1.0, spe: 1.0 },
  quiet: { atk: 1.0, def: 1.0, spa: 1.1, spd: 1.0, spe: 0.9 },
  bashful: { atk: 1.0, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.0 },
  rash: { atk: 1.0, def: 1.0, spa: 1.1, spd: 0.9, spe: 1.0 },
  calm: { atk: 0.9, def: 1.0, spa: 1.0, spd: 1.1, spe: 1.0 },
  gentle: { atk: 1.0, def: 1.0, spa: 1.0, spd: 1.1, spe: 0.9 },
  sassy: { atk: 1.0, def: 1.0, spa: 1.0, spd: 1.1, spe: 0.9 },
  careful: { atk: 1.0, def: 1.0, spa: 0.9, spd: 1.1, spe: 1.0 },
  quirky: { atk: 1.0, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.0 },
};

const STAT_MAP_API = {
  hp: 'hp',
  attack: 'atk',
  defense: 'def',
  'special-attack': 'spa',
  'special-defense': 'spd',
  speed: 'spe',
};

const STAT_MAP_DISPLAY = {
  atk: 'Atk',
  def: 'Def',
  spa: 'SpA',
  spd: 'SpD',
  spe: 'Spe'
};

export function getNatureEffectText(natureName) {
  const nature = NATURES[natureName];
  if (!nature) return '';

  let increasedStat = null;
  let decreasedStat = null;

  for (const stat in nature) {
    if (nature[stat] > 1.0) increasedStat = STAT_MAP_DISPLAY[stat];
    else if (nature[stat] < 1.0) decreasedStat = STAT_MAP_DISPLAY[stat];
  }

  if (increasedStat && decreasedStat && increasedStat !== decreasedStat) {
    return ` (+${increasedStat}, -${decreasedStat})`;
  }
  
  return '';
}

export function calculateStats(pokemonDetails, customization) {
  if (!pokemonDetails || !customization || !customization.ivs) {
    // Retorna un objeto con valores por defecto si los datos no están listos
    return { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  }
  
  const { stats: baseStatsApi } = pokemonDetails;
  const { evs, nature, level, ivs } = customization;

  const base = {};
  baseStatsApi.forEach(stat => {
    const statKey = STAT_MAP_API[stat.stat.name];
    base[statKey] = stat.base_stat;
  });

  const natureModifiers = NATURES[nature] || NATURES.hardy;
  
  const hp = Math.floor((2 * base.hp + ivs.hp + Math.floor(evs.hp / 4)) * level / 100) + level + 10;
  
  const otherStats = {};
  ['atk', 'def', 'spa', 'spd', 'spe'].forEach(stat => {
    const statValue = Math.floor((2 * base[stat] + ivs[stat] + Math.floor(evs[stat] / 4)) * level / 100) + 5;
    otherStats[stat] = Math.floor(statValue * natureModifiers[stat]);
  });
  
  return { hp, ...otherStats };
}