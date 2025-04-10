
import { useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useAdminStore } from '@/admin/store/admin.store';
import { AdminPermissionValue, ADMIN_PERMISSIONS } from '@/admin/constants/permissions';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { ROLES } from '@/auth/types/roles';

/**
 * Maps user roles to admin permissions
 * This hook bridges the auth store with the admin store
 */
export function useAdminRoles() {
  const { user, roles, status } = useAuthStore();
  const { loadPermissions, permissions } = useAdminStore();
  const logger = useLogger('useAdminRoles', LogCategory.ADMIN);
  
  useEffect(() => {
    // Only load permissions when user is authenticated and roles are loaded
    if (status === 'authenticated' && roles && roles.length > 0) {
      logger.info('Loading admin permissions for user roles', {
        details: { 
          userId: user?.id,
          roles 
        }
      });
      
      loadPermissions().catch(error => {
        logger.error('Error loading admin permissions', {
          details: { error }
        });
      });
    }
  }, [status, roles, loadPermissions, user, logger]);
  
  return {
    isAdmin: Boolean(roles?.includes(ROLES.ADMIN) || roles?.includes(ROLES.SUPER_ADMIN)),
    isSuperAdmin: Boolean(roles?.includes(ROLES.SUPER_ADMIN)),
    permissions
  };
}
