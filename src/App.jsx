import { ConfigProvider } from 'antd';
import './App.css';
import Main from './components/Main';
import { ANTD_THEME } from './constants';

const App = () => (
  <ConfigProvider theme={ANTD_THEME}>
    <Main />
  </ConfigProvider>
);

export default App;
