import { ConfigProvider, Layout, Typography } from 'antd';
import { useEffect, useState } from 'react';
import './App.css';
import Controls from './components/Controls';
import Grid from './components/Grid';
import GridStabilizedModal from './components/modals/GridStabilizedModal';
import { useGameOfLife } from './hooks/useGameOfLife';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App = () => {
  const [stabilizedModalOpen, setStabilizedModalOpen] = useState(false);

  const {
    grid,
    rows,
    cols,
    isRunning,
    interval,
    createGrid,
    toggleCell,
    nextGeneration,
    startSimulation,
    stopSimulation,
    clearGrid,
    saveConfig,
    loadConfig,
    updateInterval,
  } = useGameOfLife({
    onStabilize: () => setStabilizedModalOpen(true),
  });

  useEffect(() => {
    createGrid(20, 20);
  }, [createGrid]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
        },
      }}
    >
      <Layout className="min-h-screen">
        <Header className="sticky top-0 z-10 flex items-center px-4 py-3 border-b border-blue-200 rounded shadow md:px-8 bg-gradient-to-r from-blue-50 via-white to-blue-100">
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
        </Header>
        <Content className="p-3 md:p-6 lg:p-12 bg-gradient-to-b from-gray-50 to-gray-100">
          {/* <div className="max-w-6xl mx-auto space-y-4 md:space-y-8"> */}
          {/* <div className="p-3 bg-white rounded-lg shadow-lg md:p-6"> */}
          <Controls
            rows={rows}
            cols={cols}
            isRunning={isRunning}
            interval={interval}
            onGenerate={createGrid}
            onStart={startSimulation}
            onStop={stopSimulation}
            onStep={nextGeneration}
            onClear={clearGrid}
            onSaveConfig={saveConfig}
            onLoadConfig={loadConfig}
            onUpdateInterval={updateInterval}
          />

          <div className="pb-4 overflow-auto">
            <Grid
              grid={grid}
              onCellClick={toggleCell}
              cellSize={Math.max(6, Math.min(15, 600 / Math.max(rows, cols)))}
            />
          </div>
          {/* </div> */}

          {/* </div> */}
          <GridStabilizedModal isOpen={stabilizedModalOpen} onClose={() => setStabilizedModalOpen(false)} />
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
