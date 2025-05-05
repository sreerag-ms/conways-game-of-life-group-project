import { EditOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
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
  setShowGridChanges,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [intervalInput, setIntervalInput] = useState(interval);

  const handleIntervalChange = (value) => {
    setIntervalInput(value);
    onUpdateInterval(value);
  };

  return (
    <div className="w-full mb-6 md:w-1/2">
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
        className="w-full shadow-md"
      >
        <div className="grid grid-cols-2 gap-y-2">
          <div className="font-medium text-left">Grid Size:</div>
          <div className="text-right">{rows} × {cols}</div>

          <div className="font-medium text-left">Grid Type:</div>
          <div className="text-right">
            {isContinuous ? 'Continuous (Edges wrap)' : 'Bounded (Fixed edges)'}
          </div>
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
