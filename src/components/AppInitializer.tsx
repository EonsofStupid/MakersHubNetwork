
import { useEffect, useState, useRef } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useThemeStore } from '@/stores/theme/themeStore';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationAttempted = useRef(false);
  const { loadStatus } = useThemeStore();

  useEffect(() => {
    // Only attempt initialization once
    if (initializationAttempted.current) {
      return;
    }

    const initializeApp = async () => {
      try {
        initializationAttempted.current = true;
        logger.info('Initializing application...');

        // Theme should already be initialized by ThemeInitializer
        // This is just a checkpoint

        logger.info('Application initialized successfully', {
          details: { themeLoaded: loadStatus === 'success' }
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

    initializeApp();
  }, [logger, loadStatus]);

  // Always render children - initialization happens in the background
  return <>{children}</>;
}
