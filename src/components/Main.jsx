import { Layout } from 'antd';
import React, { useState } from 'react';
import Game from './Game';
import NavBar from './NavBar';
import GridStabilizedModal from './modals/GridStabilizedModal';

const { Header, Content, Footer } = Layout;

const Main = () => {
  const [stabilizedModalOpen, setStabilizedModalOpen] = useState(false);

  return (
    <>
      <Header className="top-0 z-10 flex items-center px-4 py-3 bg-white shadow-sm border-b-gray-200">
        <NavBar />
      </Header>
      <Layout className="min-h-screen">
        <Game setStabilizedModalOpen={setStabilizedModalOpen} />
        <GridStabilizedModal isOpen={stabilizedModalOpen} onClose={() => setStabilizedModalOpen(false)} />
      </Layout>
    </>
  );
};

export default Main;
