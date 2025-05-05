// Default grid dimensions
export const DEFAULT_ROWS = 20;
export const DEFAULT_COLS = 20;

// Default simulation settings
export const DEFAULT_SIMULATION_SPEED = 500;

// Rule definitions
export const RULES = {
  'GoL': {
    name: 'Conway\'s Game of Life',
    S: [2, 3],    // Survival rules - cells survive with 2 or 3 neighbors
    B: [3],       // Birth rules - cells are born with exactly 3 neighbors
  },
  'HighLife': {
    name: 'HighLife',
    S: [2, 3],
    B: [3, 6],
  },
  // Add more rule sets as needed
};
