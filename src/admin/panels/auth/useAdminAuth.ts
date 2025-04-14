
import { useCallback } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';
import { UserRole, LogCategory } from '@/shared/types';
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
    const result = RBACBridge.hasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
    return result;
  }, []);
  
  // Check if user is super admin
  const isSuperAdmin = useCallback((): boolean => {
    return RBACBridge.hasRole(UserRole.SUPER_ADMIN);
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
    isLoading: status === 'loading',
    status,
    roles,
    hasAdminAccess,
    isSuperAdmin,
    logAdminError
  };
};
