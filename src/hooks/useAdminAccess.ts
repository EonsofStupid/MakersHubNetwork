
import { useMemo, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth/store';
import { UserRole } from '@/types/auth.types';
import { useAdminStore } from '@/admin/store/admin.store';

/**
 * Custom hook to check admin access based on user roles
 * This hook uses the admin store for access control
 */
export function useAdminAccess() {
  // Get roles from auth store
  const roles = useAuthStore((state) => state.roles);
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  
  // Admin store
  const { 
    hasPermission, 
    loadPermissions, 
    isLoadingPermissions, 
    permissions 
  } = useAdminStore();
  
  // Define admin roles
  const adminRoles = useMemo<UserRole[]>(() => ['admin', 'super_admin'], []);
  
  // Check if user has admin access
  const hasAdminAccess = useMemo(() => {
    if (!roles || roles.length === 0) {
      // Fallback to app_metadata if roles array is empty
      return user?.app_metadata?.roles?.some(
        (role: string) => adminRoles.includes(role as UserRole)
      ) || false;
    }
    
    return roles.some(role => adminRoles.includes(role as UserRole));
  }, [roles, adminRoles, user?.app_metadata?.roles]);
  
  // Get admin level
  const adminLevel = useMemo(() => {
    // Check in roles array first
    if (roles && roles.length > 0) {
      if (roles.includes('super_admin')) return 2;
      if (roles.includes('admin')) return 1;
      return 0;
    }
    
    // Fallback to app_metadata if roles array is empty
    if (user?.app_metadata?.roles) {
      if (user.app_metadata.roles.includes('super_admin')) return 2;
      if (user.app_metadata.roles.includes('admin')) return 1;
    }
    
    return 0;
  }, [roles, user?.app_metadata?.roles]);
  
  // Load permissions when admin access is true
  useEffect(() => {
    if (hasAdminAccess && status === 'authenticated') {
      loadPermissions();
    }
  }, [hasAdminAccess, loadPermissions, status]);
  
  return {
    hasAdminAccess,
    adminLevel,
    adminRoles,
    hasPermission,
    loadPermissions,
    isLoadingPermissions,
    permissions
  };
}
