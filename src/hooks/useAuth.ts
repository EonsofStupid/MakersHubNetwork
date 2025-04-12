
import { useCallback } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { UserRole } from '@/shared/types/shared.types';

/**
 * Hook for accessing auth functionality throughout the application
 */
export function useAuth() {
  // Use selectors from the auth store for better performance
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const status = useAuthStore(state => state.status);
  const roles = useAuthStore(state => state.roles);
  const error = useAuthStore(state => state.error);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = status === 'LOADING';

  // Authentication methods from store
  const initialize = useAuthStore(state => state.initialize);
  const signInWithEmail = useAuthStore(state => state.signInWithEmail);
  const signInWithGoogle = useAuthStore(state => state.signInWithGoogle);
  const signOut = useAuthStore(state => state.signOut);
  const updateProfile = useAuthStore(state => state.updateProfile);

  // Role checking methods
  const hasRole = useCallback((role: UserRole | UserRole[]) => {
    return useAuthStore.getState().hasRole(role);
  }, []);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return hasRole(['admin', 'super_admin']);
  }, [hasRole]);

  return {
    // Auth state
    user,
    profile,
    status,
    roles,
    error,
    isAuthenticated,
    isLoading,
    
    // Auth methods
    initialize,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    updateProfile,
    
    // Role utilities
    hasRole,
    isAdmin,
  };
}

export default useAuth;
