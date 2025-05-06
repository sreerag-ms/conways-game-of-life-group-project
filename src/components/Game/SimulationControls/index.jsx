import Title from 'antd/es/typography/Title';
import React from 'react';
import AnimationControls from './AnimationControls';
import Controls from './Controls';

const SimulationControls = () => (
  <div className="z-50 mb-12">
    <div title="" className="flex items-center p-5 border border-gray-200 shadow-lg ray-200 rounded-2xl">
      <Title
        level={3}
        className="w-1/3 m-0 text-sm font-semibold tracking-tight text-start text-primary-500 sm:text-xl md:text-xl"
        style={{ lineHeight: 1.1, marginBottom: 0 }}
      >
        Conway's Game of Life
      </Title>
      <div className="flex items-center justify-end w-full">

        <Controls/>
        <AnimationControls/>
      </div>
    </div>
  </div>
);

export default SimulationControls;
