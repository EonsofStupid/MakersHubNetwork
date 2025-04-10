
/**
 * useAuthState.ts
 * 
 * Consolidated hook for accessing authentication state
 * Uses AuthBridge as the single source of truth
 */

import { useCallback, useMemo } from 'react';
import { AuthBridge } from '@/auth/bridge';
import { useAuthStore } from '@/auth/store/auth.store';
import { UserRole } from '@/types/shared';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * A unified hook for accessing auth state
 * Ensures consistent access to authentication properties and methods
 */
export function useAuthState() {
  const logger = useLogger('useAuthState', LogCategory.AUTH);
  
  // Use selectors to prevent unnecessary re-renders
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const session = useAuthStore(state => state.session);
  const roles = useAuthStore(state => state.roles);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const status = useAuthStore(state => state.status);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  
  // Use AuthBridge for derived state to ensure consistency
  const isAdmin = useMemo(() => AuthBridge.isAdmin(), []);
  const isSuperAdmin = useMemo(() => AuthBridge.isSuperAdmin(), []);
  
  // Get functions from AuthBridge
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    return AuthBridge.hasRole(role);
  }, []);
  
  const logout = useCallback(async () => {
    logger.info('User logging out');
    return AuthBridge.logout();
  }, [logger]);
  
  return {
    // User state
    user,
    profile,
    session,
    roles,
    
    // Authentication status
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    status,
    isLoading,
    error,
    
    // Auth methods
    hasRole,
    logout,
  };
}

export default useAuthState;
