import { Layout } from 'antd';
import React, { useState } from 'react';
import Game from './Game';
import GridStabilizedModal from './modals/GridStabilizedModal';

const Main = () => {
  const [stabilizedModalOpen, setStabilizedModalOpen] = useState(false);

  return (
    <>
      {/* <Header className="top-0 flex items-center px-4 py-3 bg-white border-b border-gray-400 shadow-sm border-b-gray-200">
        <NavBar />
      </Header> */}
      <div className='flex justify-center w-full bg-white'>
        <Layout className="flex justify-center w-full min-h-screen">

          <div className='max-w-12xl'>
            <Game setStabilizedModalOpen={setStabilizedModalOpen} />
            <GridStabilizedModal isOpen={stabilizedModalOpen} onClose={() => setStabilizedModalOpen(false)} />
          </div>
        </Layout>
      </div>
    </>
  );
};

export default Main;
