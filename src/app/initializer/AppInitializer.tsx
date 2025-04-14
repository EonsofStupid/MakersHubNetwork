
import React, { useEffect } from 'react';
import { RBACInitializer } from '@/rbac';
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { initialize } = useAuthStore();
  const logger = useLogger('AppInitializer', LogCategory.APP);

  useEffect(() => {
    const initApp = async () => {
      try {
        logger.info('Initializing application');
        await initialize();
        logger.info('Auth initialization complete');
      } catch (error) {
        logger.error('Failed to initialize application', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    };

    initApp();
  }, [initialize, logger]);

  return (
    <>
      <RBACInitializer />
      {children}
    </>
  );
};

export default AppInitializer;
