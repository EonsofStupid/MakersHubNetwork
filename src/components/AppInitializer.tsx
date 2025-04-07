
import { useEffect, useState } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useThemeStore } from '@/stores/theme/themeStore';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);
  const [isInitialized, setIsInitialized] = useState(false);
  const { loadTheme, loadStatus } = useThemeStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        logger.info('Initializing application...');

        // Load theme - this is a critical functionality
        if (loadTheme) {
          await loadTheme('app').catch(err => {
            logger.error('Error loading theme, continuing with fallbacks', {
              details: { error: err instanceof Error ? err.message : String(err) }
            });
          });
        }

        logger.info('Application initialized successfully', {
          details: { themeLoaded: loadStatus === 'loaded' }
        });
        setIsInitialized(true);
      } catch (error) {
        logger.error('Failed to initialize application', {
          details: { error: error instanceof Error ? error.message : String(error) }
        });
        // Still mark as initialized to prevent blocking the UI
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initializeApp();
    }
  }, [loadTheme, logger, isInitialized, loadStatus]);

  // Always render children - initialization happens in the background
  return <>{children}</>;
}
