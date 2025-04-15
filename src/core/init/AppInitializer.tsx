
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

interface AppInitializerProps {
  children: (state: { isInitializing: boolean }) => React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const { initialize, isAuthenticated, user, roles } = useAuthStore();
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);
  const [isInitializing, setIsInitializing] = useState(true);
  
  useEffect(() => {
    const initApp = async () => {
      try {
        logger.info('Initializing application');
        await initialize();
        logger.info('Auth initialized successfully');
      } catch (error) {
        logger.error('Failed to initialize auth', {
          error: error instanceof Error ? error.message : String(error)
        });
      } finally {
        setIsInitializing(false);
      }
    };
    
    initApp();
  }, [initialize, logger]);
  
  useEffect(() => {
    if (isAuthenticated && roles && roles.length > 0) {
      RBACBridge.setRoles(roles);
      logger.info('User roles set in RBAC', { details: { roles } });
    } else if (!isAuthenticated) {
      RBACBridge.clearRoles();
      logger.info('RBAC roles cleared');
    }
  }, [isAuthenticated, roles, logger]);
  
  return <>{children({ isInitializing })}</>;
}
