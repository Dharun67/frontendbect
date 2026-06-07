import './App.css';
import AppRoutes from './routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useEffect } from 'react';
import { initializeDefaultData } from './utils/storage';

function App() {
  useEffect(() => {
    initializeDefaultData();
  }, []);

  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
