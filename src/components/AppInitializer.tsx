
import React, { useEffect, useState } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import CircuitBreaker from '@/utils/CircuitBreaker';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const [initialized, setInitialized] = useState(false);
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);

  useEffect(() => {
    // Initialize circuit breaker
    CircuitBreaker.init('AppInitializer', 5, 1000);
    
    // Check for infinite loops
    if (CircuitBreaker.count('AppInitializer')) {
      logger.warn('Breaking potential infinite loop in AppInitializer');
      return;
    }
    
    // Don't re-initialize
    if (initialized) return;
    
    // Do any initialization that needs to happen once
    logger.info('Initializing application');
    
    try {
      // Add any specific initialization logic here
      // This is a safe place for one-time setup that doesn't depend on auth state
      
      logger.info('Application initialization complete');
      setInitialized(true);
    } catch (error) {
      logger.error('Error during application initialization', {
        details: { error: error instanceof Error ? error.message : String(error) }
      });
    }
  }, [initialized, logger]);

  return <>{children}</>;
}
