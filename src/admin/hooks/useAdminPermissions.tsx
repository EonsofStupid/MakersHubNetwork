
import { useMemo } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { PERMISSIONS } from '@/auth/permissions';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { mapRolesToPermissions } from '@/auth/rbac/roles';
import { AdminPermissionValue } from '@/admin/types/permissions';

export function useAdminPermissions() {
  const { roles, status, isLoading: authLoading } = useAuthStore();
  const isLoading = authLoading || status === 'loading';
  const logger = useLogger('useAdminPermissions', LogCategory.ADMIN);

  // Calculate permissions based on user roles
  const permissions = useMemo(() => {
    return mapRolesToPermissions(roles);
  }, [roles]);

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
      roles
    } 
  });

  return {
    permissions,
    hasPermission,
    isLoading
  };
}
