import { Content } from 'antd/es/layout/layout';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { useGameOfLife } from '../../hooks/useGameOfLife';
import { useGameOfLifeTheme } from '../../hooks/useGameOfLifeTheme';
import GridSection from './GridSection';
import SimulationControls from './SimulationControls';

const Game = ({ setStabilizedModalOpen }) => {
  const {
    rows,
    cols,
    isRunning,
    interval,
    isContinuous,
    generation,
    metrics,
    createGrid,
    nextGeneration,
    startSimulation,
    stopSimulation,
    clearGrid,
    exportData,
    saveConfig,
    loadConfig,
    updateInterval,
    setContinuousGrid,
    setShowGridChanges,
  } = useGameOfLife({
    onStabilize: () => setStabilizedModalOpen(true),
  });

  const { theme, updateColor, resetTheme } = useGameOfLifeTheme();

  useEffect(() => {
    createGrid(100, 100);
  }, [createGrid]);

  // Memoize the controls to prevent rerenders during simulation
  const controlsComponent = useMemo(() => (
    <SimulationControls
      rows={rows}
      cols={cols}
      isRunning={isRunning}
      interval={interval}
      generation={generation}
      metrics={metrics}
      onGenerate={createGrid}
      onStart={startSimulation}
      onStop={stopSimulation}
      onStep={nextGeneration}
      onClear={clearGrid}
      onExportData={exportData}
      onSaveConfig={saveConfig}
      onLoadConfig={loadConfig}
      onUpdateInterval={updateInterval}
      setContinuousGrid={setContinuousGrid}
      isContinuous={isContinuous}
      setShowGridChanges={setShowGridChanges}
      updateColor={updateColor}
      resetTheme={resetTheme}
      theme={theme}
    />
  ), [rows, cols, isRunning, interval, isContinuous, generation, metrics, createGrid, startSimulation,
    stopSimulation, nextGeneration, clearGrid, exportData, saveConfig, loadConfig, updateInterval, setContinuousGrid, setShowGridChanges, updateColor, resetTheme, theme]);

  return (
    <Content className="p-3 md:p-6 lg:p-12 bg-gradient-to-b from-gray-50 to-gray-100">
      {controlsComponent}

      <div className="pb-4 overflow-auto">
        <GridSection />
      </div>
    </Content>
  );
};

Game.propTypes = {
  setStabilizedModalOpen: PropTypes.func.isRequired,
};

export default Game;
