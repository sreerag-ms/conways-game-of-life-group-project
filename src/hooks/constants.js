export const DEFAULT_COLORS = {
  alive: '#4682B4',   // gray-400
  dead: '#ffffff',    // white
  born: '#DAFFCB',    // blue-400
  die: '#f87171',     // red-400
};

// Default grid dimensions
export const DEFAULT_ROWS = 20;
export const DEFAULT_COLS = 20;

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
};
