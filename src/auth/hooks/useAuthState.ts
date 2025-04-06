
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '@/types/auth.unified';

/**
 * Hook to access auth state directly from store
 * Retrieves ONLY state, doesn't trigger initialization
 * @returns Auth state from store
 */
export function useAuthState() {
  const state = useAuthStore();
  
  // Add missing methods for backward compatibility if they don't exist
  const hasRole = state.hasRole || ((role: UserRole) => state.roles.includes(role));
  const isAdmin = state.isAdmin || (() => state.roles.includes('admin') || state.roles.includes('super_admin'));
  
  return {
    ...state,
    hasRole,
    isAdmin: isAdmin()
  };
}
