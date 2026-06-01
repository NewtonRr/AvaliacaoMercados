import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { ConfigProvider } from './store/configStore';

function App() {

  return (
    <BrowserRouter>
      <ConfigProvider>
        <AppRoutes />
      </ConfigProvider>
    </BrowserRouter>
  )
}

export default App
