
import { useMemo, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth/store';
import { UserRole } from '@/types/auth.types';
import { useAdminStore } from '@/stores/admin/store';

/**
 * Custom hook to check admin access based on user roles
 * This hook uses the admin store for access control
 */
export function useAdminAccess() {
  // Get roles from auth store
  const roles = useAuthStore((state) => state.roles);
  const status = useAuthStore((state) => state.status);
  
  // Admin store
  const { 
    hasPermission, 
    loadPermissions, 
    isLoadingPermissions, 
    permissions 
  } = useAdminStore();
  
  // Get admin roles
  const adminRoles = useMemo<UserRole[]>(() => ['admin', 'super_admin'], []);
  
  // Check if user has admin access
  const hasAdminAccess = useMemo(() => {
    if (!roles || roles.length === 0) return false;
    return roles.some(role => adminRoles.includes(role as UserRole));
  }, [roles, adminRoles]);
  
  // Get admin level
  const adminLevel = useMemo(() => {
    if (!roles || roles.length === 0) return 0;
    if (roles.includes('super_admin')) return 2;
    if (roles.includes('admin')) return 1;
    return 0;
  }, [roles]);
  
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
