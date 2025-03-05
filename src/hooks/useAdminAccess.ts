
import { useMemo } from 'react';
import { useAuthStore } from '@/stores/auth/store';
import { UserRole } from '@/types/auth.types';

/**
 * Custom hook to check admin access based on user roles
 * Memoized to prevent unnecessary recalculations
 */
export function useAdminAccess() {
  // Get roles from auth store
  const roles = useAuthStore((state) => state.roles);
  
  // Memoize admin roles to prevent unnecessary recalculations
  const adminRoles = useMemo<UserRole[]>(() => ['admin', 'super_admin'], []);
  
  // Memoize the result of access check to prevent unnecessary re-renders
  const hasAdminAccess = useMemo(() => {
    if (!roles || roles.length === 0) return false;
    return roles.some(role => adminRoles.includes(role as UserRole));
  }, [roles, adminRoles]);
  
  // Memoize the admin level to prevent unnecessary recalculations
  const adminLevel = useMemo(() => {
    if (!roles || roles.length === 0) return 0;
    if (roles.includes('super_admin')) return 2;
    if (roles.includes('admin')) return 1;
    return 0;
  }, [roles]);
  
  return {
    hasAdminAccess,
    adminLevel,
    adminRoles
  };
}
