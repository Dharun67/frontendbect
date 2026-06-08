import './App.css';
import AppRoutes from './routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useEffect } from 'react';
import { initializeDefaultData } from './utils/storage';
import { Toaster } from 'react-hot-toast';

function App() {
  useEffect(() => {
    initializeDefaultData();
  }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
