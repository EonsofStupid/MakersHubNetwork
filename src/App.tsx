
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getLogger } from '@/logging';
import { LoggingProvider } from '@/logging/context/LoggingContext';
import { ThemeInitializer } from '@/components/theme/ThemeInitializer';
import { ImpulsivityInit } from '@/components/theme/ImpulsivityInit';
import { SiteThemeProvider } from '@/components/theme/SiteThemeProvider';
import { AuthProvider } from '@/auth/context/AuthContext';
import { AppInitializer } from '@/components/AppInitializer';
import { AdminProvider } from '@/admin/context/AdminContext';
import { AppRoutes } from '@/routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Initialize logging with better error handling
function initLogging() {
  try {
    const logger = getLogger();
    logger.info('App initializing');
    return true;
  } catch (error) {
    console.error('Failed to initialize logging:', error);
    return false;
  }
}

function App() {
  // Initialize logging on app mount
  useEffect(() => {
    initLogging();
  }, []);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <LoggingProvider>
            <ThemeInitializer>
              <ImpulsivityInit>
                <SiteThemeProvider>
                  <AuthProvider>
                    <AppInitializer>
                      <AdminProvider>
                        <AppRoutes />
                      </AdminProvider>
                    </AppInitializer>
                  </AuthProvider>
                </SiteThemeProvider>
              </ImpulsivityInit>
            </ThemeInitializer>
          </LoggingProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
