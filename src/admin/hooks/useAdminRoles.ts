
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
      loadPermissions();
    }
  }, [status, roles, loadPermissions]);
  
  /**
   * Maps a user role to a set of admin permissions
   * @param role User role from auth store
   * @returns Array of admin permissions
   */
  const mapRoleToPermissions = (role: string): AdminPermission[] => {
    switch (role) {
      case 'super_admin':
        return ['super_admin:all'];
      case 'admin':
        return [
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
      case 'moderator':
        return [
          'admin:access',
          'admin:view',
          'content:view',
          'users:view',
          'builds:view'
        ];
      default:
        return [];
    }
  };
  
  return {
    isAdmin: Boolean(user?.role === 'admin' || roles?.includes('admin')),
    isSuperAdmin: Boolean(roles?.includes('super_admin')),
    isModerator: Boolean(roles?.includes('moderator')),
    mapRoleToPermissions
  };
}
