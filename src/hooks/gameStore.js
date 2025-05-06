import { create } from 'zustand';
import { DEFAULT_COLS, DEFAULT_ROWS, DEFAULT_SIMULATION_SPEED, RULES } from './constants';

const coordToString = (row, col) => `${row},${col}`;
const stringToCoord = (str) => str.split(',').map(Number);

export const useGameStore = create((set, get) => ({
  // state for game of life
  activeCells: new Set(),
  previousActiveCells: new Set(),
  bornCells: new Set(),
  dyingCells: new Set(),
  rows: DEFAULT_ROWS,
  cols: DEFAULT_COLS,
  isRunning: false,
  simulationSpeed: DEFAULT_SIMULATION_SPEED,
  currentRules: 'GoL',
  isContinuous: true,
  showChanges: false,
  simulationIntervalRef: null,
  metrics: [],
  generation: 0,
  stabilized: false,

  // get next state for all cells
  getNextStateSet: () => {
    const { activeCells, rows, cols, currentRules, isContinuous } = get();
    const nextActiveCells = new Set();
    const cellsToCheck = new Set();
    const rules = RULES[currentRules];

    activeCells.forEach(coordStr => {
      cellsToCheck.add(coordStr);

      // add all neighbors to check
      const [row, col] = stringToCoord(coordStr);
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;

          let newRow, newCol;
          if (isContinuous) {
            // wrap around edges
            newRow = (row + i + rows) % rows;
            newCol = (col + j + cols) % cols;
          } else {
            newRow = row + i;
            newCol = col + j;

            if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
              continue;
            }
          }

          cellsToCheck.add(coordToString(newRow, newCol));
        }
      }
    });

    cellsToCheck.forEach(coordStr => {
      const [row, col] = stringToCoord(coordStr);
      const isAlive = activeCells.has(coordStr);

      // count live neighbors
      let liveNeighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;

          let neighborRow, neighborCol;
          if (isContinuous) {
            neighborRow = (row + i + rows) % rows;
            neighborCol = (col + j + cols) % cols;
          } else {
            neighborRow = row + i;
            neighborCol = col + j;

            if (neighborRow < 0 || neighborRow >= rows || neighborCol < 0 || neighborCol >= cols) {
              continue;
            }
          }

          const neighborCoord = coordToString(neighborRow, neighborCol);

          if (activeCells.has(neighborCoord)) {
            liveNeighbors++;
          }
        }
      }

      // apply rules
      if (isAlive && rules.S.includes(liveNeighbors)) {
        nextActiveCells.add(coordStr);
      } else if (!isAlive && rules.B.includes(liveNeighbors)) {
        nextActiveCells.add(coordStr);
      }
    });

    return nextActiveCells;
  },

  // compare two sets of active cells
  areGridsEqual: (cells1, cells2) => {
    if (cells1.size !== cells2.size) return false;
    for (const cell of cells1) {
      if (!cells2.has(cell)) return false;
    }

    return true;
  },

  updateCellChanges: () => {
    const { activeCells } = get();
    set({ previousActiveCells: new Set(activeCells) });

    // always calculate next generation metrics
    const nextGeneration = get().getNextStateSet();

    // find cells that will be born (in next gen but not in current)
    const newBornCells = new Set();
    nextGeneration.forEach(cell => {
      if (!activeCells.has(cell)) {
        newBornCells.add(cell);
      }
    });

    // find cells that will die (in current but not in next gen)
    const newDyingCells = new Set();
    activeCells.forEach(cell => {
      if (!nextGeneration.has(cell)) {
        newDyingCells.add(cell);
      }
    });

    set({
      bornCells: newBornCells,
      dyingCells: newDyingCells,
    });
  },

  stopSimulation: () => {
    const { simulationIntervalRef } = get();
    if (simulationIntervalRef) {
      clearInterval(simulationIntervalRef);
    }
    set({
      simulationIntervalRef: null,
      isRunning: false,
    });
  },

  collectMetrics: () => {
    const { activeCells, bornCells, dyingCells, generation, currentRules } = get();
    const timestamp = new Date().toISOString();

    const metrics = {
      timestamp,
      generation,
      populationSize: activeCells.size,
      births: bornCells.size,
      deaths: dyingCells.size,
      ruleSet: currentRules,
    };

    set(state => ({
      metrics: [...state.metrics, metrics],
    }));

    return metrics;
  },

  calculateNextGeneration: (onStabilize) => {
    const { activeCells } = get();

    set({ previousActiveCells: new Set(activeCells) });

    const nextActiveCells = get().getNextStateSet();

    // check if grid has stabilized
    const hasStabilized = get().areGridsEqual(activeCells, nextActiveCells);
    if (hasStabilized) {
      set({ stabilized: true });
      setTimeout(() => {
        get().stopSimulation();
        if (onStabilize) onStabilize();
      }, 0);

      return;
    }

    set(state => ({
      activeCells: nextActiveCells,
      generation: state.generation + 1,
      stabilized: false,
    }));

    get().collectMetrics();
  },

  createGrid: (rowCount, colCount) => {
    console.log('creating grid with dimensions:', rowCount, colCount);
    set({
      rows: rowCount,
      cols: colCount,
      activeCells: new Set(),
      stabilized: false,
    });
  },

  toggleCell: (rowIndex, colIndex) => {
    const { activeCells } = get();
    const nextActiveCells = new Set(activeCells);
    const coordStr = coordToString(rowIndex, colIndex);

    if (nextActiveCells.has(coordStr)) {
      nextActiveCells.delete(coordStr);
    } else {
      nextActiveCells.add(coordStr);
    }

    set({
      activeCells: nextActiveCells,
      stabilized: false,
    });
  },

  clearGrid: () => {
    get().stopSimulation();
    set({
      activeCells: new Set(),
      generation: 0,
      metrics: [],
      stabilized: false,
    });
  },

  changeRules: (ruleName) => {
    if (RULES[ruleName]) {
      set({ currentRules: ruleName });
    }
  },

  getGridArray: () => {
    const { activeCells, rows, cols } = get();
    const gridArray = Array(rows).fill().map(() => Array(cols).fill(0));

    activeCells.forEach(coordStr => {
      const [row, col] = stringToCoord(coordStr);
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        gridArray[row][col] = 1;
      }
    });

    return gridArray;
  },

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
    const { rows, cols } = get();
    if (config && config.cells && Array.isArray(config.cells)) {
      set({
        rows: config.rows || rows,
        cols: config.cols || cols,
        activeCells: new Set(config.cells),
        stabilized: false,
      });

      if (config.rules && RULES[config.rules]) {
        set({ currentRules: config.rules });
      }

      return { success: true };
    }

    return { success: false, message: 'Invalid configuration' };
  },

  startSimulation: (onStabilize) => {
    const { activeCells, simulationSpeed, simulationIntervalRef } = get();
    if (activeCells.size > 0) {
      // clean up any existing interval
      if (simulationIntervalRef) {
        clearInterval(simulationIntervalRef);
      }

      // set up new interval
      console.log(`Starting simulation with speed: ${simulationSpeed}ms`);
      const intervalId = window.setInterval(() => {
        get().calculateNextGeneration(onStabilize);
      }, simulationSpeed);

      set({
        simulationIntervalRef: intervalId,
        isRunning: true,
        stabilized: false,
      });
    }
  },

  updateInterval: (newSpeed) => {
    const { isRunning, simulationIntervalRef } = get();
    set({ simulationSpeed: newSpeed });

    // if simulation is running, restart with new speed
    if (isRunning) {
      if (simulationIntervalRef) {
        clearInterval(simulationIntervalRef);
      }

      const intervalId = window.setInterval(() => {
        get().calculateNextGeneration();
      }, newSpeed);

      set({ simulationIntervalRef: intervalId });
    }
  },

  setContinuousGrid: (value) => {
    set({ isContinuous: value });
  },

  setShowGridChanges: (value) => {
    const { showChanges, activeCells } = get();
    const newShowChanges = typeof value === 'boolean' ? value : !showChanges;
    set({ showChanges: newShowChanges });

    // calculate born and dying cells when enabling
    if (newShowChanges) {
      const nextGeneration = get().getNextStateSet();

      // find cells that will be born (in next gen but not in current)
      const newBornCells = new Set();
      nextGeneration.forEach(cell => {
        if (!activeCells.has(cell)) {
          newBornCells.add(cell);
        }
      });

      // find cells that will die (in current but not in next gen)
      const newDyingCells = new Set();
      activeCells.forEach(cell => {
        if (!nextGeneration.has(cell)) {
          newDyingCells.add(cell);
        }
      });

      set({
        bornCells: newBornCells,
        dyingCells: newDyingCells,
      });
    }
  },

  placePattern: (pattern, startRow, startCol) => {
    const { activeCells, rows, cols } = get();
    const nextActiveCells = new Set(activeCells);

    // check if the pattern fits on the grid
    if (startRow + pattern.height > rows || startCol + pattern.width > cols) {
      return { success: false, message: 'Pattern would extend beyond grid boundaries' };
    }

    // place the pattern on the grid
    for (let i = 0; i < pattern.height; i++) {
      for (let j = 0; j < pattern.width; j++) {
        const rowIndex = startRow + i;
        const colIndex = startCol + j;
        const coordStr = coordToString(rowIndex, colIndex);

        // if the cell in the pattern is alive (1), add it to the grid
        if (pattern.cells[i][j] === 1) {
          nextActiveCells.add(coordStr);
        } else {
          // if we want to clear cells where the pattern is placed
          nextActiveCells.delete(coordStr);
        }
      }
    }

    set({
      activeCells: nextActiveCells,
      stabilized: false,
    });

    return { success: true };
  },

  getMetrics: () => get().metrics,

  exportData: () => {
    const { metrics } = get();

    const headers = ['Timestamp', 'Generation', 'Population Size', 'Births', 'Deaths', 'Rule Set'];
    const rows = metrics.map(m => [
      m.timestamp,
      m.generation,
      m.populationSize,
      m.births,
      m.deaths,
      m.ruleSet,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `game_of_life_metrics_${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  getGridDimensions: () => {
    const { rows, cols } = get();

    return { rows, cols };
  },
}));
