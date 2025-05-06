import { useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useGameStore } from './gameStore';

export const useSimulationControls = ({ onStabilize } = {}) => {
  const onStabilizeRef = useRef(onStabilize);

  const [
    isRunning,
    startSimulation,
    stopSimulation,
    calculateNextGeneration,
    clearGrid,
    exportData,
    setShowGridChanges,
    simulationSpeed,
    updateInterval,
    showChanges,
    getMetrics,
    getGridDimensions,
    loadConfig,
    changeRules,
    createGrid,
    setContinuousGrid,
    currentRules,
  ] = useGameStore(useShallow(
    state => [
      state.isRunning,
      state.startSimulation,
      state.stopSimulation,
      state.calculateNextGeneration,
      state.clearGrid,
      state.exportData,
      state.setShowGridChanges,
      state.simulationSpeed,
      state.updateInterval,
      state.showChanges,
      state.getMetrics,
      state.getGridDimensions,
      state.loadConfig,
      state.changeRules,
      state.createGrid,
      state.setContinuousGrid,
      state.currentRules,
    ]),
  );

  return {
    isRunning,
    startSimulation: () => startSimulation(onStabilizeRef.current),
    stopSimulation,
    nextGeneration: () => calculateNextGeneration(onStabilizeRef.current),
    clearGrid,
    exportData,
    setShowGridChanges,
    interval: simulationSpeed,
    updateInterval,
    showChanges,
    getMetrics,
    getGridDimensions,
    loadConfig,
    changeRules,
    createGrid,
    setContinuousGrid,
    currentRules,
  };
};
