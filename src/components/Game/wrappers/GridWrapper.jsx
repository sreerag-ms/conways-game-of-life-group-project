import React from 'react';

const GridWrapper = ({ children }) => (
  <div
    className='flex flex-col items-center justify-center w-full h-full md:flex-row'
  >{children}</div>
);

export default GridWrapper;
