import { AimOutlined, DragOutlined, ReloadOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Button, Card, Tooltip } from 'antd';
import React from 'react';
import { useCanvasStore } from '../../../hooks/canvasStore';

const ToolBar = () => {
  const { activeTool, setActiveTool, zoomIn, zoomOut, resetView, zoom } = useCanvasStore();

  return (
    <Card className='w-full shadow-md'>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex space-x-2">
          <Tooltip title="Selection Tool (Click to toggle cells)">
            <Button
              type={activeTool === 'mouse' ? 'primary' : 'default'}
              icon={<AimOutlined />}
              onClick={() => setActiveTool('mouse')}
            />
          </Tooltip>
          <Tooltip title="Hand Tool (Pan the canvas)">
            <Button
              type={activeTool === 'hand' ? 'primary' : 'default'}
              icon={<DragOutlined />}
              onClick={() => setActiveTool('hand')}
            />
          </Tooltip>
        </div>

        <div className="flex items-center space-x-2">
          <Tooltip title="Zoom Out">
            <Button
              icon={<ZoomOutOutlined />}
              onClick={zoomOut}
            />
          </Tooltip>
          <span className="px-2 text-sm">{Math.round(zoom * 100)}%</span>
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
      </div>
    </Card>
  );
};

export default ToolBar;
