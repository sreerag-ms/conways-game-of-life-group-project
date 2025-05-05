import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_COLS, DEFAULT_ROWS, DEFAULT_SIMULATION_SPEED, DEFAULT_COLORS, createEmptyGrid } from './constants';
import {
  areGridsEqual,
  calculateNextGenerationGrid,
  calculateCellStates,
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
  const [visualizationState, setVisualizationState] = useState('current');
  const [cellStates, setCellStates] = useState([]);
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [colors, setColors] = useState(DEFAULT_COLORS);

  // Refs
  const simulationTimeoutRef = useRef(null);
  const animationTimeoutRef = useRef(null);
  const currentGridRef = useRef(grid);
  const isRunningRef = useRef(false);

  // Update grid ref when grid changes
  useEffect(() => {
    currentGridRef.current = grid;
  }, [grid]);

  const stopSimulation = useCallback(() => {
    isRunningRef.current = false;
    if (simulationTimeoutRef.current) {
      clearTimeout(simulationTimeoutRef.current);
      simulationTimeoutRef.current = null;
    }
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    setIsRunning(false);
    setVisualizationState('current');
  }, []);

  const advance = useCallback(() => {
    if (!isRunningRef.current) return;

    const currentGrid = currentGridRef.current;
    const nextGrid = calculateNextGenerationGrid(currentGrid, rows, cols);

    // Check if the grid has stabilized
    const hasStabilized = areGridsEqual(currentGrid, nextGrid);
    if (hasStabilized) {
      console.log('Grid has stabilized');
      stopSimulation();
      if (onStabilize) onStabilize();
      return;
    }

    if (previewEnabled) {
      // Show preview
      const states = calculateCellStates(currentGrid, rows, cols);
      setCellStates(states);
      setVisualizationState('preview');

      // Schedule the update to next generation
      const previewDuration = Math.min(simulationSpeed / 3, 200);
      animationTimeoutRef.current = setTimeout(() => {
        if (!isRunningRef.current) return;

        setGrid(nextGrid);
        setVisualizationState('current');
        
        // Schedule the next advance after updating to next generation
        simulationTimeoutRef.current = setTimeout(() => {
          if (isRunningRef.current) {
            advance();
          }
        }, simulationSpeed - previewDuration);
      }, previewDuration);
    } else {
      // Direct update without preview
      setGrid(nextGrid);
      
      // Schedule the next advance
      simulationTimeoutRef.current = setTimeout(() => {
        if (isRunningRef.current) {
          advance();
        }
      }, simulationSpeed);
    }
  }, [rows, cols, simulationSpeed, previewEnabled, stopSimulation, onStabilize]);

  // Start simulation
  const startSimulation = useCallback(() => {
    if (grid.length > 0) {
      // Clear any existing timeouts
      if (simulationTimeoutRef.current) {
        clearTimeout(simulationTimeoutRef.current);
        simulationTimeoutRef.current = null;
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }

      isRunningRef.current = true;
      setIsRunning(true);
      
      // Start the first iteration
      advance();
    }
  }, [grid, advance]);

  // Manual step with animation
  const manualStep = useCallback(() => {
    if (isRunning) return;

    const nextGrid = calculateNextGenerationGrid(grid, rows, cols);

    if (previewEnabled) {
      const states = calculateCellStates(grid, rows, cols);
      setCellStates(states);
      setVisualizationState('preview');

      const previewDuration = 500; // 500ms for manual step preview
      animationTimeoutRef.current = setTimeout(() => {
        setVisualizationState('current');
        setGrid(nextGrid);
      }, previewDuration);
    } else {
      // Directly update to next generation without preview
      setGrid(nextGrid);
    }
  }, [grid, rows, cols, isRunning, previewEnabled]);

  // Preview next generation
  const previewNextGeneration = useCallback(() => {
    if (isRunning) return;
    
    if (visualizationState === 'preview') {
      // If already in preview, switch back to current
      setVisualizationState('current');
    } else {
      // Show preview
      const states = calculateCellStates(grid, rows, cols);
      setCellStates(states);
      setVisualizationState('preview');
    }
  }, [grid, rows, cols, isRunning, visualizationState]);

  // Update simulation speed
  const updateSimulationSpeed = useCallback((newSpeed) => {
    setSimulationSpeed(newSpeed);
    if (isRunningRef.current) {
      // Restart simulation with new speed
      stopSimulation();
      setTimeout(() => startSimulation(), 0);
    }
  }, [stopSimulation, startSimulation]);

  // Create the initial grid
  const createGrid = useCallback((rowCount = rows, colCount = cols) => {
    console.log('Creating grid with dimensions:', rowCount, colCount);
    const newGrid = createEmptyGrid(rowCount, colCount);
    setRows(rowCount);
    setCols(colCount);
    setGrid(newGrid);
    setVisualizationState('current');
    setCellStates([]);
    return newGrid;
  }, [rows, cols]);

  // Toggle cell state
  const toggleCell = useCallback((rowIndex, colIndex) => {
    if (visualizationState === 'preview') return; // Prevent toggling during preview
    setGrid(currentGrid => {
      const nextGrid = currentGrid.map(row => [...row]);
      nextGrid[rowIndex][colIndex] = nextGrid[rowIndex][colIndex] ? 0 : 1;
      return nextGrid;
    });
  }, [visualizationState]);

  // Clear grid
  const clearGrid = useCallback(() => {
    stopSimulation();
    setGrid(createEmptyGrid(rows, cols));
    setVisualizationState('current');
    setCellStates([]);
  }, [stopSimulation, rows, cols]);

  // Toggle preview functionality
  const togglePreview = useCallback(() => {
    setPreviewEnabled(prev => !prev);
    // If turning off preview while in preview state, switch back to current
    if (previewEnabled && visualizationState === 'preview') {
      setVisualizationState('current');
    }
  }, [previewEnabled, visualizationState]);

  // Update colors
  const updateColors = useCallback((newColors) => {
    setColors(current => ({
      ...current,
      ...newColors,
    }));
  }, []);

  // Clean up on unmount
  useEffect(() => () => {
    if (simulationTimeoutRef.current) {
      clearTimeout(simulationTimeoutRef.current);
    }
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
  }, []);

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

  return {
    grid,
    rows,
    cols,
    isRunning,
    interval: simulationSpeed,
    visualizationState,
    cellStates,
    previewEnabled,
    colors,
    createGrid,
    toggleCell,
    nextGeneration: manualStep,
    previewNextGeneration,
    startSimulation,
    stopSimulation,
    clearGrid,
    saveConfig,
    loadConfig,
    updateInterval: updateSimulationSpeed,
    togglePreview,
    updateColors,
  };
};
