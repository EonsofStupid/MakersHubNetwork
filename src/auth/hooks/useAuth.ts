
import { useCallback, useEffect, useMemo } from 'react';
import { UserProfile } from '@/shared/types/auth.types';
import { AuthStatus } from '@/shared/types/auth.types';
import { UserRole } from '@/shared/types/shared.types';
import { useAuthStore } from '../store/auth.store';
import { authBridge } from '../bridge';

export function useAuth() {
  const {
    user,
    status,
    roles,
    error,
    isAuthenticated,
    isAdmin,
    hasAdminAccess,
    
    setUser,
    setStatus,
    setRoles,
    setError,
    signIn,
    signOut,
    signUp,
    resetPassword,
    updateUserProfile
  } = useAuthStore();

  // Check if user has a specific role or an array of roles
  const hasRole = useCallback((requiredRole: UserRole | UserRole[]) => {
    if (!roles.length) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.some(role => roles.includes(role));
    }
    
    return roles.includes(requiredRole);
  }, [roles]);

  // Check if user is authenticated with specific roles
  const isAuthenticatedWithRole = useCallback((role: UserRole | UserRole[]) => {
    return isAuthenticated && hasRole(role);
  }, [isAuthenticated, hasRole]);

  // Check if user is a super admin
  const isSuperAdmin = useMemo(() => {
    return roles.includes(UserRole.SUPERADMIN);
  }, [roles]);

  // Check if user has elevated permissions
  const hasElevatedPermissions = useMemo(() => {
    return isAdmin || hasAdminAccess || isSuperAdmin;
  }, [isAdmin, hasAdminAccess, isSuperAdmin]);

  // Check if current status is loading
  const isLoading = useMemo(() => {
    return status === AuthStatus.LOADING;
  }, [status]);

  return {
    // State
    user,
    status,
    roles,
    error,
    isAuthenticated,
    isAdmin,
    hasAdminAccess,
    isSuperAdmin,
    hasElevatedPermissions,
    isLoading,
    
    // Role utilities
    hasRole,
    isAuthenticatedWithRole,
    
    // Actions
    signIn,
    signOut,
    signUp,
    resetPassword,
    updateUserProfile
  };
}
