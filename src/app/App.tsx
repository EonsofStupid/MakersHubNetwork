
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainNav } from '@/app/components/MainNav';
import { Toaster } from '@/components/ui/toaster';
import { LoggingProvider } from '@/logging/context/LoggingContext';

// App-specific pages would be imported here
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import AboutPage from './pages/AboutPage';

// This ensures App module isolation while using shared services via bridges
const App: React.FC = () => {
  return (
    <LoggingProvider>
      <MainNav />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <Toaster />
    </LoggingProvider>
  );
};

export default App;
