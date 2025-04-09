
import { useAuthStore } from '@/auth/store/auth.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useCallback, useEffect, useRef, useMemo } from 'react';
import { errorToObject } from '@/shared/utils/render';
import CircuitBreaker from '@/utils/CircuitBreaker';
import { UserRole } from '@/types/auth.types';

// Define utility type for refs that may be initialized later
type RefInit<T> = React.MutableRefObject<T | undefined>;

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
  const hasRoleRef: RefInit<(role: UserRole | UserRole[]) => boolean> = useRef();
  const isAdminRef: RefInit<() => boolean> = useRef();
  const logoutRef: RefInit<() => Promise<void>> = useRef();
  
  // Initialize circuit breaker with a lower threshold
  CircuitBreaker.init('useAuth', 3, 1000);
  
  // Use the stable selector to extract state
  const authState = useAuthStore(selectAuthState);
  
  // Get initialize function with separate selector to avoid re-renders
  const initialize = useAuthStore(selectInitialize);
  
  // Initialize stable function references if needed
  if (!hasRoleRef.current) {
    // Create a function that can handle both single roles and arrays
    hasRoleRef.current = (role: UserRole | UserRole[]): boolean => {
      if (Array.isArray(role)) {
        // Check if user has any role from the array
        return role.some(r => useAuthStore.getState().hasRole(r));
      }
      // Handle single role
      return useAuthStore.getState().hasRole(role);
    };
  }
  
  if (!isAdminRef.current) {
    isAdminRef.current = useAuthStore.getState().isAdmin;
  }
  
  if (!logoutRef.current) {
    logoutRef.current = useAuthStore.getState().logout;
  }
  
  // Auto-initialize auth if needed - with guard against infinite loops
  useEffect(() => {
    // Only try to initialize once and don't block content rendering
    if (initAttemptedRef.current) {
      return;
    }
    
    // Skip initialization in case we detect a potential infinite loop
    if (CircuitBreaker.isTripped('useAuth')) {
      logger.warn('Breaking potential infinite loop in useAuth');
      return;
    }
    
    // Increment counter for circuit breaker
    CircuitBreaker.count('useAuth');
    
    // Prevent multiple initialization attempts
    initAttemptedRef.current = true;
    
    // Initialize auth in background without blocking UI
    const timeoutId = setTimeout(() => {
      initialize().catch(err => {
        logger.error('Failed to initialize auth', { details: errorToObject(err) });
      });
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [initialize, logger]);
  
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
