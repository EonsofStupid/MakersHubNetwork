
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
  const { loadTheme } = useThemeStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        logger.info('Initializing application...');

        // Load theme - this is a critical functionality
        if (loadTheme) {
          await loadTheme('app');
        }

        logger.info('Application initialized successfully');
        setIsInitialized(true);
      } catch (error) {
        logger.error('Failed to initialize application', {
          details: { error: error instanceof Error ? error.message : String(error) }
        });
        // Still mark as initialized to prevent blocking the UI
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [loadTheme, logger]);

  return <>{children}</>;
}
