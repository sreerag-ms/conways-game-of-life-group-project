import { Slider, Switch } from 'antd';
import React, { useState } from 'react';
import { useSimulationControls } from '../../../hooks/useSimulationControls';

const AnimationControls = () => {

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
    <div>
      <div className="flex items-center space-x-4 ">
        <div className="flex items-center px-2 py-1 rounded-md h-9 secondary-bg">
          <span className="mr-2 text-sm primary-text">Animation delay:</span>
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
        <div className="flex items-center px-2 py-1 rounded-md h-9 secondary-bg">
          <span className="mr-2 text-sm primary-text">Next generation preview:</span>
          <Switch
            size="small"
            checked={showChanges}
            onChange={checked => setShowGridChanges(checked)}
            title="Highlight cells that will be born or die in the next generation"
          />
        </div>
      </div></div>
  );
};

export default AnimationControls;
