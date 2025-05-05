import {
  ClearOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  StepForwardOutlined,
} from '@ant-design/icons';
import { Button, Card, message, Slider, Switch, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import SettingsModal from '../../modals/SettingsModal';

const SimulationControls = ({
  rows,
  cols,
  isRunning,
  onGenerate,
  onStart,
  onStop,
  onStep,
  onClear,
  onSaveConfig,
  onLoadConfig,
  setShowGridChanges,
  updateColor,
  resetTheme,
  theme,
  interval,
  onUpdateInterval,
}) => {
  const [rowInput, setRowInput] = useState(rows);
  const [colInput, setColInput] = useState(cols);
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
  const textAreaRef = useRef(null);
  const [configText, setConfigText] = useState('');
  const [intervalInput, setIntervalInput] = useState(interval || 100);

  // Color settings definitions
  const colorSettings = [
    { key: 'alive', label: 'Alive Cells', defaultColor: '#4682B4' },
    { key: 'dead', label: 'Dead Cells', defaultColor: '#ffffff' },
    { key: 'born', label: 'Born Cells (Will appear)', defaultColor: '#DAFFCB' },
    { key: 'die', label: 'Dying Cells (Will disappear)', defaultColor: '#f87171' },
  ];

  const handleGenerate = () => {
    if (rowInput < 5 || colInput < 5) {
      message.error('Grid dimensions should be at least 5x5');

      return;
    }

    onGenerate(rowInput, colInput);
  };

  const handleSaveConfig = () => {
    const config = onSaveConfig();
    setConfigText(config);
    setConfigDrawerOpen(true);
    message.success('Configuration saved to text area');
  };

  const handleLoadConfig = () => {
    const result = onLoadConfig(configText);
    if (result.success) {
      message.success('Configuration loaded successfully');
      setConfigDrawerOpen(false);
    } else {
      message.error(result.message);
    }
  };

  const handleIntervalChange = (value) => {
    setIntervalInput(value);
    onUpdateInterval(value);
  };

  return (
    <div className="w-full mb-6 md:pl-4">
      <Card title="Simulation Controls" className="w-full shadow-md">
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

          <div className="flex flex-col items-center justify-between w-full gap-8 px-10 md:flex-row md:w-1/2">
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

            <div className="flex items-center w-full">
              <span className="mr-2 text-sm text-gray-700">Show next generation preview:</span>
              <Switch
                size="small"
                onChange={checked => setShowGridChanges(checked)}
                title="Highlight cells that will be born or die in the next generation"
              />
            </div>
          </div>
        </div>
      </Card>
      <SettingsModal
        isVisible={configDrawerOpen}
        onClose={() => setConfigDrawerOpen(false)}
      />
    </div>
  );
};

export default React.memo(SimulationControls);
