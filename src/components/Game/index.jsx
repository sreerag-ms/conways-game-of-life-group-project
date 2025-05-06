import { Content } from 'antd/es/layout/layout';
import PropTypes from 'prop-types';
import React from 'react';
import GridSection from './GridSection';

const Game = ({ setStabilizedModalOpen }) => (
  <Content className="p-3 md:p-6 lg:p-12">
    {/* <SimulationControls /> */}
    <div className="pb-4 overflow-auto">
      <GridSection setStabilizedModalOpen={setStabilizedModalOpen} />
    </div>
  </Content>
);

Game.propTypes = {
  setStabilizedModalOpen: PropTypes.func.isRequired,
};

export default Game;
