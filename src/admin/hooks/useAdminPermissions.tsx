
import { useMemo } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useAdminStore } from '@/admin/store/admin.store';
import { PERMISSIONS } from '@/auth/permissions';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { AdminPermissionValue } from '@/admin/types/permissions';

/**
 * Hook for accessing and checking admin permissions
 * Uses both auth store (for user/roles) and admin store (for permissions)
 */
export function useAdminPermissions() {
  const { isLoading: authLoading, status, initialized } = useAuthStore();
  const { permissions, isLoadingPermissions } = useAdminStore();
  
  const isLoading = authLoading || isLoadingPermissions || status === 'loading' || !initialized;
  const logger = useLogger('useAdminPermissions', { category: LogCategory.ADMIN });

  // Memoize the hasPermission function
  const hasPermission = useMemo(() => {
    return (permission: AdminPermissionValue): boolean => {
      // Super admin permission grants access to everything
      if (permissions.includes(PERMISSIONS.SUPER_ADMIN)) {
        return true;
      }
      
      return permissions.includes(permission);
    };
  }, [permissions]);

  logger.debug('Admin permissions computed', { 
    details: { 
      permissionsCount: permissions.length,
      isLoading
    } 
  });

  return {
    permissions,
    hasPermission,
    isLoading
  };
}
