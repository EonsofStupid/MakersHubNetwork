
import React, { useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const { initialize } = useAuthStore();
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);
  
  useEffect(() => {
    const initApp = async () => {
      try {
        logger.info('Initializing application');
        await initialize();
        logger.info('Application initialized successfully');
      } catch (error) {
        logger.error('Failed to initialize application', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    };
    
    initApp();
  }, [initialize, logger]);
  
  return <>{children}</>;
}
