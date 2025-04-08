
import { useEffect, useState, useRef, useMemo } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useThemeStore } from '@/stores/theme/store';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationAttempted = useRef(false);
  
  // Use stable selector to prevent re-renders
  const loadStatus = useThemeStore(
    useMemo(() => (state) => state.loadStatus, [])
  );

  useEffect(() => {
    // Only attempt initialization once
    if (initializationAttempted.current) {
      return;
    }

    const initializeApp = async () => {
      try {
        initializationAttempted.current = true;
        logger.info('Initializing application...');

        // Just a small delay to ensure other systems have settled
        setTimeout(() => {
          logger.info('Application initialized successfully', {
            details: { themeLoaded: loadStatus === 'success' }
          });
          setIsInitialized(true);
        }, 50);
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
