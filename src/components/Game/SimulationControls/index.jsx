import {
  BgColorsOutlined,
  ClearOutlined,
  LineChartOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  StepForwardOutlined,
} from '@ant-design/icons';
import { Button, ColorPicker, Popover, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { DEFAULT_COLORS } from '../../../hooks/constants';
import { useGameOfLifeTheme } from '../../../hooks/useGameOfLifeTheme';
import { useSimulationControls } from '../../../hooks/useSimulationControls';
import ChartModal from '../../modals/ChartModal';
import SettingsModal from '../../modals/SettingsModal';

const SimulationControls = () => {
  const {
    isRunning,
    startSimulation,
    stopSimulation,
    nextGeneration,
    clearGrid,
    getMetrics,
  } = useSimulationControls();

  const { theme, updateColor, resetTheme } = useGameOfLifeTheme();

  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const [chartModalOpen, setChartModalOpen] = useState(false);

  const colorPickerContent = (
    <div className="flex flex-col gap-4" style={{ width: '250px' }}>
      <p className="text-gray-600">
        Customize the colors used in the grid visualization.
      </p>
      <div className="flex flex-col gap-3">
        {DEFAULT_COLORS.map(({ key, label, defaultColor }) => (
          <div key={key} className="flex items-center gap-3">
            <ColorPicker
              value={theme[key] || defaultColor}
              onChange={(color) => updateColor(key, color.toHexString())}
              format="hex"
              presets={[
                {
                  label: 'Recommended',
                  colors: ['#4682B4', '#ffffff', '#DAFFCB', '#f87171'],
                },
              ]}
            />
            <span className="text-sm text-gray-600">{label}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={resetTheme}>Reset to Default Colors</Button>
      </div>
    </div>
  );

  return (
    <div className="z-50 w-full mb-12">
      <div title="" className="w-full p-5 border-2 border-gray-200 rounded-2xl">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="text-3xl font-bold">Game of Life</div>
          <div className="flex items-center justify-between w-full md:w-1/2">
            <Tooltip title={isRunning ? 'Stop Simulation' : 'Start Simulation'}>
              <Button
                type={isRunning ? 'default' : 'primary'}
                danger={isRunning}
                icon={isRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                onClick={isRunning ? stopSimulation : startSimulation}
                size="large"
                shape="rounded"
                className="flex items-center justify-center"
                style={{ width: '100px', height: '48px', fontSize: '20px', borderWidth: '2px' }}
              >
                {isRunning ? 'Pause' : 'Run'}
              </Button>
            </Tooltip>

            <Tooltip title="Next Generation">
              <Button
                icon={<StepForwardOutlined />}
                onClick={nextGeneration}
                disabled={isRunning}
                size="large"
                shape="circle"
                className="flex items-center justify-center"
                style={{ width: '50px', height: '50px', fontSize: '24px', borderWidth: '2px' }}
              />
            </Tooltip>

            <Tooltip title="Clear Grid">
              <Button
                icon={<ClearOutlined />}
                onClick={clearGrid}
                size="small"
                shape="circle"
                className="flex items-center justify-center"
                style={{ width: '50px', height: '50px', fontSize: '24px', borderWidth: '2px' }}
              />
            </Tooltip>

            <Popover
              content={colorPickerContent}
              title="Color Settings"
              trigger="click"
              open={colorPopoverOpen}
              onOpenChange={setColorPopoverOpen}
              placement="bottomRight"
            >
              <Tooltip title="Color Settings">
                <Button
                  icon={<BgColorsOutlined />}
                  size="large"
                  shape="circle"
                  className="flex items-center justify-center"
                  style={{ width: '50px', height: '50px', fontSize: '24px', borderWidth: '2px' }}
                />
              </Tooltip>
            </Popover>

            <Tooltip title="Visualise Data">
              <Button
                icon={<LineChartOutlined />}
                onClick={() => setChartModalOpen(true)}
                disabled={isRunning}
                size="large"
                shape="circle"
                className="flex items-center justify-center"
                style={{ width: '50px', height: '50px', fontSize: '24px', borderWidth: '2px' }}
              />
            </Tooltip>

            <Tooltip title="Settings & Configuration">
              <Button
                icon={<SettingOutlined />}
                onClick={() => setConfigDrawerOpen(true)}
                size="large"
                shape="circle"
                className="flex items-center justify-center"
                style={{ width: '50px', height: '50px', fontSize: '24px', borderWidth: '2px' }}
              />
            </Tooltip>
          </div>

        </div>
      </div>

      <SettingsModal
        isVisible={configDrawerOpen}
        onClose={() => setConfigDrawerOpen(false)}
      />
      <ChartModal
        isVisible={chartModalOpen}
        onClose={() => setChartModalOpen(false)}
        getMetrics={getMetrics}
      />
    </div>
  );
};

SimulationControls.propTypes = {
  updateColor: PropTypes.func.isRequired,
  resetTheme: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    alive: PropTypes.string,
    dead: PropTypes.string,
    born: PropTypes.string,
    die: PropTypes.string,
  }).isRequired,
};

export default React.memo(SimulationControls);
