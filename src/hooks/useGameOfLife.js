import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_COLS, DEFAULT_ROWS, DEFAULT_SIMULATION_SPEED, createEmptyGrid } from './constants';
import {
  areGridsEqual,
  calculateNextGenerationGrid,
  gridToConfigText,
  parseConfigText,
} from './utils';

export const useGameOfLife = ({ onStabilize } = {}) => {
  // State management
  const [grid, setGrid] = useState([]);
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(DEFAULT_SIMULATION_SPEED);

  // Refs
  const simulationIntervalRef = useRef(null);

  // Stop simulation - declared early to avoid circular reference
  const stopSimulation = useCallback(() => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  // Calculate next generation
  const calculateNextGeneration = useCallback(() => {
    setGrid(currentGrid => {
      const nextGrid = calculateNextGenerationGrid(currentGrid, rows, cols);

      // Check if the grid has stabilized
      const hasStabilized = areGridsEqual(currentGrid, nextGrid);
      if (hasStabilized) {
        console.log('Grid has stabilized');
        setTimeout(() => {
          stopSimulation();
          if (onStabilize) onStabilize();
        }, 0);

        return currentGrid; // Return the previous grid to avoid rendering an empty grid
      }

      return nextGrid;
    });
  }, [rows, cols, stopSimulation, onStabilize]);

  // Start simulation
  const startSimulation = useCallback(() => {
    if (grid.length > 0) {
      // Clean up any existing interval
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }

      // Set up new interval
      console.log(`Starting simulation with speed: ${simulationSpeed}ms`);
      simulationIntervalRef.current = window.setInterval(() => {
        console.log('Calculating next generation');
        calculateNextGeneration();
      }, simulationSpeed);

      setIsRunning(true);
    }
  }, [grid, simulationSpeed, calculateNextGeneration]);

  // Update simulation speed
  const updateSimulationSpeed = useCallback((newSpeed) => {
    setSimulationSpeed(newSpeed);

    // If simulation is running, restart with new speed
    if (isRunning) {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }

      console.log(`Updating simulation speed to: ${newSpeed}ms`);
      simulationIntervalRef.current = window.setInterval(() => {
        console.log('Running next generation (after speed update)');
        calculateNextGeneration();
      }, newSpeed);
    }
  }, [isRunning, calculateNextGeneration]);

  // ===== GRID MANAGEMENT =====

  // Create the initial grid
  const createGrid = useCallback((rowCount = rows, colCount = cols) => {
    console.log('Creating grid with dimensions:', rowCount, colCount);
    const newGrid = createEmptyGrid(rowCount, colCount);
    setRows(rowCount);
    setCols(colCount);
    setGrid(newGrid);

    return newGrid;
  }, [rows, cols]);

  // Toggle cell state (alive/dead)
  const toggleCell = useCallback((rowIndex, colIndex) => {
    setGrid(currentGrid => {
      const nextGrid = currentGrid.map(row => [...row]);
      nextGrid[rowIndex][colIndex] = nextGrid[rowIndex][colIndex] ? 0 : 1;

      return nextGrid;
    });
  }, []);

  // Clear grid
  const clearGrid = useCallback(() => {
    stopSimulation();
    setGrid(currentGrid => createEmptyGrid(rows, cols));
  }, [stopSimulation, rows, cols]);

  // Save configuration to text
  const saveConfig = useCallback(() => gridToConfigText(grid, rows, cols), [grid, rows, cols]);

  // Load configuration from text
  const loadConfig = useCallback((configText) => {
    const result = parseConfigText(configText, rows, cols, grid);
    if (result.success) {
      setGrid(result.grid);
    }

    return result;
  }, [grid, rows, cols]);

  // Clean up on unmount
  useEffect(() => () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }
  }, []);

  return {
    grid,
    rows,
    cols,
    isRunning,
    interval: simulationSpeed,
    createGrid,
    toggleCell,
    nextGeneration: calculateNextGeneration,
    startSimulation,
    stopSimulation,
    clearGrid,
    saveConfig,
    loadConfig,
    updateInterval: updateSimulationSpeed,
  };
};
