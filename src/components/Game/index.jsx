import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useMemo } from 'react';
import { useGameOfLife } from '../../hooks/useGameOfLife';
import Controls from './Controls';
import WebGLGrid from './WebGLGrid';

const Game = ({ setStabilizedModalOpen }) => {
  const {
    activeCells,
    rows,
    cols,
    isRunning,
    interval,
    createGrid,
    toggleCell,
    nextGeneration,
    startSimulation,
    stopSimulation,
    clearGrid,
    saveConfig,
    loadConfig,
    updateInterval,
  } = useGameOfLife({
    onStabilize: () => setStabilizedModalOpen(true),
  });

  useEffect(() => {
    createGrid(20, 20);
  }, [createGrid]);

  // Memoize the controls to prevent rerenders during simulation
  const controlsComponent = useMemo(() => (
    <Controls
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
    />
  ), [rows, cols, isRunning, interval, createGrid, startSimulation,
    stopSimulation, nextGeneration, clearGrid, saveConfig, loadConfig, updateInterval]);

  return (
    <Content className="p-3 md:p-6 lg:p-12 bg-gradient-to-b from-gray-50 to-gray-100">
      {controlsComponent}

      <div className="pb-4 overflow-auto">
        <WebGLGrid
          rows={rows}
          cols={cols}
          activeCells={activeCells}
          onCellClick={toggleCell}
        />
      </div>
    </Content>
  );
};

export default Game;
