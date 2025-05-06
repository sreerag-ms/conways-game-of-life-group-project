import React from 'react';
import WebGLGrid from '../WebGLGrid';
import GridWrapper from '../wrappers/GridWrapper';
import Patterns from './Patterns';
import ToolBar from './ToolBar';

const GridSection = () => (
  <GridWrapper>
    <div className="flex flex-col items-center w-full lg:flex-row md:items-start md:space-x-4">
      <div className="flex flex-col items-center mb-4 md:mb-0 md:flex-grow">
        <div className="flex justify-center w-full">
          <WebGLGrid />
        </div>
        <div className="w-full mt-2">
          <ToolBar />
        </div>
      </div>
      <div className="flex flex-col w-full gap-4 md:w-80">
        <Patterns />
      </div>
    </div>
  </GridWrapper>
);

export default GridSection;
