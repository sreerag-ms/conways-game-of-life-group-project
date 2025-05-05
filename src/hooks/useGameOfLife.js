import { useEffect, useRef } from 'react';
import { useGameStore } from './gameStore';

export const useGameOfLife = ({ onStabilize } = {}) => {
  const onStabilizeRef = useRef(onStabilize);

  useEffect(() => {
    onStabilizeRef.current = onStabilize;
  }, [onStabilize]);

  const store = useGameStore();

  useEffect(() => () => {
    if (store.simulationIntervalRef) {
      clearInterval(store.simulationIntervalRef);
    }
  }, [store.simulationIntervalRef]);

  useEffect(() => {
    store.updateCellChanges();
  }, [store.activeCells]);

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
    generation: store.generation,
    metrics: store.metrics,
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
    placePattern: store.placePattern,
    exportData: store.exportData,
  };
};
