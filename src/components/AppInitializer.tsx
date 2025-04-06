
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/theme/themeStore';
import { useAuth } from '@/hooks/useAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const { loadTheme, isLoading: themeLoading } = useThemeStore();
  const { isLoading: authLoading, initialize } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  const logger = useLogger('AppInitializer', LogCategory.APP);

  // Initialize core services
  useEffect(() => {
    const initApp = async () => {
      try {
        logger.info('Initializing application');

        // Always try to initialize auth first
        if (initialize) {
          await initialize();
        }

        // Then load the theme if available
        if (loadTheme) {
          await loadTheme('app');
        }

        logger.info('Application initialized successfully');
      } catch (error) {
        logger.error('Failed to initialize application', {
          details: { error: error instanceof Error ? error.message : String(error) }
        });
      } finally {
        setIsInitializing(false);
      }
    };

    initApp();
  }, [logger]);

  // Show a minimal loading indicator while critical services initialize
  if (isInitializing && (authLoading || themeLoading)) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
