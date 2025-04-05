
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { LoggingProvider } from './logging/context/LoggingContext';
import { AuthProvider } from './auth/components/AuthProvider';
import { Layout } from './components/ui/layout/Layout';
import { AppRoutes } from './routes/app-routes';

// Define App props interface
interface AppProps {
  onInitialized?: () => Promise<void>;
}

function App({ onInitialized }: AppProps) {
  return (
    <LoggingProvider>
      <AuthProvider onInitialized={onInitialized}>
        <ThemeProvider>
          <div className="min-h-screen bg-background">
            <Router>
              <Layout />
              <AppRoutes />
            </Router>
          </div>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </LoggingProvider>
  );
}

export default App;
