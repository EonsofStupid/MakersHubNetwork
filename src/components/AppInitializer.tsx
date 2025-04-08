import React, { useEffect, useRef } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import CircuitBreaker from '@/utils/CircuitBreaker';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);
  const initializedRef = useRef(false);

  useEffect(() => {
    CircuitBreaker.init('AppInitializer', 5, 1000);

    if (CircuitBreaker.count('AppInitializer')) {
      logger.warn('Breaking potential infinite loop in AppInitializer');
      return;
    }

    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      logger.info('Initializing application');
      // Add any one-time startup logic here
      logger.info('Application initialization complete');
    } catch (error) {
      logger.error('Error during application initialization', {
        details: { error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, []);

  return <>{children}</>;
}
