
import { useCallback } from 'react';
import { useAdmin } from '@/admin/context/AdminContext';
import { useAdminStore } from '@/admin/store/admin.store';
import { AdminPermission } from '@/admin/types/admin.types';

/**
 * Hook for checking admin permissions
 */
export function useAdminPermissions() {
  const { hasAdminAccess } = useAdmin();
  const { hasPermission, loadPermissions } = useAdminStore();
  
  /**
   * Check if the current user has a specific permission
   */
  const checkPermission = useCallback((permission: AdminPermission): boolean => {
    // Check basic admin access first
    if (!hasAdminAccess) return false;
    
    // Check specific permission
    return hasPermission(permission);
  }, [hasAdminAccess, hasPermission]);
  
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
