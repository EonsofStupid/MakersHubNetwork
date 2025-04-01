
import { useCallback } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';
import { AdminPermissionValue, ADMIN_PERMISSIONS } from '@/admin/constants/permissions';

export function useAdminPermissions() {
  const { permissions, syncing } = useAdminStore();
  
  const hasPermission = useCallback((permission: AdminPermissionValue | string) => {
    // Admin users have all permissions
    if (permissions.includes('all:all')) {
      return true;
    }
    
    // Check for specific permission
    return permissions.includes(permission as AdminPermissionValue);
  }, [permissions]);
  
  return {
    hasPermission,
    permissions,
    isLoading: syncing
  };
}
