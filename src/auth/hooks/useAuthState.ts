
/**
 * useAuthState.ts
 * 
 * Hook to access auth state without triggering unnecessary re-renders
 * Uses selectors and bridges for consistent behavior and module isolation
 */

import { useAuthStore } from '../store/auth.store';
import { AuthBridge } from '@/bridges/AuthBridge';
import { UserRole } from '@/types/shared';

/**
 * Hook to access auth state without triggering unnecessary re-renders
 * Uses selectors for performance optimization and AuthBridge for consistent behavior
 */
export function useAuthState() {
  // Use selectors to only subscribe to the specific state pieces needed
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const roles = useAuthStore(state => state.roles);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const status = useAuthStore(state => state.status);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  
  // Use AuthBridge for role checks to ensure consistency
  const hasRole = (role: UserRole | UserRole[] | undefined): boolean => {
    return AuthBridge.hasRole(role);
  };
  
  const isAdmin = AuthBridge.isAdmin();
  const isSuperAdmin = AuthBridge.isSuperAdmin();
  
  return {
    // Read-only state
    user,
    profile,
    roles,
    isAuthenticated,
    status,
    isLoading,
    error,
    
    // Role checking functions
    hasRole,
    isAdmin,
    isSuperAdmin
  };
}
