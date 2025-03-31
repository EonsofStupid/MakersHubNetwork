
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth/store';
import { useAdminStore } from '@/admin/store/admin.store';
import { AdminPermissionValue, AdminPermissions } from '@/admin/constants/permissions';

/**
 * Maps user roles to admin permissions
 * This hook bridges the auth store with the admin store
 */
export function useAdminRoles() {
  const { user, roles, status } = useAuthStore();
  const { loadPermissions } = useAdminStore();
  
  useEffect(() => {
    // Only load permissions when user is authenticated and roles are loaded
    if (status === 'authenticated' && roles && roles.length > 0) {
      const permissions = mapRolesToPermissions(roles);
      loadPermissions(permissions);
    }
  }, [status, roles, loadPermissions]);
  
  /**
   * Maps user roles to a set of admin permissions
   * @param userRoles Array of user roles from auth store
   * @returns Array of admin permissions
   */
  const mapRolesToPermissions = (userRoles: string[]): AdminPermissionValue[] => {
    let allPermissions: AdminPermissionValue[] = [];
    
    userRoles.forEach(role => {
      switch (role) {
        case 'super_admin':
          allPermissions.push(AdminPermissions.SUPER_ADMIN);
          break;
        case 'admin':
          allPermissions = [
            ...allPermissions,
            AdminPermissions.ADMIN_ACCESS,
            AdminPermissions.ADMIN_VIEW,
            AdminPermissions.ADMIN_EDIT,
            AdminPermissions.CONTENT_VIEW,
            AdminPermissions.CONTENT_EDIT,
            AdminPermissions.USERS_VIEW,
            AdminPermissions.BUILDS_VIEW,
            AdminPermissions.BUILDS_APPROVE,
            AdminPermissions.THEMES_VIEW
          ];
          break;
        // You can add more role mappings here if needed
      }
    });
    
    return allPermissions;
  };
  
  return {
    isAdmin: Boolean(roles?.includes('admin') || roles?.includes('super_admin')),
    isSuperAdmin: Boolean(roles?.includes('super_admin')),
    mapRolesToPermissions
  };
}
