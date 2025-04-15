
import React, { useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { initialize, isAuthenticated } = useAuthStore();
  const { roles } = useAuthStore(state => ({ roles: state.roles }));
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);
  
  // Initialize auth on mount
  useEffect(() => {
    const initApp = async () => {
      logger.info('Initializing application');
      
      try {
        // Load auth state
        await initialize();
        
        logger.info('Auth initialized', {
          details: { 
            isAuthenticated: useAuthStore.getState().isAuthenticated,
            status: useAuthStore.getState().status
          }
        });
      } catch (error) {
        logger.error('Failed to initialize application', {
          details: { error }
        });
      }
    };
    
    initApp();
  }, [initialize, logger]);
  
  // Update RBAC when auth state changes
  useEffect(() => {
    if (isAuthenticated && roles && roles.length > 0) {
      // Set roles in RBAC system
      RBACBridge.setRoles(roles);
      
      logger.info('User roles set in RBAC', {
        details: { roles }
      });
    } else if (!isAuthenticated) {
      // Clear roles when logged out
      RBACBridge.clearRoles();
      
      logger.info('RBAC roles cleared');
    }
  }, [isAuthenticated, roles, logger]);
  
  return <>{children}</>;
};
