import { ConfigProvider, Layout, Typography } from 'antd';
import './App.css';
import Main from './components/Main';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App = () => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#1677ff',
      },
    }}
  >
    <Main />
  </ConfigProvider>
);

export default App;
