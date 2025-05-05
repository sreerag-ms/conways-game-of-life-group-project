// Default grid dimensions
export const DEFAULT_ROWS = 20;
export const DEFAULT_COLS = 20;

// Default simulation settings
export const DEFAULT_SIMULATION_SPEED = 500;

// Default colors
export const DEFAULT_COLORS = {
  alive: '#9ca3af',   // gray-400
  dead: '#ffffff',    // white
  born: '#60a5fa',    // blue-400
  die: '#f87171',     // red-400
};

// Grid creation function
export const createEmptyGrid = (rows, cols) => Array(rows).fill().map(() => Array(cols).fill(0));
