
import { useCallback } from 'react';
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '@/shared/types/shared.types';

export function useAuth() {
  const {
    user,
    status,
    roles,
    isLoading,
    isAuthenticated,
    error,
    login,
    logout,
    register,
    resetPassword,
    updateProfile,
  } = useAuthStore();

  // Check if the user has a specific role
  const hasRole = useCallback((role: UserRole | UserRole[]) => {
    if (!roles || roles.length === 0) return false;
    
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    return roles.includes(role);
  }, [roles]);

  // Check if user is admin or superadmin
  const isAdmin = useCallback(() => {
    return hasRole([UserRole.ADMIN, UserRole.SUPERADMIN]);
  }, [hasRole]);

  // Check if user is superadmin
  const isSuperAdmin = useCallback(() => {
    return hasRole(UserRole.SUPERADMIN);
  }, [hasRole]);

  return {
    user,
    status,
    roles,
    isLoading,
    isAuthenticated,
    error,
    login,
    logout,
    register,
    resetPassword,
    updateProfile,
    hasRole,
    isAdmin,
    isSuperAdmin
  };
}
