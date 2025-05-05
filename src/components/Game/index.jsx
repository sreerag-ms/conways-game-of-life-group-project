import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useMemo } from 'react';
import { useGameOfLife } from '../../hooks/useGameOfLife';
import { useGameOfLifeTheme } from '../../hooks/useGameOfLifeTheme';
import SimulationControls from './SimulationControls';
import WebGLGrid from './WebGLGrid';

const Game = ({ setStabilizedModalOpen }) => {
  const {
    activeCells,
    rows,
    cols,
    isRunning,
    interval,
    isContinuous,
    createGrid,
    toggleCell,
    nextGeneration,
    startSimulation,
    stopSimulation,
    clearGrid,
    saveConfig,
    loadConfig,
    updateInterval,
    setContinuousGrid,
    bornCells,
    dyingCells,
    showChanges,
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
      onGenerate={createGrid}
      onStart={startSimulation}
      onStop={stopSimulation}
      onStep={nextGeneration}
      onClear={clearGrid}
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
  ), [rows, cols, isRunning, interval, isContinuous, createGrid, startSimulation,
    stopSimulation, nextGeneration, clearGrid, saveConfig, loadConfig, updateInterval, setContinuousGrid, setShowGridChanges, updateColor, resetTheme, theme]);

  return (
    <Content className="p-3 md:p-6 lg:p-12 bg-gradient-to-b from-gray-50 to-gray-100">
      {controlsComponent}

      <div className="pb-4 overflow-auto">
        <WebGLGrid
          rows={rows}
          cols={cols}
          activeCells={activeCells}
          onCellClick={toggleCell}
          theme={theme}
          dyingCells={dyingCells}
          bornCells={bornCells}
          showChanges={showChanges}
        />
      </div>
    </Content>
  );
};

export default Game;
