import { Content } from 'antd/es/layout/layout';
import PropTypes from 'prop-types';
import React from 'react';
import GridSection from './GridSection';
import SimulationControls from './SimulationControls';

const Game = ({ setStabilizedModalOpen }) => (
  <Content className="p-3 md:p-6 lg:p-12 bg-gradient-to-b from-gray-50 to-gray-100">
    <SimulationControls />

    <div className="pb-4 overflow-auto">
      <GridSection />
    </div>
  </Content>
);

Game.propTypes = {
  setStabilizedModalOpen: PropTypes.func.isRequired,
};

export default Game;
