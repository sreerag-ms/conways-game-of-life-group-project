import { useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { useGameStore } from './gameStore';

export const useGameOfLife = ({ onStabilize } = {}) => {
  const onStabilizeRef = useRef(onStabilize);

  useEffect(() => {
    onStabilizeRef.current = onStabilize;
  }, [onStabilize]);

  const {
    getGridArray,
    activeCells,
    bornCells,
    dyingCells,
    rows,
    cols,
    isRunning,
    simulationSpeed,
    currentRules,
    isContinuous,
    generation,
    metrics,
    createGrid,
    toggleCell,
    calculateNextGeneration,
    startSimulation,
    stopSimulation,
    clearGrid,
    saveConfig,
    loadConfig,
    updateInterval,
    changeRules,
    setContinuousGrid,
    setShowGridChanges,
    getNextStateSet,
    showChanges,
    placePattern,
    exportData,
    simulationIntervalRef,
    updateCellChanges,
  } = useGameStore(
    (state) => ({
      getGridArray: state.getGridArray,
      activeCells: state.activeCells,
      bornCells: state.bornCells,
      dyingCells: state.dyingCells,
      rows: state.rows,
      cols: state.cols,
      isRunning: state.isRunning,
      simulationSpeed: state.simulationSpeed,
      currentRules: state.currentRules,
      isContinuous: state.isContinuous,
      generation: state.generation,
      metrics: state.metrics,
      createGrid: state.createGrid,
      toggleCell: state.toggleCell,
      calculateNextGeneration: state.calculateNextGeneration,
      startSimulation: state.startSimulation,
      stopSimulation: state.stopSimulation,
      clearGrid: state.clearGrid,
      saveConfig: state.saveConfig,
      loadConfig: state.loadConfig,
      updateInterval: state.updateInterval,
      changeRules: state.changeRules,
      setContinuousGrid: state.setContinuousGrid,
      setShowGridChanges: state.setShowGridChanges,
      getNextStateSet: state.getNextStateSet,
      showChanges: state.showChanges,
      placePattern: state.placePattern,
      exportData: state.exportData,
      simulationIntervalRef: state.simulationIntervalRef,
      updateCellChanges: state.updateCellChanges,
    }),
    shallow,
  );

  useEffect(() => () => {
    if (simulationIntervalRef) {
      clearInterval(simulationIntervalRef);
    }
  }, [simulationIntervalRef]);

  useEffect(() => {
    updateCellChanges();
  }, [activeCells, updateCellChanges]);

  return {
    grid: getGridArray(),
    activeCells,
    ...(showChanges ? {
      bornCells,
      dyingCells,
    } : {}),
    rows,
    cols,
    isRunning,
    interval: simulationSpeed,
    currentRules,
    isContinuous,
    generation,
    metrics,
    createGrid,
    toggleCell,
    nextGeneration: () => calculateNextGeneration(onStabilizeRef.current),
    startSimulation: () => startSimulation(onStabilizeRef.current),
    stopSimulation,
    clearGrid,
    saveConfig,
    loadConfig,
    updateInterval,
    changeRules,
    setContinuousGrid,
    setShowGridChanges,
    getNextStateSet,
    showChanges,
    placePattern,
    exportData,
  };
};
