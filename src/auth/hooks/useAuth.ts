
/**
 * useAuth.ts
 * 
 * Consolidated hook for accessing authentication state and actions
 * Uses bridges for all operations to ensure module isolation
 */

import { useCallback, useMemo } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { AuthBridge } from '@/bridges';
import { UserRole } from '@/types/shared';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { User } from '@/types/user';

/**
 * Consolidated hook for accessing authentication state and actions
 * Bridges the gap between the auth store and components while ensuring
 * proper module boundaries
 */
export function useAuth() {
  const logger = useLogger('useAuth', LogCategory.AUTH);
  
  // Use selectors for each piece of state to prevent unnecessary re-renders
  // By using selectors, we only access the store state but never write directly
  const rawUser = useAuthStore(state => state.user);
  const user = rawUser as User | null;
  const profile = useAuthStore(state => state.profile);
  const session = useAuthStore(state => state.session);
  const roles = useAuthStore(state => state.roles);
  const status = useAuthStore(state => state.status);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const error = useAuthStore(state => state.error);
  const isLoading = useAuthStore(state => state.isLoading);
  
  // Access methods directly from the store
  const initialize = useAuthStore(state => state.initialize);
  const initialized = useAuthStore(state => state.initialized);
  
  // All role checking functions use AuthBridge to ensure consistent behavior
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    return AuthBridge.hasRole(role);
  }, []);
  
  // Memoize admin status checks to prevent recalculation
  const isAdmin = useMemo(() => {
    return AuthBridge.isAdmin();
  }, []);
  
  const isSuperAdmin = useMemo(() => {
    return AuthBridge.isSuperAdmin();
  }, []);
  
  // All auth operations use AuthBridge to ensure consistent behavior
  const handleLogin = useCallback(async (email: string, password: string) => {
    logger.info('User logging in', { details: { email } });
    return AuthBridge.signIn(email, password);
  }, [logger]);
  
  const handleGoogleLogin = useCallback(async () => {
    logger.info('User logging in with Google');
    return AuthBridge.signInWithGoogle();
  }, [logger]);
  
  const handleLogout = useCallback(async () => {
    logger.info('User logging out', { 
      details: { userId: user?.id }
    });
    return AuthBridge.logout();
  }, [user, logger]);

  // Return all required auth state and methods
  return {
    // Read-only state
    user,
    profile,
    session,
    roles,
    status,
    isLoading,
    error,
    initialized,
    isAuthenticated,
    
    // Role checking functions
    hasRole,
    isAdmin,
    isSuperAdmin,
    
    // Auth operations
    signIn: handleLogin,
    signInWithGoogle: handleGoogleLogin,
    logout: handleLogout,
    initialize
  };
}

// Default export for backward compatibility
export default useAuth;
