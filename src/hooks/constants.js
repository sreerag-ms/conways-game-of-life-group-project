export const DEFAULT_COLORS  = [
  { key: 'alive', label: 'Alive Cells', defaultColor: '#e7e7e7' },
  { key: 'dead', label: 'Dead Cells', defaultColor: '#282828' },
  { key: 'born', label: 'Born Cells (Will appear)', defaultColor: '#DAFFCB' },
  { key: 'die', label: 'Dying Cells (Will disappear)', defaultColor: '#f87171' },
];

// default grid dimensions
export const DEFAULT_ROWS = 50;
export const DEFAULT_COLS = 50;

// Default simulation settings
export const DEFAULT_SIMULATION_SPEED = 100;

// Rule definitions
export const RULES = {
  'GoL': {
    name: 'Conway\'s Game of Life',
    S: [2, 3],
    B: [3],
  },
  'HighLife': {
    name: 'HighLife',
    S: [2, 3],
    B: [3, 6],
  },
  'Seeds': {
    name: 'Seeds',
    S: [],
    B: [2],
  },
  'LwoD': {
    name: 'Life without Death',
    S: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    B: [3],
  },
  'Maze': {
    name: 'Maze',
    S: [1, 2, 3, 4, 5],
    B: [3],
  },
  'Replicator': {
    name: 'Replicator',
    S: [1, 3, 5, 7],
    B: [1, 3, 5, 7],
  },
  '2x2': {
    name: '2x2',
    S: [1, 2, 5],
    B: [3, 6],
  },
  'DayAndNight': {
    name: 'Day & Night',
    S: [3, 4, 6, 7, 8],
    B: [3, 6, 7, 8],
  },
  '34Life': {
    name: '34 Life',
    S: [3, 4],
    B: [3, 4],
  },
  'Diamoeba': {
    name: 'Diamoeba',
    S: [5, 6, 7, 8],
    B: [3, 5, 6, 7, 8],
  },
  'Coral': {
    name: 'Coral',
    S: [4, 5, 6, 7, 8],
    B: [3],
  },
  'Assimilation': {
    name: 'Assimilation',
    S: [4, 5, 6, 7],
    B: [3, 4, 5],
  },
  'Stains': {
    name: 'Stains',
    S: [2, 3, 5, 6, 7, 8],
    B: [3, 6, 7, 8],
  },
  'Amoeba': {
    name: 'Amoeba',
    S: [1, 3, 5, 8],
    B: [3, 5, 7],
  },
  'Move': {
    name: 'Move',
    S: [2, 4, 5],
    B: [3, 6, 8],
  },
};
