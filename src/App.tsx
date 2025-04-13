
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import { Toaster } from '@/shared/ui/toaster';
import { LogCategory } from '@/shared/types/shared.types';
import { useLogger } from '@/hooks/use-logger';

function App() {
  const logger = useLogger('App', LogCategory.APP);
  
  React.useEffect(() => {
    logger.info('App initialized');
  }, [logger]);
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
