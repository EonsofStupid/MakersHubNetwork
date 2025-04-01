
import { useAuthStore } from '../store/auth.store';

/**
 * Hook to access auth state directly from store
 * @returns Auth state from store
 */
export function useAuthState() {
  return useAuthStore();
}
