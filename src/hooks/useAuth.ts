
import { useCallback, useMemo } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { AuthBridge } from '@/bridges/AuthBridge';
import { UserRole } from '@/types/shared';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook for accessing authentication state
 * Uses Zustand's selector pattern for efficient updates
 */
export function useAuth() {
  const logger = useLogger('useAuth', LogCategory.AUTH);
  
  // Use selectors for each piece of state to prevent unnecessary re-renders
  const user = useAuthStore(state => state.user);
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
  
  // Memoize role checking functions to prevent recreation on each render
  const hasRole = useCallback((role: UserRole | UserRole[]) => {
    return AuthBridge.hasRole(role);
  }, []);
  
  // Use memoization for derived values
  const isAdmin = useMemo(() => {
    return AuthBridge.isAdmin();
  }, []);
  
  const isSuperAdmin = useMemo(() => {
    return AuthBridge.isSuperAdmin();
  }, []);
  
  // Use AuthBridge for auth operations to ensure consistent behavior
  const handleLogin = useCallback(async (email: string, password: string) => {
    logger.info('User logging in', { 
      details: { email }
    });
    
    return AuthBridge.signIn(email, password);
  }, [logger]);
  
  const handleGoogleLogin = useCallback(async () => {
    logger.info('User logging in with Google');
    
    return AuthBridge.signInWithGoogle();
  }, [logger]);
  
  const handleLogout = useCallback(async () => {
    if (user) {
      logger.info('User logging out', { 
        details: { userId: user.id }
      });
    }
    
    // Use AuthBridge for logout
    return AuthBridge.logout();
  }, [user, logger]);

  // Return all required auth state and methods
  return {
    user,
    profile,
    session,
    roles,
    status,
    isLoading,
    error,
    hasRole,
    isAdmin,
    isSuperAdmin,
    isAuthenticated,
    signIn: handleLogin,
    signInWithGoogle: handleGoogleLogin,
    logout: handleLogout,
    initialize,
    initialized
  };
}

// Default export for backward compatibility
export default useAuth;
