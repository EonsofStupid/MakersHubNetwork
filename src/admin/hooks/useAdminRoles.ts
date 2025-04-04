
import { useCallback, useMemo } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { UserRole } from '@/auth/types/auth.types';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook for working with admin roles
 * Provides helper functions to check if the current user has specific roles
 */
export function useAdminRoles() {
  const { roles } = useAuth();
  const logger = useLogger('useAdminRoles', { category: LogCategory.ADMIN });
  
  // Check if user has admin role
  const isAdmin = useMemo(() => {
    const hasAdminRole = roles.includes('admin');
    logger.debug('Admin role check', { details: { hasRole: hasAdminRole } });
    return hasAdminRole;
  }, [roles, logger]);
  
  // Check if user has super admin role
  const isSuperAdmin = useMemo(() => {
    const hasSuperAdminRole = roles.includes('super_admin');
    logger.debug('Super Admin role check', { details: { hasRole: hasSuperAdminRole } });
    return hasSuperAdminRole;
  }, [roles, logger]);
  
  // Check if user has a specific role
  const hasRole = useCallback((role: UserRole): boolean => {
    return roles.includes(role);
  }, [roles]);
  
  // Get the highest priority role
  const highestRole = useMemo(() => {
    if (roles.includes('super_admin')) return 'super_admin';
    if (roles.includes('admin')) return 'admin';
    if (roles.includes('moderator')) return 'moderator';
    if (roles.includes('editor')) return 'editor';
    return 'user';
  }, [roles]);
  
  return {
    roles,
    isAdmin,
    isSuperAdmin,
    hasRole,
    highestRole
  };
}
