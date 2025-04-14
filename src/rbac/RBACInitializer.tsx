
import React, { useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from './bridge';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

/**
 * RBAC Initializer Component
 * 
 * Responsible for initializing RBAC based on auth state.
 * This component hydrates the RBAC system after login,
 * ensuring that roles and permissions are properly synchronized.
 */
export const RBACInitializer: React.FC = () => {
  const { isAuthenticated, user, roles } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    roles: state.roles
  }));
  
  const logger = useLogger('RBACInitializer', LogCategory.RBAC);
  
  // Initialize RBAC when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      if (roles && roles.length > 0) {
        // Set roles from auth store
        RBACBridge.setRoles(roles);
        logger.info('User roles set in RBAC from auth store', {
          details: { roles }
        });
      } else if (user?.app_metadata?.roles) {
        // Set roles from user metadata if available
        const metadataRoles = user.app_metadata.roles;
        RBACBridge.setRoles(metadataRoles);
        logger.info('User roles set in RBAC from user metadata', {
          details: { roles: metadataRoles }
        });
      } else {
        // Default to user role if no specific roles found
        RBACBridge.setRoles(['user']);
        logger.info('Default user role set in RBAC', {
          details: { roles: ['user'] }
        });
      }
    } else {
      // Clear roles when logged out
      RBACBridge.clearRoles();
      logger.info('RBAC roles cleared (not authenticated)');
    }
  }, [isAuthenticated, user, roles, logger]);
  
  // This is a utility component, no UI is rendered
  return null;
};
