
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getLogger } from '@/logging';
import { LoggingProvider } from '@/logging/context/LoggingContext';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ThemeInitializer } from '@/components/theme/ThemeInitializer';
import { ImpulsivityInit } from '@/components/theme/ImpulsivityInit';
import { SiteThemeProvider } from '@/components/theme/SiteThemeProvider';
import { AuthProvider } from '@/auth/context/AuthContext';
import { AppRoutes } from '@/routes/AppRoutes';
import { AdminProvider } from '@/admin/context/AdminContext';

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
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <LoggingProvider>
          {/* Theme is loaded first and independently of auth */}
          <ThemeInitializer>
            <ImpulsivityInit>
              <SiteThemeProvider>
                {/* Auth provider is separate from theme, so theme works without auth */}
                <AuthProvider>
                  {/* Admin provider only affects admin routes */}
                  <AdminProvider>
                    <AppRoutes />
                  </AdminProvider>
                </AuthProvider>
              </SiteThemeProvider>
            </ImpulsivityInit>
          </ThemeInitializer>
        </LoggingProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
