
import { useEffect, useState, useCallback } from 'react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { mapRolesToPermissions } from '@/auth/rbac/roles';
import { AdminPermissionValue } from '@/admin/constants/permissions';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

export function useAdminPermissions() {
  const { roles, isLoading: isAuthLoading } = useAuthState();
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<AdminPermissionValue[]>([]);
  const logger = getLogger();

  // Map roles to permissions
  useEffect(() => {
    if (!isAuthLoading) {
      try {
        // Convert app permissions to admin permissions
        // This will be improved when we fully standardize the permission systems
        const mappedPermissions = mapRolesToPermissions(roles) as unknown as AdminPermissionValue[];
        
        logger.info('Admin permissions loaded', {
          category: LogCategory.ADMIN,
          source: 'useAdminPermissions',
          details: { permissions: mappedPermissions }
        });
        
        setPermissions(mappedPermissions);
      } catch (error) {
        logger.error('Error loading admin permissions', {
          category: LogCategory.ADMIN,
          source: 'useAdminPermissions',
          details: error
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [roles, isAuthLoading, logger]);

  // Check if user has a specific permission
  const hasPermission = useCallback(
    (permission: AdminPermissionValue): boolean => {
      // Check for super admin first (has all permissions)
      if (permissions.some(p => p === 'all:all')) {
        return true;
      }
      
      return permissions.includes(permission);
    },
    [permissions]
  );

  return {
    permissions,
    hasPermission,
    isLoading: isLoading || isAuthLoading
  };
}
