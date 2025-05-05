import { useRef } from 'react';
import { shallow } from 'zustand/shallow';
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
  ] = useGameStore(
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
    ],
    shallow,
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
  };
};
