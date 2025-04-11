
import { useMemo } from 'react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { useAdminStore } from '@/admin/store/admin.store';
import { PERMISSIONS } from '@/auth/permissions';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { AdminPermissionValue } from '@/admin/types/permissions';

/**
 * Hook for checking admin permissions
 * Uses both auth store (for user/roles) and admin store (for permissions)
 */
export function useAdminPermissions() {
  const { status, roles } = useAuthState();
  const adminStore = useAdminStore();
  const permissions = adminStore.permissions;
  const isLoadingPermissions = adminStore.isLoadingPermissions;
  
  const isLoading = status === 'loading' || isLoadingPermissions;
  const logger = useLogger('useAdminPermissions', LogCategory.ADMIN);
  
  // Memoize the hasPermission function to prevent recreating on each render
  const hasPermission = useMemo(() => {
    return (permission: AdminPermissionValue): boolean => {
      // If loading, be conservative and deny access
      if (isLoading) {
        return false;
      }
      
      // Super admin permission grants access to everything
      if (permissions.includes(PERMISSIONS.SUPER_ADMIN)) {
        return true;
      }
      
      return permissions.includes(permission);
    };
  }, [permissions, isLoading]);

  return {
    permissions,
    hasPermission,
    isLoading
  };
}
