
import React, { useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

/**
 * Bootstrap component that initializes the application
 */
export const AppBootstrap: React.FC = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const logger = useLogger('AppBootstrap', LogCategory.SYSTEM);

  // Initialize app on first render
  useEffect(() => {
    const bootstrapApp = async () => {
      try {
        logger.info('Bootstrapping application');
        await initialize();
        logger.info('Application bootstrap complete');
      } catch (error) {
        logger.error('Failed to bootstrap application', {
          details: { error }
        });
      }
    };
    
    bootstrapApp();
  }, [initialize, logger]);

  // This is an invisible component, it just runs initialization code
  return null;
};
