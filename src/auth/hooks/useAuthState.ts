
import { useAuthStore } from '../store/auth.store';
import { AuthBridge } from '@/bridges/AuthBridge';

/**
 * Hook to access auth state without triggering unnecessary re-renders
 * Uses selectors for performance optimization
 */
export function useAuthState() {
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const roles = useAuthStore(state => state.roles);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const status = useAuthStore(state => state.status);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  
  // Use AuthBridge for role checks to ensure consistency
  const hasRole = (role: UserRole | UserRole[] | undefined) => {
    if (!role) return false;
    return AuthBridge.hasRole(role);
  };
  
  const isAdmin = AuthBridge.isAdmin();
  const isSuperAdmin = AuthBridge.isSuperAdmin();
  
  return {
    user,
    profile,
    roles,
    isAuthenticated,
    status,
    isLoading,
    error,
    hasRole,
    isAdmin,
    isSuperAdmin
  };
}
