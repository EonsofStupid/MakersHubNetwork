
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getLogger } from '@/logging';
import { LoggingProvider } from '@/logging/context/LoggingContext';
import { ThemeProvider } from '@/components/ui/theme-provider';
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
    <QueryClientProvider client={queryClient}>
      <LoggingProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          {/* Apply immediate basic styling to ensure visual consistency */}
          <ImpulsivityInit>
            {/* Theme initialization before auth to ensure theme is available for all routes */}
            <ThemeInitializer defaultTheme="Impulsivity">
              <SiteThemeProvider>
                {/* Auth wrapped around routes but after theme initialization */}
                <AuthProvider>
                  <AppInitializer>
                    <AdminProvider>
                      <AppRoutes />
                    </AdminProvider>
                  </AppInitializer>
                </AuthProvider>
              </SiteThemeProvider>
            </ThemeInitializer>
          </ImpulsivityInit>
        </ThemeProvider>
      </LoggingProvider>
    </QueryClientProvider>
  );
}

export default App;
