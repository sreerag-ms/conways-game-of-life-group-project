import React from 'react';
import WebGLGrid from '../WebGLGrid';
import GridWrapper from '../wrappers/GridWrapper';
import Patterns from './Patterns';
import ToolBar from './ToolBar';

const GridSection = () => (
  <GridWrapper>
    <div className="flex flex-col items-center w-full md:flex-row md:items-start md:space-x-4">
      <div className="flex-grow mb-4 md:mb-0">
        <WebGLGrid />
      </div>
      <div className="w-full md:w-80">
        <Patterns />
        <ToolBar />
      </div>
    </div>
  </GridWrapper>
);

export default GridSection;
