import { useEffect, useRef } from 'react';
import { useGameStore } from './gameStore';

export const useGameOfLife = ({ onStabilize } = {}) => {
  // Reference to the onStabilize callback so it can be accessed in the store
  const onStabilizeRef = useRef(onStabilize);

  // Update the ref whenever onStabilize changes
  useEffect(() => {
    onStabilizeRef.current = onStabilize;
  }, [onStabilize]);

  // Get all state and methods from the store
  const store = useGameStore();

  // Clean up on unmount
  useEffect(() => () => {
    if (store.simulationIntervalRef) {
      clearInterval(store.simulationIntervalRef);
    }
  }, [store.simulationIntervalRef]);

  // Update cell changes when active cells change
  useEffect(() => {
    store.updateCellChanges();
  }, [store.activeCells]);

  // Return the same API as before
  return {
    grid: store.getGridArray(),
    activeCells: store.activeCells,
    ...(store.showChanges ? {
      bornCells: store.bornCells,
      dyingCells: store.dyingCells,
    } : {}),
    rows: store.rows,
    cols: store.cols,
    isRunning: store.isRunning,
    interval: store.simulationSpeed,
    currentRules: store.currentRules,
    isContinuous: store.isContinuous,
    createGrid: store.createGrid,
    toggleCell: store.toggleCell,
    nextGeneration: () => store.calculateNextGeneration(onStabilizeRef.current),
    startSimulation: () => store.startSimulation(onStabilizeRef.current),
    stopSimulation: store.stopSimulation,
    clearGrid: store.clearGrid,
    saveConfig: store.saveConfig,
    loadConfig: store.loadConfig,
    updateInterval: store.updateInterval,
    changeRules: store.changeRules,
    setContinuousGrid: store.setContinuousGrid,
    setShowGridChanges: store.setShowGridChanges,
    getNextStateSet: store.getNextStateSet,
    showChanges: store.showChanges,
  };
};
