// nolonger used

import { Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const NavBar = () => (
  <div className="flex items-center justify-between w-full h-10 gap-2 px-6 md:h-10 md:gap-3">
    <Title
      level={3}
      className="m-0 text-sm font-semibold tracking-tight text-primary-500 sm:text-xl md:text-2xl"
      style={{ lineHeight: 1.1, marginBottom: 0 }}
    >
        Conway's Game of Life
    </Title>
    <div></div>
  </div>
);

export default NavBar;
