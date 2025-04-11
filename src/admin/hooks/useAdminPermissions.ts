
import { useMemo } from 'react';
import { checkPermission, checkAllPermissions, checkAnyPermission } from '@/auth/rbac/enforce';
import { authBridge } from '@/bridges/AuthBridge';
import { Permission, UserRole } from '@/shared/types/auth.types';

export function usePermissions() {
  // Get the user's roles from auth bridge
  const userRoles = useMemo(() => {
    if (!authBridge.user?.profile?.roles) {
      return [];
    }
    return authBridge.user.profile.roles as UserRole[];
  }, [authBridge.user?.profile?.roles]);
  
  const hasPermission = (permission: Permission): boolean => {
    return checkPermission(userRoles, permission);
  };
  
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return checkAllPermissions(userRoles, permissions);
  };
  
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return checkAnyPermission(userRoles, permissions);
  };
  
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    const rolesToCheck = Array.isArray(role) ? role : [role];
    
    if (userRoles.length === 0) {
      return false;
    }
    
    return rolesToCheck.some(r => userRoles.includes(r));
  };
  
  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRole,
    userRoles
  };
}
