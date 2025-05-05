import {
  BgColorsOutlined,
  ClearOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  StepForwardOutlined,
  DownloadOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { Button, Card, ColorPicker, Popover, Slider, Switch, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import ChartModal from '../../modals/ChartModal';
import SettingsModal from '../../modals/SettingsModal';

const SimulationControls = ({
  isRunning,
  onStart,
  onStop,
  onStep,
  onClear,
  onExportData,
  setShowGridChanges,
  updateColor,
  resetTheme,
  theme,
  interval,
  onUpdateInterval,
  generation,
  metrics,
}) => {
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const [intervalInput, setIntervalInput] = useState(interval || 100);

  // Color settings definitions
  const colorSettings = [
    { key: 'alive', label: 'Alive Cells', defaultColor: '#4682B4' },
    { key: 'dead', label: 'Dead Cells', defaultColor: '#ffffff' },
    { key: 'born', label: 'Born Cells (Will appear)', defaultColor: '#DAFFCB' },
    { key: 'die', label: 'Dying Cells (Will disappear)', defaultColor: '#f87171' },
  ];

  const handleIntervalChange = (value) => {
    setIntervalInput(value);
    onUpdateInterval(value);
  };

  // Color picker popover content
  const colorPickerContent = (
    <div className="flex flex-col gap-4" style={{ width: '250px' }}>
      <p className="text-gray-600">
        Customize the colors used in the grid visualization.
      </p>
      <div className="flex flex-col gap-3">
        {colorSettings.map(({ key, label, defaultColor }) => (
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
    <div className="sticky top-0 z-50 w-full mb-6">
      <Card title="" className="w-full shadow-md">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex items-center justify-between w-full md:w-1/2">
            <Tooltip title="Start Simulation">
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={onStart}
                disabled={isRunning}
                size="large"
                shape="circle"
                className="flex items-center justify-center"
                style={{ width: '50px', height: '50px', fontSize: '24px' }}
              />
            </Tooltip>

            <Tooltip title="Stop Simulation">
              <Button
                danger
                icon={<PauseCircleOutlined />}
                onClick={onStop}
                disabled={!isRunning}
                size="large"
                shape="circle"
                className="flex items-center justify-center"
                style={{ width: '50px', height: '50px', fontSize: '24px' }}
              />
            </Tooltip>

            <Tooltip title="Next Generation">
              <Button
                icon={<StepForwardOutlined />}
                onClick={onStep}
                disabled={isRunning}
                size="large"
                shape="circle"
                className="flex items-center justify-center"
                style={{ width: '50px', height: '50px', fontSize: '24px' }}
              />
            </Tooltip>

            <Tooltip title="Clear Grid">
              <Button
                icon={<ClearOutlined />}
                onClick={onClear}
                size="large"
                shape="circle"
                className="flex items-center justify-center"
                style={{ width: '50px', height: '50px', fontSize: '24px' }}
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
                  style={{ width: '50px', height: '50px', fontSize: '24px' }}
                />
              </Tooltip>
            </Popover>

            <Tooltip title="Export Data">
              <Button
                icon={<DownloadOutlined />}
                onClick={onExportData}
                size="large"
                shape="circle"
                className="flex items-center justify-center"
                style={{ width: '50px', height: '50px', fontSize: '24px' }}
              />
            </Tooltip>

            <Tooltip title="Visualise Data">
              <Button
                icon={<LineChartOutlined />}
                onClick={() => setChartModalOpen(true)}
                size="large"
                shape="circle"
                className="flex items-center justify-center"
                style={{ width: '50px', height: '50px', fontSize: '24px' }}
              />
            </Tooltip>

            <Tooltip title="Settings & Configuration">
              <Button
                icon={<SettingOutlined />}
                onClick={() => setConfigDrawerOpen(true)}
                size="large"
                shape="circle"
                className="flex items-center justify-center"
                style={{ width: '50px', height: '50px', fontSize: '24px' }}
              />
            </Tooltip>
          </div>

          <div className="flex flex-col items-center justify-between w-full gap-10 px-10 md:flex-row md:w-1/2">
            <div className="w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Animation Speed:</span>
                <span className="text-sm text-gray-500">{intervalInput}ms</span>
              </div>
              <Slider
                min={5}
                max={1000}
                step={10}
                value={intervalInput}
                onChange={handleIntervalChange}
                tooltip={{ formatter: (value) => `${value}ms` }}
                marks={{
                  5: 'Fast',
                  500: 'Medium',
                  1000: 'Slow',
                }}
                className="mb-4"
              />
            </div>

            <div className="flex flex-col w-full gap-2">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-gray-700">Show next generation preview:</span>
                <Switch
                  size="small"
                  onChange={checked => setShowGridChanges(checked)}
                  title="Highlight cells that will be born or die in the next generation"
                />
              </div>

              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-gray-700">Generation:</span>
                <span className="text-sm font-semibold text-primary-500">{generation || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <SettingsModal
        isVisible={configDrawerOpen}
        onClose={() => setConfigDrawerOpen(false)}
      />
      <ChartModal
        isVisible={chartModalOpen}
        onClose={() => setChartModalOpen(false)}
        metrics={metrics}
      />
    </div>
  );
};

SimulationControls.propTypes = {
  isRunning: PropTypes.bool.isRequired,
  onStart: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onStep: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onExportData: PropTypes.func.isRequired,
  setShowGridChanges: PropTypes.func.isRequired,
  updateColor: PropTypes.func.isRequired,
  resetTheme: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    alive: PropTypes.string,
    dead: PropTypes.string,
    born: PropTypes.string,
    die: PropTypes.string,
  }).isRequired,
  interval: PropTypes.number.isRequired,
  onUpdateInterval: PropTypes.func.isRequired,
  generation: PropTypes.number.isRequired,
  metrics: PropTypes.arrayOf(PropTypes.shape({
    generation: PropTypes.number.isRequired,
    populationSize: PropTypes.number.isRequired,
    births: PropTypes.number.isRequired,
    deaths: PropTypes.number.isRequired,
  })).isRequired,
};

export default React.memo(SimulationControls);
