
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getLogger } from '@/logging';
import { LoggingProvider } from '@/logging/context/LoggingContext';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ThemeInitializer } from '@/components/theme/ThemeInitializer';
import { ImpulsivityInit } from '@/components/theme/ImpulsivityInit';
import { SiteThemeProvider } from '@/components/theme/SiteThemeProvider';
import { AuthContext } from '@/hooks/use-auth';
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
  // User state - simple implementation that can be enhanced later
  const [user, setUser] = useState(null);

  // Initialize logging on app mount
  useEffect(() => {
    initLogging();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <LoggingProvider>
          <ThemeInitializer>
            <ImpulsivityInit>
              <SiteThemeProvider>
                <AuthContext.Provider value={{ user, setUser }}>
                  <AppInitializer>
                    <AdminProvider>
                      <AppRoutes />
                    </AdminProvider>
                  </AppInitializer>
                </AuthContext.Provider>
              </SiteThemeProvider>
            </ImpulsivityInit>
          </ThemeInitializer>
        </LoggingProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
