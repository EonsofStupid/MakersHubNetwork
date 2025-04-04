
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { DashboardLayout } from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import { Toaster } from '@/components/ui/toaster';
import { LoggingProvider } from './logging/context/LoggingContext';
import { useToast } from './hooks/use-toast';
import { AuthProvider } from './auth/components/AuthProvider';

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
  }, [toast]);

  return (
    <LoggingProvider>
      <AuthProvider onInitialized={onInitialized}>
        <ThemeProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
              </Route>
            </Routes>
          </div>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </LoggingProvider>
  );
}

export default App;
