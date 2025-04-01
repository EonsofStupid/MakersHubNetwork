
import { useCallback } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';
import { AdminPermissionValue } from '@/admin/constants/permissions';

export function useAdminPermissions() {
  const { permissions } = useAdminStore();
  
  const hasPermission = useCallback((permission: AdminPermissionValue | string) => {
    // Admin users have all permissions
    // For simplicity now we're just checking if the permission exists in the list
    return permissions.includes(permission as string) || 
           permissions.includes('all:all');
  }, [permissions]);
  
  return {
    hasPermission,
    permissions
  };
}
