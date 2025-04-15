
import { useCallback } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';
import { LogCategory, ROLES } from '@/shared/types/shared.types';
import { useLogger } from '@/logging/hooks/use-logger';

/**
 * Hook for managing admin authentication
 * Provides auth state and admin-specific auth utilities
 */
export const useAdminAuth = () => {
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const status = useAuthStore(state => state.status);
  const logger = useLogger('useAdminAuth', LogCategory.ADMIN);
  
  // Check if user has admin access
  const hasAdminAccess = useCallback((): boolean => {
    return RBACBridge.hasRole([ROLES.admin, ROLES.super_admin]);
  }, []);
  
  // Check if user is super admin
  const isSuperAdmin = useCallback((): boolean => {
    return RBACBridge.hasRole(ROLES.super_admin);
  }, []);
  
  // Get user roles
  const roles = RBACBridge.getRoles();
  
  // Log admin errors
  const logAdminError = useCallback((action: string, error: unknown) => {
    logger.error(`Admin ${action} failed`, {
      details: {
        error,
        userId: user?.id,
        email: user?.email
      }
    });
  }, [logger, user]);
  
  return {
    user,
    isAuthenticated,
    isLoading: status === 'LOADING',
    status,
    roles,
    hasAdminAccess,
    isSuperAdmin,
    logAdminError
  };
};
