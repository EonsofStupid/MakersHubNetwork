
import { useState, useEffect } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';
import { AdminPermissionValue } from '@/admin/constants/permissions';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook for checking admin permissions
 */
export function useAdminPermissions() {
  const { permissions, setPermissions } = useAdminStore();
  const { roles, isAuthenticated } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Derived state
  const isSuperAdmin = roles.includes('super_admin');
  const isAdmin = isSuperAdmin || roles.includes('admin');
  
  // Check if user has specific permission
  const hasPermission = (permission: AdminPermissionValue): boolean => {
    if (!isAuthenticated) return false;
    if (isSuperAdmin) return true;
    
    return permissions.includes(permission);
  };
  
  // Check if user has all of the required permissions
  const hasAllPermissions = (requiredPermissions: AdminPermissionValue[]): boolean => {
    if (!isAuthenticated) return false;
    if (isSuperAdmin) return true;
    
    return requiredPermissions.every(permission => permissions.includes(permission));
  };
  
  // Check if user has any of the required permissions
  const hasAnyPermission = (requiredPermissions: AdminPermissionValue[]): boolean => {
    if (!isAuthenticated) return false;
    if (isSuperAdmin) return true;
    
    return requiredPermissions.some(permission => permissions.includes(permission));
  };
  
  useEffect(() => {
    setIsLoaded(permissions.length > 0);
  }, [permissions]);
  
  return {
    permissions,
    isLoaded,
    isSuperAdmin,
    isAdmin,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission
  };
}
