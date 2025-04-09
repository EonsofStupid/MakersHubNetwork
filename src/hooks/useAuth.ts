
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useCallback, useEffect, useRef, useMemo } from 'react';
import { errorToObject } from '@/shared/utils/render';
import CircuitBreaker from '@/utils/CircuitBreaker';

// Create stable selectors outside the component to prevent regeneration
const selectAuthState = (state: ReturnType<typeof useAuthStore.getState>) => ({
  user: state.user,
  session: state.session,
  roles: state.roles,
  status: state.status,
  isLoading: state.isLoading,
  error: state.error,
  initialized: state.initialized,
  isAuthenticated: state.isAuthenticated
});

const selectInitialize = (state: ReturnType<typeof useAuthStore.getState>) => state.initialize;

/**
 * Hook for accessing authentication state with initialization guard
 * Enhanced with stable references and memoization to prevent unnecessary re-renders
 */
export function useAuth() {
  const logger = useLogger('useAuth', LogCategory.AUTH);
  const initAttemptedRef = useRef<boolean>(false);
  const hasRoleRef = useRef<typeof useAuthStore.getState().hasRole | undefined>();
  const isAdminRef = useRef<(() => boolean) | undefined>();
  const logoutRef = useRef<typeof useAuthStore.getState().logout | undefined>();
  
  // Initialize circuit breaker with a lower threshold
  CircuitBreaker.init('useAuth', 3, 1000);
  
  // Use the stable selector to extract state
  const authState = useAuthStore(selectAuthState);
  
  // Get initialize function with separate selector to avoid re-renders
  const initialize = useAuthStore(selectInitialize);
  
  // Initialize stable function references if needed
  if (!hasRoleRef.current) {
    hasRoleRef.current = useAuthStore.getState().hasRole;
  }
  
  if (!isAdminRef.current) {
    isAdminRef.current = useAuthStore.getState().isAdmin;
  }
  
  if (!logoutRef.current) {
    logoutRef.current = useAuthStore.getState().logout;
  }
  
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
    return logoutRef.current?.();
  }, [authState.user, logger]);

  // Return stable object reference to prevent unnecessary re-renders
  return useMemo(() => ({
    ...authState,
    isAdmin: isAdminRef.current?.() || false,
    isSuperAdmin,
    hasRole: hasRoleRef.current,
    logout: handleLogout,
    // Don't expose initialize directly as it should be handled automatically
  }), [authState, isSuperAdmin, handleLogout]);
}
