
import { useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { AuthStatus } from '@/auth/types/auth.types';
import { UserRole } from '@/types/shared';
import { UserProfile } from '@/auth/store/auth.store';
import { User } from '@supabase/supabase-js';

/**
 * Consolidated hook for accessing auth state across the app
 * This provides a consistent interface that bridges modules
 */
export const useAuthState = () => {
  const {
    user,
    session,
    profile,
    roles,
    status,
    isAuthenticated,
    error,
    isLoading,
    initialized,
    hasRole,
    isAdmin: checkIsAdmin,
    isSuperAdmin: checkIsSuperAdmin
  } = useAuthStore();

  // Computed state
  const isAdmin = checkIsAdmin();
  const isSuperAdmin = checkIsSuperAdmin();

  return {
    user,
    session,
    profile,
    roles,
    status,
    isAuthenticated,
    error,
    isLoading,
    initialized,
    isAdmin,
    isSuperAdmin,
    hasRole
  };
};
