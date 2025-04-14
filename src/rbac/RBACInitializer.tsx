
import { useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from './bridge';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

/**
 * RBAC Initializer component
 * Responsible for initializing RBAC based on auth state and keeping it in sync
 */
export const RBACInitializer = () => {
  const { isAuthenticated, user, roles } = useAuthStore();
  const logger = useLogger('RBACInitializer', LogCategory.RBAC);
  
  // Initialize RBAC when auth state changes
  useEffect(() => {
    if (isAuthenticated && roles && roles.length > 0) {
      // Set roles in RBAC system
      RBACBridge.setRoles(roles);
      
      logger.info('User roles set in RBAC', {
        details: { 
          roles,
          userId: user?.id
        }
      });
    } else if (!isAuthenticated) {
      // Clear roles when logged out
      RBACBridge.clearRoles();
      
      logger.info('RBAC roles cleared due to logout or session expiration');
    }
  }, [isAuthenticated, roles, user, logger]);
  
  // Handle hydration when user profile is loaded
  useEffect(() => {
    if (isAuthenticated && user?.app_metadata?.roles) {
      const metadataRoles = user.app_metadata.roles;
      if (Array.isArray(metadataRoles) && metadataRoles.length > 0) {
        RBACBridge.setRoles(metadataRoles);
        
        logger.info('User roles hydrated from profile metadata', {
          details: { 
            roles: metadataRoles,
            userId: user.id
          }
        });
      }
    }
  }, [isAuthenticated, user, logger]);
  
  // This is a utility component, no UI is rendered
  return null;
};

export default RBACInitializer;
