import { create } from 'zustand';
import { DEFAULT_SIMULATION_SPEED, RULES } from '../hooks/constants';

const useGameStore = create((set, get) => ({
  // Grid state - this will change frequently during simulation
  activeCells: new Set(),

  // UI state - rarely changes during simulation
  rows: 20,
  cols: 20,
  isRunning: false,
  interval: DEFAULT_SIMULATION_SPEED,
  currentRules: 'GoL',

  // Actions
  createGrid: (rowCount, colCount) => {
    set({
      rows: rowCount,
      cols: colCount,
      activeCells: new Set(),
    });
  },

  toggleCell: (rowIndex, colIndex) => {
    const { activeCells } = get();
    const coordStr = `${rowIndex},${colIndex}`;
    const newActiveCells = new Set(activeCells);

    if (newActiveCells.has(coordStr)) {
      newActiveCells.delete(coordStr);
    } else {
      newActiveCells.add(coordStr);
    }

    set({ activeCells: newActiveCells });
  },

  setActiveCells: (cells) => {
    set({ activeCells: new Set(cells) });
  },

  calculateNextGeneration: () => {
    const { activeCells, rows, cols, currentRules } = get();
    const nextActiveCells = new Set();
    const cellsToCheck = new Set();
    const rules = RULES[currentRules];

    // Add all active cells and their neighbors to check
    activeCells.forEach(coordStr => {
      cellsToCheck.add(coordStr);

      const [row, col] = coordStr.split(',').map(Number);
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;

          const newRow = (row + i + rows) % rows;
          const newCol = (col + j + cols) % cols;
          cellsToCheck.add(`${newRow},${newCol}`);
        }
      }
    });

    // Check all cells that might change state
    cellsToCheck.forEach(coordStr => {
      const [row, col] = coordStr.split(',').map(Number);
      const isAlive = activeCells.has(coordStr);

      // Count live neighbors
      let liveNeighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;

          const neighborRow = (row + i + rows) % rows;
          const neighborCol = (col + j + cols) % cols;
          const neighborCoord = `${neighborRow},${neighborCol}`;

          if (activeCells.has(neighborCoord)) {
            liveNeighbors++;
          }
        }
      }

      // Apply rules
      if (isAlive && rules.S.includes(liveNeighbors)) {
        // Cell survives
        nextActiveCells.add(coordStr);
      } else if (!isAlive && rules.B.includes(liveNeighbors)) {
        // Cell is born
        nextActiveCells.add(coordStr);
      }
    });

    // Check if the grid has stabilized
    let hasStabilized = activeCells.size === nextActiveCells.size;
    if (hasStabilized) {
      for (const cell of activeCells) {
        if (!nextActiveCells.has(cell)) {
          hasStabilized = false;
          break;
        }
      }
    }

    if (hasStabilized) {
      get().stopSimulation();
      set({ stabilized: true });

      return;
    }

    // Only update activeCells if there's a change
    set({ activeCells: nextActiveCells });
  },

  startSimulation: () => {
    set({ isRunning: true });
  },

  stopSimulation: () => {
    set({ isRunning: false });
  },

  clearGrid: () => {
    set({ activeCells: new Set() });
  },

  updateInterval: (newInterval) => {
    set({ interval: newInterval });
  },

  stabilized: false,
  setStabilized: (value) => set({ stabilized: value }),

  saveConfig: () => {
    const { activeCells, rows, cols, currentRules } = get();

    return {
      cells: Array.from(activeCells),
      rows,
      cols,
      rules: currentRules,
    };
  },

  loadConfig: (config) => {
    if (config && config.cells && Array.isArray(config.cells)) {
      set({
        rows: config.rows || get().rows,
        cols: config.cols || get().cols,
        activeCells: new Set(config.cells),
        currentRules: config.rules && RULES[config.rules] ? config.rules : get().currentRules,
      });

      return { success: true };
    }

    return { success: false, message: 'Invalid configuration' };
  },
}));

export default useGameStore;
