
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useEffect, useRef, useMemo } from 'react';
import { errorToObject } from '@/shared/utils/render';
import CircuitBreaker from '@/utils/CircuitBreaker';

/**
 * Hook for accessing authentication state with initialization guard
 */
export function useAuth() {
  const logger = useLogger('useAuth', LogCategory.AUTH);
  const initAttemptedRef = useRef<boolean>(false);
  
  // Initialize circuit breaker
  CircuitBreaker.init('useAuth', 5, 1000);
  
  // Store stable function references to prevent re-renders
  const stableHasRole = useRef(useAuthStore.getState().hasRole).current;
  const stableIsAdmin = useRef(useAuthStore.getState().isAdmin).current;
  const stableLogout = useRef(useAuthStore.getState().logout).current;
  
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
  
  // Derived state
  const isSuperAdmin = authState.roles.includes('super_admin');

  // Log wrapper for logout to capture info before state is cleared
  const handleLogout = async () => {
    if (authState.user) {
      logger.info('User logging out', { 
        details: { userId: authState.user.id }
      });
    }
    return stableLogout();
  };

  return {
    ...authState,
    isAdmin: stableIsAdmin(),
    isSuperAdmin,
    hasRole: stableHasRole,
    logout: handleLogout,
    // Don't expose initialize directly as it should be handled automatically
  };
}
