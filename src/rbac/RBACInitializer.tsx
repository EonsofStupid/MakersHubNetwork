
import React, { useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from './bridge';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { UserRole } from './constants/roles';

/**
 * RBAC Initializer Component
 * 
 * Responsible for initializing RBAC based on auth state.
 * This component hydrates the RBAC system after login,
 * ensuring that roles and permissions are properly synchronized.
 */
export const RBACInitializer: React.FC = () => {
  const { isAuthenticated, user, roles } = useAuthStore();
  const logger = useLogger('RBACInitializer', LogCategory.RBAC);
  
  // Initialize RBAC when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      if (roles && roles.length > 0) {
        // Set roles from auth store
        RBACBridge.setRoles(roles as UserRole[]);
        logger.info('User roles set in RBAC from auth store', {
          details: { roles }
        });
      } else if (user?.app_metadata?.roles) {
        // Set roles from user metadata if available
        const metadataRoles = user.app_metadata.roles as UserRole[];
        RBACBridge.setRoles(metadataRoles);
        logger.info('User roles set in RBAC from user metadata', {
          details: { roles: metadataRoles }
        });
      } else {
        // Default to user role if no specific roles found
        RBACBridge.setRoles([UserRole.USER]);
        logger.info('Default user role set in RBAC', {
          details: { roles: [UserRole.USER] }
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
