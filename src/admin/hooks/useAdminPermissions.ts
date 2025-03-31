
import { useCallback } from 'react';
import { useAdmin } from '@/admin/context/AdminContext';
import { useAdminStore } from '@/admin/store/admin.store';
import { AdminPermissionValue, ADMIN_PERMISSIONS } from '@/admin/constants/permissions';

/**
 * Hook for checking admin permissions
 */
export function useAdminPermissions() {
  const { hasAdminAccess } = useAdmin();
  const { hasPermission: storeHasPermission, loadPermissions } = useAdminStore();
  
  /**
   * Check if the current user has a specific permission
   */
  const checkPermission = useCallback((permission: AdminPermissionValue): boolean => {
    // Check basic admin access first
    if (!hasAdminAccess) return false;
    
    // If super admin, allow all permissions
    if (storeHasPermission(ADMIN_PERMISSIONS.SUPER_ADMIN)) return true;
    
    // If checking for basic admin access, always return true if user has admin access
    if (permission === ADMIN_PERMISSIONS.ADMIN_ACCESS) return true;
    
    // Check specific permission
    return storeHasPermission(permission);
  }, [hasAdminAccess, storeHasPermission]);
  
  /**
   * Reload all permissions
   */
  const refreshPermissions = useCallback(() => {
    if (hasAdminAccess) {
      loadPermissions();
    }
  }, [hasAdminAccess, loadPermissions]);
  
  return {
    hasPermission: checkPermission,
    refreshPermissions
  };
}
