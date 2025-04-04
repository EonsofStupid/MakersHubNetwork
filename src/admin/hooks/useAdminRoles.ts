
import { useMemo } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { UserRole } from '@/auth/types/auth.types';

/**
 * Hook to check user roles in the admin panel
 */
export function useAdminRoles() {
  const { roles, isLoading, isAuthenticated } = useAuth();
  const logger = useLogger('useAdminRoles', { category: LogCategory.ADMIN });
  
  const isAdmin = useMemo(() => {
    const hasAdminRole = roles.includes('admin' as UserRole) || roles.includes('super_admin' as UserRole);
    return hasAdminRole;
  }, [roles]);
  
  const isModerator = useMemo(() => {
    return roles.includes('moderator' as UserRole);
  }, [roles]);
  
  const isEditor = useMemo(() => {
    return roles.includes('editor' as UserRole);
  }, [roles]);
  
  /**
   * Check if the user has a specific role
   */
  const hasRole = (role: string): boolean => {
    if (!isAuthenticated) return false;
    return roles.includes(role as UserRole);
  };
  
  /**
   * Check if the user has any of the specified roles
   */
  const hasAnyRole = (checkRoles: string[]): boolean => {
    if (!isAuthenticated) return false;
    return checkRoles.some(role => roles.includes(role as UserRole));
  };
  
  /**
   * Get user's highest role
   */
  const getHighestRole = (): UserRole | null => {
    if (!isAuthenticated || roles.length === 0) return null;
    
    const roleHierarchy: UserRole[] = [
      'super_admin', 'admin', 'moderator', 'editor', 'user'
    ];
    
    for (const role of roleHierarchy) {
      if (roles.includes(role)) {
        return role;
      }
    }
    
    return roles[0];
  };
  
  return {
    roles,
    isAdmin,
    isModerator,
    isEditor,
    hasRole,
    hasAnyRole,
    getHighestRole,
    isLoading
  };
}
