
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { UserRoleEnum } from '@/shared/types/shared.types';
import { ADMIN_PERMISSIONS } from '../constants/permissions';

export function useAdminPermissions() {
  const { roles, isAuthenticated } = useAuthStore();
  const [permissions, setPermissions] = useState<string[]>([]);
  
  useEffect(() => {
    // If the user is authenticated, determine their permissions
    if (isAuthenticated && roles) {
      // For now, we're using a simple role-based approach
      // In the future, this could be expanded to fetch permissions from an API
      const userPermissions: string[] = [];
      
      // Add role-based permissions
      if (roles.includes(UserRoleEnum.SUPERADMIN)) {
        // Super admin has all permissions
        userPermissions.push(...Object.values(ADMIN_PERMISSIONS));
      } else if (roles.includes(UserRoleEnum.ADMIN)) {
        // Regular admin has most permissions except some restricted ones
        userPermissions.push(
          ADMIN_PERMISSIONS.ADMIN_VIEW,
          ADMIN_PERMISSIONS.ADMIN_EDIT,
          ADMIN_PERMISSIONS.CONTENT_VIEW,
          ADMIN_PERMISSIONS.CONTENT_EDIT,
          ADMIN_PERMISSIONS.CONTENT_CREATE,
          ADMIN_PERMISSIONS.USER_VIEW,
          ADMIN_PERMISSIONS.SYSTEM_VIEW
        );
      }
      
      setPermissions(userPermissions);
    } else {
      setPermissions([]);
    }
  }, [roles, isAuthenticated]);
  
  const hasPermission = useCallback((permission: string | string[]) => {
    if (!isAuthenticated) return false;
    
    // Super admins have all permissions
    if (roles?.includes(UserRoleEnum.SUPERADMIN)) {
      return true;
    }
    
    // Check for specific permission(s)
    if (Array.isArray(permission)) {
      return permission.some(p => permissions.includes(p));
    }
    
    return permissions.includes(permission);
  }, [isAuthenticated, roles, permissions]);
  
  const isSuperAdmin = useCallback(() => {
    return roles?.includes(UserRoleEnum.SUPERADMIN) || false;
  }, [roles]);
  
  return { permissions, hasPermission, isSuperAdmin };
}
