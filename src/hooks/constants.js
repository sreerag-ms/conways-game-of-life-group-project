// Default grid dimensions
export const DEFAULT_ROWS = 20;
export const DEFAULT_COLS = 20;

// Default simulation settings
export const DEFAULT_SIMULATION_SPEED = 500;

// Grid creation function
export const createEmptyGrid = (rows, cols) => Array(rows).fill().map(() => Array(cols).fill(0));
