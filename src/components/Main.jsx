import { Layout } from 'antd';
import React, { useState } from 'react';
import Game from './Game';
import GridStabilizedModal from './modals/GridStabilizedModal';

const Main = () => {
  const [stabilizedModalOpen, setStabilizedModalOpen] = useState(false);

  return (
    <>
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
