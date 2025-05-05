import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useMemo } from 'react';
import { useGameOfLife } from '../../hooks/useGameOfLife';
import GameSettingsCard from './Card/GameSettingsCard';
import Controls from './Controls';
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
  } = useGameOfLife({
    onStabilize: () => setStabilizedModalOpen(true),
  });

  useEffect(() => {
    createGrid(100, 100);
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
      setContinuousGrid={setContinuousGrid}
      isContinuous={isContinuous}
    />
  ), [rows, cols, isRunning, interval, isContinuous, createGrid, startSimulation,
    stopSimulation, nextGeneration, clearGrid, saveConfig, loadConfig, updateInterval, setContinuousGrid]);

  return (
    <Content className="p-3 md:p-6 lg:p-12 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Add the Game Settings Card */}
      <GameSettingsCard
        rows={rows}
        cols={cols}
        interval={interval}
        isContinuous={isContinuous}
        onGenerate={createGrid}
        onUpdateInterval={updateInterval}
        setContinuousGrid={setContinuousGrid}
        onClear={clearGrid}
      />

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
