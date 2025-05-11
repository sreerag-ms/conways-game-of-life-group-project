import { ConfigProvider } from 'antd';
import { useEffect, useState } from 'react';
import './App.css';
import Main from './components/Main';
import ErrorBoundary from './components/ErrorBoundary';
import { ANTD_THEME } from './constants';

const App = () => {
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setIsWebGLSupported(false);
    }

  }, []);

  if (!isWebGLSupported) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="mb-4 -mt-20 text-4xl text-gray-500 animate-spin">⚙️</div>
        <h3 className="text-2xl font-semibold">
          Uh oh! Your browser does not support WebGL.
        </h3>
        <p >We're working on making it compatible with your device.</p>
        <p className='text-sm'>
          Please check out our prototype version:{' '}  <br/>
          <a
            href="https://v1.gameoflife.site"
            className="text-blue-500 underline"
          >
            https://v1.gameoflife.site
          </a>
        </p>
      </div>
    );
  }

  return (
    <ConfigProvider theme={ANTD_THEME}>
      <ErrorBoundary>
        <Main />
      </ErrorBoundary>
    </ConfigProvider>
  );
};

export default App;
