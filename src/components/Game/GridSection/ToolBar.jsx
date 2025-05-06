import { ReloadOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Button, Slider, Switch, Tooltip } from 'antd';
import React, { useState } from 'react';
import { FaRegHandPaper, FaRegHandPointer } from 'react-icons/fa';
import { useCanvasStore } from '../../../hooks/canvasStore';
import { useSimulationControls } from '../../../hooks/useSimulationControls';

const ToolBar = () => {
  const { activeTool, setActiveTool, zoomIn, zoomOut, resetView, zoom } = useCanvasStore();

  const {
    setShowGridChanges,
    interval,
    updateInterval,
    showChanges,
  } = useSimulationControls();

  const [intervalInput, setIntervalInput] = useState(interval || 100);

  const handleIntervalChange = (value) => {
    setIntervalInput(value);
    updateInterval(value);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-4">
      <div className="flex space-x-2">
        <Tooltip title="Selection Tool (Click to toggle cells)">
          <Button
            type={activeTool === 'mouse' ? 'primary' : 'default'}
            icon={<FaRegHandPointer />}
            onClick={() => setActiveTool('mouse')}
          />
        </Tooltip>
        <Tooltip title="Hand Tool (Pan the canvas)" className='mr-2'>
          <Button
            type={activeTool === 'hand' ? 'primary' : 'default'}
            icon={<FaRegHandPaper />}
            onClick={() => setActiveTool('hand')}
          />
        </Tooltip>
        <Tooltip title="Zoom Out">
          <Button
            icon={<ZoomOutOutlined />}
            onClick={zoomOut}
          />
        </Tooltip>
        <span className="flex items-center px-2 text-sm">{Math.round(zoom * 100)}%</span>
        <Tooltip title="Zoom In">
          <Button
            icon={<ZoomInOutlined />}
            onClick={zoomIn}
          />
        </Tooltip>
        <Tooltip title="Reset View">
          <Button
            icon={<ReloadOutlined />}
            onClick={resetView}
          />
        </Tooltip>

      </div>

      <div className="flex justify-end">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-700">Animation delay:</span>
            <Slider
              className="w-24 mb-0"
              min={5}
              max={1000}

              step={10}
              value={intervalInput}
              onChange={handleIntervalChange}
              tooltip={{ formatter: (value) => `${value}ms` }}
            />
          </div>
          <div>|</div>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-700">Next generation preview:</span>
            <Switch
              size="small"
              checked={showChanges}
              onChange={checked => setShowGridChanges(checked)}
              title="Highlight cells that will be born or die in the next generation"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
