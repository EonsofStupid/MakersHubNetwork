
import { useMemo } from 'react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { AdminPermissionValue } from '@/admin/types/permissions';
import { mapRolesToPermissions } from '@/auth/rbac/roles';

export function useAdminRoles() {
  const { roles } = useAuthState();
  
  const adminPermissions = useMemo(() => {
    return mapRolesToPermissions(roles);
  }, [roles]);
  
  const hasPermission = (permission: AdminPermissionValue): boolean => {
    return adminPermissions.includes(permission);
  };
  
  return {
    permissions: adminPermissions,
    hasPermission
  };
}
