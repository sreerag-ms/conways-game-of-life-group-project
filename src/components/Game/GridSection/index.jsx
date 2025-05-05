import React from 'react';
import WebGLGrid from '../WebGLGrid';
import GridWrapper from '../wrappers/GridWrapper';
import Patterns from './Patterns';
import ToolBar from './ToolBar';

const GridSection = () => (
  <GridWrapper>
    <div className="flex flex-col items-center w-full md:flex-row md:items-start md:space-x-4">
      <div className="flex flex-col flex-grow mb-4 overflow-auto md:w-4/5 md:mb-0">
        <div className="mb-2">
          <ToolBar />
        </div>
        <WebGLGrid />
      </div>
      <div className="flex flex-col w-full gap-4 md:w-80">
        <Patterns />
      </div>
    </div>
  </GridWrapper>
);

export default GridSection;
