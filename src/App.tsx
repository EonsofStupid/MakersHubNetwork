
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { LoggingProvider } from './logging/context/LoggingContext';
import { useToast } from './hooks/use-toast';
import { AuthProvider } from './auth/components/AuthProvider';
import { Layout } from './components/ui/layout/Layout';
import { AppRoutes } from './routes/app-routes';

// Define App props interface
interface AppProps {
  onInitialized?: () => Promise<void>;
}

function App({ onInitialized }: AppProps) {
  const { toast } = useToast();

  // Log application initialization
  useEffect(() => {
    // Notify user that the application has loaded
    toast({
      title: 'Welcome to MakersImpulse',
      description: 'Your 3D printing community hub',
    });
    
    // Call the onInitialized callback if provided
    if (onInitialized) {
      onInitialized();
    }
  }, [toast, onInitialized]);

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
