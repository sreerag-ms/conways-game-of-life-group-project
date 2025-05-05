import {
  BgColorsOutlined,
  ClearOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SaveOutlined,
  SettingOutlined,
  StepForwardOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Card, ColorPicker, Drawer, Input, message, Slider, Switch, Tabs, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';

const Controls = ({
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
    <div className="w-full mb-6 md:w-1/2 md:pl-4">
      <Card title="Game Controls" className="w-full shadow-md">
        {/* Row of large icon-only buttons with tooltips */}
        <div className="flex justify-between mb-6">
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

          <Tooltip title="One Step Forward">
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

          <Tooltip title="Configuration">
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

        {/* Animation speed slider */}
        <div className="pt-4 mt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Animation Speed:</span>
            <span className="text-sm text-gray-500">{intervalInput}ms</span>
          </div>
          <Slider
            min={5}
            max={2000}
            step={10}
            value={intervalInput}
            onChange={handleIntervalChange}
            tooltip={{ formatter: (value) => `${value}ms` }}
            marks={{
              5: 'Fast',
              1000: 'Medium',
              2000: 'Slow',
            }}
            className="mb-4"
          />
        </div>

        {/* Show cell changes toggle */}
        <div className="flex items-center pt-4 mt-4 border-t border-gray-200">
          <span className="mr-2 text-sm text-gray-700">Show Cell Changes:</span>
          <Switch
            size="small"
            onChange={checked => setShowGridChanges(checked)}
            title="Highlight cells that will be born or die in the next generation"
          />
          <span className="ml-2 text-xs text-gray-500">(Preview next generation)</span>
        </div>
      </Card>

      <Drawer
        title="Grid Configuration"
        placement={window.innerWidth < 768 ? 'bottom' : 'right'}
        onClose={() => setConfigDrawerOpen(false)}
        open={configDrawerOpen}
        width={window.innerWidth < 768 ? '100%' : 400}
        height={window.innerWidth < 768 ? '80%' : undefined}
      >
        <Tabs
          items={[
            {
              key: 'pattern',
              label: 'Pattern',
              children: (
                <div className="flex flex-col gap-4">
                  <p className="text-gray-600">
                    Use 0's and 1's to define your pattern. Each row must match the grid width.
                  </p>
                  <Input.TextArea
                    ref={textAreaRef}
                    value={configText}
                    onChange={(e) => setConfigText(e.target.value)}
                    rows={12}
                    placeholder="Initial configuration: use 0/1 rows"
                    className="font-mono"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      icon={<SaveOutlined />}
                      onClick={handleSaveConfig}
                    >
                      Save Current Grid
                    </Button>
                    <Button
                      type="primary"
                      icon={<UploadOutlined />}
                      onClick={handleLoadConfig}
                    >
                      Load Configuration
                    </Button>
                  </div>
                </div>
              ),
            },
            {
              key: 'colors',
              label: 'Colors',
              icon: <BgColorsOutlined />,
              children: (
                <div className="flex flex-col gap-4">
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
              ),
            },
          ]}
        />
      </Drawer>
    </div>
  );
};

export default React.memo(Controls);
