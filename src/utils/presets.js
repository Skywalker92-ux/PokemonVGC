// src/utils/presets.js

export const genericEvSpreads = [
  { label: "Selecciona un Preajuste...", spread: null },
  { label: "Reset EVs", spread: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 } },
  { label: "Max Atk / Max Spe", spread: { hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252 } },
  { label: "Max SpA / Max Spe", spread: { hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252 } },
  { label: "Max HP / Max Atk", spread: { hp: 252, atk: 252, def: 4, spa: 0, spd: 0, spe: 0 } },
  { label: "Max HP / Max SpA", spread: { hp: 252, atk: 0, def: 0, spa: 252, spd: 4, spe: 0 } },
];

export const pokemonPresets = {
  'charizard': [
    { label: "Special Sweeper (Timid)", spread: { hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252 } },
    { label: "Dragon Dance (Jolly)", spread: { hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252 } },
  ],
  'blastoise': [
    { label: "Bulky Spinner (Bold)", spread: { hp: 252, atk: 0, def: 252, spa: 0, spd: 4, spe: 0 } },
    { label: "Shell Smash (Modest)", spread: { hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252 } },
  ],
  'ceruledge': [
    { label: "Swords Dance (Jolly)", spread: { hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252 } },
    { label: "Bulky Will-O-Wisp (Adamant)", spread: { hp: 244, atk: 252, def: 0, spa: 0, spd: 12, spe: 0 } },
  ]
};

export const ivSpreads = [
  { label: "Preajuste de IVs...", spread: null },
  { label: "Max All", spread: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 } },
  { label: "Min Attack", spread: { hp: 31, atk: 0, def: 31, spa: 31, spd: 31, spe: 31 } },
  { label: "Min Speed", spread: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 0 } },
  { label: "Min Atk & Spe", spread: { hp: 31, atk: 0, def: 31, spa: 31, spd: 31, spe: 0 } },
];