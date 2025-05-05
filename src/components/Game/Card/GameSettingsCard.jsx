import { EditOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import React, { useState } from 'react';
import { useGameOfLife } from '../../../hooks/useGameOfLife';
import SettingsModal from '../../modals/SettingsModal';

const GameSettingsCard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { rows, cols, isContinuous } = useGameOfLife();

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

      <SettingsModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default GameSettingsCard;
