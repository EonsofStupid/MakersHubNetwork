
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useCallback, useEffect, useRef, useMemo } from 'react';
import { errorToObject } from '@/shared/utils/render';
import CircuitBreaker from '@/utils/CircuitBreaker';

/**
 * Hook for accessing authentication state with initialization guard
 * Enhanced with stable references and memoization to prevent unnecessary re-renders
 */
export function useAuth() {
  const logger = useLogger('useAuth', LogCategory.AUTH);
  const initAttemptedRef = useRef<boolean>(false);
  
  // Initialize circuit breaker with a lower threshold
  CircuitBreaker.init('useAuth', 3, 1000);
  
  // Create a stable selector function using useMemo
  const selector = useMemo(() => {
    return (state: ReturnType<typeof useAuthStore.getState>) => ({
      user: state.user,
      session: state.session,
      roles: state.roles,
      status: state.status,
      isLoading: state.isLoading,
      error: state.error,
      initialized: state.initialized,
      isAuthenticated: state.isAuthenticated
    });
  }, []);
  
  // Use the stable selector to extract state
  const authState = useAuthStore(selector);

  // Store stable function references with useRef + useMemo to prevent re-renders
  const stableHasRole = useMemo(() => useAuthStore.getState().hasRole, []);
  const stableIsAdmin = useMemo(() => useAuthStore.getState().isAdmin, []);
  const stableLogout = useMemo(() => useAuthStore.getState().logout, []);
  
  // Get initialize function with separate selector to avoid re-renders
  const initialize = useAuthStore(state => state.initialize);
  
  // Auto-initialize auth if needed - with guard against infinite loops
  useEffect(() => {
    // Skip initialization in case we detect a potential infinite loop
    if (CircuitBreaker.isTripped('useAuth')) {
      logger.warn('Breaking potential infinite loop in useAuth');
      return;
    }
    
    // Increment counter for circuit breaker
    CircuitBreaker.count('useAuth');
    
    // Prevent multiple initialization attempts
    if (initAttemptedRef.current) {
      return;
    }
    
    // Only initialize if needed
    if (!authState.initialized && authState.status === 'idle') {
      logger.info('Auto-initializing auth from useAuth hook');
      initAttemptedRef.current = true;
      
      // Use setTimeout to break potential circular dependencies
      const timeoutId = setTimeout(() => {
        initialize().catch(err => {
          logger.error('Failed to initialize auth', { details: errorToObject(err) });
        });
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [authState.status, authState.initialized, initialize, logger]);
  
  // Derived state (memoized to prevent unnecessary re-renders)
  const isSuperAdmin = useMemo(() => 
    authState.roles.includes('super_admin'), 
    [authState.roles]
  );

  // Log wrapper for logout to capture info before state is cleared
  const handleLogout = useCallback(async () => {
    if (authState.user) {
      logger.info('User logging out', { 
        details: { userId: authState.user.id }
      });
    }
    return stableLogout();
  }, [authState.user, logger, stableLogout]);

  return useMemo(() => ({
    ...authState,
    isAdmin: stableIsAdmin(),
    isSuperAdmin,
    hasRole: stableHasRole,
    logout: handleLogout,
    // Don't expose initialize directly as it should be handled automatically
  }), [authState, stableIsAdmin, isSuperAdmin, stableHasRole, handleLogout]);
}
