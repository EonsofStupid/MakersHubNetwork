
import { useCallback, useMemo } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';
import { UserRole, ROLES } from '@/types/shared';
import { AuthBridge } from '@/bridges/AuthBridge';

/**
 * Hook for checking admin access permissions
 * Centralizes admin access logic and provides useful derived values
 */
export function useAdminAccess() {
  const { isAuthenticated, roles, isLoading } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    roles: state.roles,
    isLoading: state.isLoading
  }));
  const logger = useLogger('useAdminAccess', LogCategory.ADMIN);
  
  // Calculate derived permissions based on roles
  const isAdmin = useMemo(() => {
    return AuthBridge.isAdmin();
  }, []);
  
  const isSuperAdmin = useMemo(() => {
    return AuthBridge.isSuperAdmin();
  }, []);
  
  const hasAdminAccess = useMemo(() => {
    const hasAccess = isAdmin || isSuperAdmin;
    
    if (hasAccess) {
      logger.debug('User has admin access', { 
        details: { 
          isAdmin, 
          isSuperAdmin,
          roles 
        } 
      });
    }
    
    return hasAccess;
  }, [isAdmin, isSuperAdmin, roles, logger]);
  
  // Determine debug access - only super_admin can access debugging tools
  const hasDebugAccess = useMemo(() => {
    return isSuperAdmin;
  }, [isSuperAdmin]);

  // Check if user has specific role
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    return AuthBridge.hasRole(role);
  }, []);

  return {
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    hasAdminAccess,
    hasDebugAccess,
    hasRole,
    roles,
    isLoading
  };
}
