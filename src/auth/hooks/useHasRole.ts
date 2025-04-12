
import { useAuthStore } from '@/auth/store/auth.store';
import { UserRole } from '@/shared/types/shared.types';

/**
 * Hook to check if the current user has a specific role or roles
 *
 * @param role - Single role or array of roles to check
 * @returns boolean indicating if user has at least one of the roles
 */
export function useHasRole(role: UserRole | UserRole[]): boolean {
  const roles = useAuthStore(state => state.roles);
  
  if (Array.isArray(role)) {
    return role.some(r => roles.includes(r));
  }
  
  return roles.includes(role);
}

/**
 * Hook to check if current user has admin access
 *
 * @returns boolean indicating if user is admin or super_admin
 */
export function useHasAdminAccess(): boolean {
  const isAdmin = useAuthStore(state => state.isAdmin());
  return isAdmin;
}

/**
 * Hook to check if current user is super admin
 *
 * @returns boolean indicating if user is super_admin
 */
export function useIsSuperAdmin(): boolean {
  const isSuperAdmin = useAuthStore(state => state.isSuperAdmin());
  return isSuperAdmin;
}
