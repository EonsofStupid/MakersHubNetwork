
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const { initialize, isAuthenticated, user, roles } = useAuthStore();
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);
  const [initComplete, setInitComplete] = useState(false);
  
  // Initialize auth on mount
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
        setInitComplete(true);
      }
    };
    
    initApp();
  }, [initialize, logger]);
  
  // Initialize RBAC when auth state changes
  useEffect(() => {
    if (isAuthenticated && roles && roles.length > 0) {
      // Set roles in RBAC system
      RBACBridge.setRoles(roles);
      logger.info('User roles set in RBAC', { details: { roles } });
    } else if (!isAuthenticated) {
      // Clear roles when logged out
      RBACBridge.clearRoles();
      logger.info('RBAC roles cleared');
    }
  }, [isAuthenticated, roles, logger]);
  
  if (!initComplete) {
    return <div className="flex items-center justify-center h-screen">Initializing...</div>;
  }
  
  return <>{children}</>;
}
