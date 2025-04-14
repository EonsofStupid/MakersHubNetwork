
import { useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

/**
 * RBAC Initializer component
 * Responsible for initializing RBAC based on auth state
 */
export const RBACInitializer = () => {
  const { isAuthenticated } = useAuthStore(state => ({ isAuthenticated: state.isAuthenticated }));
  const roles = useAuthStore(state => state.roles);
  const logger = useLogger('RBACInitializer', LogCategory.RBAC);
  
  // Initialize RBAC when auth state changes
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
  
  // This is a utility component, no UI is rendered
  return null;
};
