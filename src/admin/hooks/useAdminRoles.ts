
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth/store';
import { useAdminStore } from '@/admin/store/admin.store';
import { AdminPermission } from '@/admin/types/admin.types';

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
      loadPermissions(mapRolesToPermissions(roles));
    }
  }, [status, roles, loadPermissions]);
  
  /**
   * Maps user roles to a set of admin permissions
   * @param userRoles Array of user roles from auth store
   * @returns Array of admin permissions
   */
  const mapRolesToPermissions = (userRoles: string[]): AdminPermission[] => {
    let allPermissions: AdminPermission[] = [];
    
    userRoles.forEach(role => {
      switch (role) {
        case 'super_admin':
          allPermissions.push('super_admin:all');
          break;
        case 'admin':
          allPermissions = [
            ...allPermissions,
            'admin:access',
            'admin:view',
            'admin:edit',
            'content:view',
            'content:edit',
            'users:view',
            'builds:view',
            'builds:approve',
            'themes:view'
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
