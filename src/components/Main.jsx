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
      <Header className="sticky top-0 z-10 flex items-center px-4 py-3 border-b border-blue-200 rounded shadow md:px-8 bg-gradient-to-r from-blue-50 via-white to-blue-100">
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
