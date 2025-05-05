import {
  BgColorsOutlined,
  ClearOutlined,
  EyeOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  SaveOutlined,
  SettingOutlined,
  StepForwardOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, ColorPicker, Drawer, Input, InputNumber, message, Space, Switch, Tabs } from 'antd';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';

const Controls = ({
  rows,
  cols,
  isRunning,
  interval,
  visualizationState,
  previewEnabled,
  colors,
  onGenerate,
  onStart,
  onStop,
  onStep,
  onClear,
  onSaveConfig,
  onLoadConfig,
  onUpdateInterval,
  onPreviewNext,
  onTogglePreview,
  onUpdateColors,
}) => {
  const [rowInput, setRowInput] = useState(rows);
  const [colInput, setColInput] = useState(cols);
  const [intervalInput, setIntervalInput] = useState(interval);
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
  const textAreaRef = useRef(null);
  const [configText, setConfigText] = useState('');

  const handleGenerate = () => {
    if (rowInput < 5 || colInput < 5) {
      message.error('Grid dimensions should be at least 5x5');

      return;
    }
    if (rowInput > 100 || colInput > 150) {
      message.error('Grid dimensions should not exceed 100x100');

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

  const colorSettings = [
    { key: 'alive', label: 'Living Cells', defaultColor: '#9ca3af' },
    { key: 'dead', label: 'Dead Cells', defaultColor: '#ffffff' },
    { key: 'born', label: 'Born Cells', defaultColor: '#60a5fa' },
    { key: 'die', label: 'Dying Cells', defaultColor: '#f87171' },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-4 mb-4 md:flex-row">
        <Space className="flex flex-wrap justify-center w-full md:justify-start" size={[8, 12]}>
          <InputNumber
            min={5}
            max={1000}
            value={rowInput}
            onChange={setRowInput}
            addonBefore="Rows"
            className="w-full min-[400px]:w-auto"
            size={window.innerWidth < 640 ? 'small' : 'middle'}
          />
          <InputNumber
            min={5}
            max={1000}
            value={colInput}
            onChange={setColInput}
            addonBefore="Cols"
            className="w-full min-[400px]:w-auto"
            size={window.innerWidth < 640 ? 'small' : 'middle'}
          />
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleGenerate}
            className="w-full min-[400px]:w-auto"
          >
            Generate Grid
          </Button>
        </Space>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 sm:flex sm:flex-wrap sm:gap-4">
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={onStart}
          disabled={isRunning}
          className="w-full sm:w-auto"
          size={window.innerWidth < 640 ? 'small' : 'middle'}
        >
          Start
        </Button>
        <Button
          danger
          icon={<PauseCircleOutlined />}
          onClick={onStop}
          disabled={!isRunning}
          className="w-full sm:w-auto"
          size={window.innerWidth < 640 ? 'small' : 'middle'}
        >
          Stop
        </Button>
        <Button
          icon={<StepForwardOutlined />}
          onClick={onStep}
          disabled={isRunning}
          className="w-full sm:w-auto"
          size={window.innerWidth < 640 ? 'small' : 'middle'}
        >
          Next
        </Button>
        <Button
          icon={<EyeOutlined />}
          onClick={onPreviewNext}
          disabled={isRunning}
          className={`w-full sm:w-auto ${visualizationState === 'preview' ? 'ant-btn-primary' : ''}`}
          size={window.innerWidth < 640 ? 'small' : 'middle'}
        >
          Preview
        </Button>
        <Button
          icon={<ClearOutlined />}
          onClick={onClear}
          className="w-full sm:w-auto"
          size={window.innerWidth < 640 ? 'small' : 'middle'}
        >
          Clear
        </Button>
        <Button
          icon={<SettingOutlined />}
          onClick={() => setConfigDrawerOpen(true)}
          className="w-full col-span-2 sm:w-auto sm:col-span-1"
          size={window.innerWidth < 640 ? 'small' : 'middle'}
        >
          Config
        </Button>

        <div className="flex items-center gap-4 w-full col-span-2 mt-2 sm:mt-0 sm:w-auto">
          <div className="flex items-center gap-2">
            <Switch
              size="small"
              checked={previewEnabled}
              onChange={onTogglePreview}
            />
            <span className="text-sm text-gray-600">Preview</span>
          </div>
          <InputNumber
            addonBefore="Speed"
            min={10}
            max={2000}
            step={10}
            value={intervalInput}
            onChange={(val) => {
              setIntervalInput(val);
              onUpdateInterval(val);
            }}
            className="w-full"
            size={window.innerWidth < 640 ? 'small' : 'middle'}
          />
        </div>
      </div>

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
                          value={colors[key] || defaultColor}
                          onChange={(color) => onUpdateColors({ [key]: color.toHexString() })}
                          format="hex"
                          presets={[
                            {
                              label: 'Recommended',
                              colors: ['#9ca3af', '#ffffff', '#60a5fa', '#f87171'],
                            },
                          ]}
                        />
                        <span className="text-sm text-gray-600">{label}</span>
                      </div>
                    ))}
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

Controls.propTypes = {
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
  isRunning: PropTypes.bool.isRequired,
  interval: PropTypes.number.isRequired,
  visualizationState: PropTypes.oneOf(['current', 'preview', 'next']).isRequired,
  previewEnabled: PropTypes.bool.isRequired,
  colors: PropTypes.shape({
    alive: PropTypes.string,
    dead: PropTypes.string,
    born: PropTypes.string,
    die: PropTypes.string,
  }).isRequired,
  onGenerate: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onStep: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onSaveConfig: PropTypes.func.isRequired,
  onLoadConfig: PropTypes.func.isRequired,
  onUpdateInterval: PropTypes.func.isRequired,
  onPreviewNext: PropTypes.func.isRequired,
  onTogglePreview: PropTypes.func.isRequired,
  onUpdateColors: PropTypes.func.isRequired,
};

export default Controls;
