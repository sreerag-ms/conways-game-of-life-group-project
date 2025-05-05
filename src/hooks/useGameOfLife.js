import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_COLS, DEFAULT_ROWS, DEFAULT_SIMULATION_SPEED, RULES } from './constants';

// Helper to convert between representations
const coordToString = (row, col) => `${row},${col}`;
const stringToCoord = (str) => str.split(',').map(Number);

export const useGameOfLife = ({ onStabilize } = {}) => {
  // State management
  const [activeCells, setActiveCells] = useState(new Set());
  const [previousActiveCells, setPreviousActiveCells] = useState(new Set());
  const [bornCells, setBornCells] = useState(new Set()); // Cells that will be born in the next generation
  const [dyingCells, setDyingCells] = useState(new Set()); // Cells that will die in the next generation
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(DEFAULT_SIMULATION_SPEED);
  const [currentRules, setCurrentRules] = useState('GoL');
  const [isContinuous, setIsContinuous] = useState(true); // Add continuous grid toggle
  const [showChanges, setShowChanges] = useState(false); // Add state to control whether to show previous cells

  // Refs
  const simulationIntervalRef = useRef(null);

  // Calculate next state set without updating state
  const getNextStateSet = useCallback((currentActiveCells) => {
    const nextActiveCells = new Set();
    const cellsToCheck = new Set();
    const rules = RULES[currentRules];

    // Add all active cells to check
    currentActiveCells.forEach(coordStr => {
      cellsToCheck.add(coordStr);

      // Add all neighbors to check
      const [row, col] = stringToCoord(coordStr);
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;

          // Handle continuous vs non-continuous grid
          let newRow, newCol;
          if (isContinuous) {
            // Wrap around the edges (continuous)
            newRow = (row + i + rows) % rows;
            newCol = (col + j + cols) % cols;
          } else {
            // No wrapping (non-continuous)
            newRow = row + i;
            newCol = col + j;

            // Skip if outside grid boundaries
            if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
              continue;
            }
          }

          cellsToCheck.add(coordToString(newRow, newCol));
        }
      }
    });

    // Check all cells that might change state
    cellsToCheck.forEach(coordStr => {
      const [row, col] = stringToCoord(coordStr);
      const isAlive = currentActiveCells.has(coordStr);

      // Count live neighbors
      let liveNeighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;

          let neighborRow, neighborCol;
          if (isContinuous) {
            // Wrap around the edges (continuous)
            neighborRow = (row + i + rows) % rows;
            neighborCol = (col + j + cols) % cols;
          } else {
            // No wrapping (non-continuous)
            neighborRow = row + i;
            neighborCol = col + j;

            // Skip if outside grid boundaries
            if (neighborRow < 0 || neighborRow >= rows || neighborCol < 0 || neighborCol >= cols) {
              continue;
            }
          }

          const neighborCoord = coordToString(neighborRow, neighborCol);

          if (currentActiveCells.has(neighborCoord)) {
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

    return nextActiveCells;
  }, [rows, cols, currentRules, isContinuous]);

  // Update cell change tracking whenever activeCells changes
  useEffect(() => {
    setPreviousActiveCells(new Set(activeCells));

    // If showChanges is enabled, calculate born and dying cells
    if (showChanges) {
      const nextGeneration = getNextStateSet(activeCells);

      // Find cells that will be born (in next gen but not in current)
      const newBornCells = new Set();
      nextGeneration.forEach(cell => {
        if (!activeCells.has(cell)) {
          newBornCells.add(cell);
        }
      });

      // Find cells that will die (in current but not in next gen)
      const newDyingCells = new Set();
      activeCells.forEach(cell => {
        if (!nextGeneration.has(cell)) {
          newDyingCells.add(cell);
        }
      });

      setBornCells(newBornCells);
      setDyingCells(newDyingCells);
    }
  }, [activeCells, showChanges, getNextStateSet]);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  // Calculate next generation using sparse representation
  const calculateNextGeneration = useCallback(() => {
    setActiveCells(currentActiveCells => {
      // Store the current state before changing
      setPreviousActiveCells(new Set(currentActiveCells));

      // Get the next state set
      const nextActiveCells = getNextStateSet(currentActiveCells);

      // Check if the grid has stabilized
      const hasStabilized = areGridsEqual(currentActiveCells, nextActiveCells);
      if (hasStabilized) {
        console.log('Grid has stabilized');
        setTimeout(() => {
          stopSimulation();
          if (onStabilize) onStabilize();
        }, 0);

        return currentActiveCells; // Return the previous grid to avoid rendering changes
      }

      return nextActiveCells;
    });
  }, [getNextStateSet, stopSimulation, onStabilize]);

  // Compare two sets of active cells
  const areGridsEqual = (cells1, cells2) => {
    if (cells1.size !== cells2.size) return false;
    for (const cell of cells1) {
      if (!cells2.has(cell)) return false;
    }

    return true;
  };

  // Create the initial grid
  const createGrid = useCallback((rowCount = rows, colCount = cols) => {
    console.log('Creating grid with dimensions:', rowCount, colCount);
    setRows(rowCount);
    setCols(colCount);
    setActiveCells(new Set());
  }, []);

  // Toggle cell state
  const toggleCell = useCallback((rowIndex, colIndex) => {
    setActiveCells(currentActiveCells => {
      const nextActiveCells = new Set(currentActiveCells);
      const coordStr = coordToString(rowIndex, colIndex);

      if (nextActiveCells.has(coordStr)) {
        nextActiveCells.delete(coordStr);
      } else {
        nextActiveCells.add(coordStr);
      }

      return nextActiveCells;
    });
  }, []);

  // Clear grid
  const clearGrid = useCallback(() => {
    stopSimulation();
    setActiveCells(new Set());
  }, [stopSimulation]);

  // Change rules
  const changeRules = useCallback((ruleName) => {
    if (RULES[ruleName]) {
      setCurrentRules(ruleName);
    }
  }, []);

  // Convert sparse grid to 2D array (for compatibility with UI)
  const getGridArray = useCallback(() => {
    const gridArray = Array(rows).fill().map(() => Array(cols).fill(0));

    activeCells.forEach(coordStr => {
      const [row, col] = stringToCoord(coordStr);
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        gridArray[row][col] = 1;
      }
    });

    return gridArray;
  }, [activeCells, rows, cols]);

  // Save configuration
  const saveConfig = useCallback(() => ({
    cells: Array.from(activeCells),
    rows,
    cols,
    rules: currentRules,
  }), [activeCells, rows, cols, currentRules]);

  // Load configuration
  const loadConfig = useCallback((config) => {
    if (config && config.cells && Array.isArray(config.cells)) {
      setRows(config.rows || rows);
      setCols(config.cols || cols);
      setActiveCells(new Set(config.cells));
      if (config.rules && RULES[config.rules]) {
        setCurrentRules(config.rules);
      }

      return { success: true };
    }

    return { success: false, message: 'Invalid configuration' };
  }, [rows, cols]);

  // Start simulation (same as before, using the new calculateNextGeneration)
  const startSimulation = useCallback(() => {
    if (activeCells.size > 0) {
      // Clean up any existing interval
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }

      // Set up new interval
      console.log(`Starting simulation with speed: ${simulationSpeed}ms`);
      simulationIntervalRef.current = window.setInterval(() => {
        calculateNextGeneration();
      }, simulationSpeed);

      setIsRunning(true);
    }
  }, [activeCells.size, simulationSpeed, calculateNextGeneration]);

  // Update simulation speed (unchanged)
  const updateSimulationSpeed = useCallback((newSpeed) => {
    setSimulationSpeed(newSpeed);

    // If simulation is running, restart with new speed
    if (isRunning) {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }

      simulationIntervalRef.current = window.setInterval(() => {
        calculateNextGeneration();
      }, newSpeed);
    }
  }, [isRunning, calculateNextGeneration]);

  // Clean up on unmount
  useEffect(() => () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }
  }, []);

  // Toggle continuous grid setting
  const setContinuousGrid = useCallback((value) => {
    setIsContinuous(value);
  }, []);

  // Toggle or set showChanges state and calculate born/dying cells if enabled
  const setShowGridChanges = useCallback((value) => {
    const newShowChanges = typeof value === 'boolean' ? value : !showChanges;
    setShowChanges(newShowChanges);

    // Calculate born and dying cells when enabling
    if (newShowChanges) {
      const nextGeneration = getNextStateSet(activeCells);

      // Find cells that will be born (in next gen but not in current)
      const newBornCells = new Set();
      nextGeneration.forEach(cell => {
        if (!activeCells.has(cell)) {
          newBornCells.add(cell);
        }
      });

      // Find cells that will die (in current but not in next gen)
      const newDyingCells = new Set();
      activeCells.forEach(cell => {
        if (!nextGeneration.has(cell)) {
          newDyingCells.add(cell);
        }
      });

      setBornCells(newBornCells);
      setDyingCells(newDyingCells);
    }
  }, [showChanges, activeCells, getNextStateSet]);

  return {
    grid: getGridArray(),
    activeCells,
    ...(showChanges ? {
      bornCells,
      dyingCells,
    } : {}), // Include born and dying cells instead of previousActiveCells
    rows,
    cols,
    isRunning,
    interval: simulationSpeed,
    currentRules,
    isContinuous,
    createGrid,
    toggleCell,
    nextGeneration: calculateNextGeneration,
    startSimulation,
    stopSimulation,
    clearGrid,
    saveConfig,
    loadConfig,
    updateInterval: updateSimulationSpeed,
    changeRules,
    setContinuousGrid,
    setShowGridChanges,
    getNextStateSet,
    showChanges,
  };
};
