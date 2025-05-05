import { Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const NavBar = () => (
  <div className="flex items-center w-full h-10 gap-2 md:h-16 md:gap-3">
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
