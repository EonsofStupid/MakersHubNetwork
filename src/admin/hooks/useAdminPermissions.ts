
import { useMemo } from 'react';
import { Permission, UserRole } from '@/shared/types/user';
import { authBridge } from '@/bridges/AuthBridge';

export function usePermissions() {
  // Get the user's roles from auth bridge
  const userRoles = useMemo(() => {
    const user = authBridge.getUser();
    if (!user?.app_metadata?.roles) {
      return [];
    }
    return user.app_metadata.roles as UserRole[];
  }, []);
  
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

// Simple permission checking functions
export function checkPermission(userRoles: UserRole[], permission: Permission): boolean {
  // Admin and superadmin have all permissions
  if (userRoles.includes('admin') || userRoles.includes('superadmin')) {
    return true;
  }

  // For other roles, implement specific permission logic
  return false;
}

export function checkAllPermissions(userRoles: UserRole[], permissions: Permission[]): boolean {
  return permissions.every(permission => checkPermission(userRoles, permission));
}

export function checkAnyPermission(userRoles: UserRole[], permissions: Permission[]): boolean {
  return permissions.some(permission => checkPermission(userRoles, permission));
}

// Export compatibility alias for existing code
export const useAdminPermissions = usePermissions;
