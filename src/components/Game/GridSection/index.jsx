import React from 'react';
import WebGLGrid from '../WebGLGrid';
import GridWrapper from '../wrappers/GridWrapper';
import Patterns from './Patterns';
import ToolBar from './ToolBar';

const GridSection = () => (
  <GridWrapper>
    <div className="flex flex-col items-center w-full md:flex-row md:items-start md:space-x-4">
      <div className="flex-grow mb-4 overflow-auto md:mb-0">
        <WebGLGrid />
      </div>
      <div className="flex flex-col w-full gap-4 md:w-80">
        <ToolBar />
        <Patterns />
      </div>
    </div>
  </GridWrapper>
);

export default GridSection;
