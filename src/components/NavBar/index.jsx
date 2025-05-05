import { Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const NavBar = () => (
  <div className="flex items-center w-full gap-2 md:gap-3">
    <span className="inline-flex items-center justify-center p-1 bg-blue-100 rounded-full shadow-sm md:p-2">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="md:w-8 md:h-8">
        <rect x="6" y="6" width="20" height="20" rx="6" fill="#1677ff" opacity="0.15"/>
        <rect x="10" y="10" width="12" height="12" rx="3" fill="#1677ff" opacity="0.3"/>
        <rect x="14" y="14" width="4" height="4" rx="1" fill="#1677ff"/>
      </svg>
    </span>
    <Title
      level={3}
      className="m-0 text-sm font-semibold tracking-tight text-blue-900 sm:text-xl md:text-2xl"
      style={{ lineHeight: 1.1, marginBottom: 0 }}
    >
        Conway's Game of Life
    </Title>
  </div>
);

export default NavBar;
