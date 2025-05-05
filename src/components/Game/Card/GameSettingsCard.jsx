import { EditOutlined } from '@ant-design/icons';
import { Button, Card, Slider } from 'antd';
import React, { useState } from 'react';
import GameSettingsModal from './GameSettingsModal';

const GameSettingsCard = ({
  rows,
  cols,
  interval,
  isContinuous,
  onGenerate,
  onUpdateInterval,
  setContinuousGrid,
  onClear,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [intervalInput, setIntervalInput] = useState(interval);

  const handleIntervalChange = (value) => {
    setIntervalInput(value);
    onUpdateInterval(value);
  };

  return (
    <div className="mb-6">
      <Card
        title="Game Settings"
        extra={
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Edit
          </Button>
        }
        className="w-full md:w-1/2 shadow-md"
      >
        <div className="grid grid-cols-2 gap-y-2">
          <div className="font-medium text-left">Grid Size:</div>
          <div className="text-right">{rows} × {cols}</div>

          <div className="font-medium text-left">Grid Type:</div>
          <div className="text-right">
            {isContinuous ? 'Continuous (Edges wrap)' : 'Bounded (Fixed edges)'}
          </div>
        </div>

        {/* Speed slider - added directly to card */}
        <div className="mt-4">
          <div className="flex items-center mb-1">
            <span className="mr-2 text-sm font-medium text-gray-700">Speed:</span>
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
            className="mb-2"
          />
        </div>
      </Card>

      <GameSettingsModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        rows={rows}
        cols={cols}
        isContinuous={isContinuous}
        onGenerate={onGenerate}
        setContinuousGrid={setContinuousGrid}
        onClear={onClear}
      />
    </div>
  );
};

export default GameSettingsCard;
