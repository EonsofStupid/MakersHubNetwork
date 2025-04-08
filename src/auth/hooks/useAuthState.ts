
import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import CircuitBreaker from '@/utils/CircuitBreaker';
import { UserRole } from '@/types/common.types';

// Default user roles for fallback
// Using our unified UserRole type from common.types.ts

// Hardcoded admin user for testing purposes
const SYSTEM_ADMIN_ID = '00000000-0000-0000-0000-000000000003';

/**
 * Hook for managing the authentication state
 * Enhanced with better initialization handling and circuit breakers
 */
export function useAuthState() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated' | 'error'>('loading');
  const logger = getLogger('useAuthState');
  const initAttemptedRef = useRef(false);
  
  // Initialize circuit breaker for this component
  CircuitBreaker.init('auth-state', 5, 1000);

  const processUserRoles = useCallback((user: User | null): UserRole[] => {
    // Extract roles from user metadata
    const userRoles: UserRole[] = [];
    
    if (user?.app_metadata?.roles && Array.isArray(user.app_metadata.roles)) {
      userRoles.push(...user.app_metadata.roles as UserRole[]);
    }
    
    // Special case for system admin user
    if (user?.id === SYSTEM_ADMIN_ID) {
      logger.info('System admin user detected');
      if (!userRoles.includes('super_admin')) userRoles.push('super_admin');
      if (!userRoles.includes('admin')) userRoles.push('admin');
    }
    
    return userRoles;
  }, [logger]);

  const initialize = useCallback(async () => {
    try {
      // Skip initialization if circuit breaker is tripped
      if (CircuitBreaker.isTripped('auth-state')) {
        logger.warn('Circuit breaker triggered for auth state - using fallback');
        setIsInitializing(false);
        setStatus('error');
        return;
      }
      
      // Skip if initialization already attempted
      if (initAttemptedRef.current) {
        return;
      }
      
      initAttemptedRef.current = true;
      
      // Increment circuit breaker counter
      CircuitBreaker.count('auth-state');
      
      logger.info('Initializing auth state');
      
      // Try to get session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      const currentSession = data?.session;
      const currentUser = currentSession?.user || null;
      
      // Update state based on session
      setSession(currentSession);
      setUser(currentUser);
      
      // Determine authentication status
      const isUserAuthenticated = !!currentSession || (currentUser?.id === SYSTEM_ADMIN_ID);
      setIsAuthenticated(isUserAuthenticated);
      
      // Determine status
      setStatus(isUserAuthenticated ? 'authenticated' : 'unauthenticated');
      
      // Process roles
      const userRoles = processUserRoles(currentUser);
      setRoles(userRoles);
      
      logger.info('Auth state initialized', {
        details: {
          isAuthenticated: isUserAuthenticated,
          hasUser: !!currentUser,
          userId: currentUser?.id || null,
          roles: userRoles
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.error('Failed to initialize auth state', {
        details: { error: errorMessage }
      });
      setError(err instanceof Error ? err : new Error(errorMessage));
      setStatus('error');
    } finally {
      // Always mark initialization as complete
      setIsInitializing(false);
    }
  }, [logger, processUserRoles]);

  // Set up authentication state change listener
  useEffect(() => {
    // Skip if circuit breaker is tripped
    if (CircuitBreaker.isTripped('auth-state')) {
      logger.warn('Circuit breaker tripped for auth state listener');
      return;
    }
    
    // Initialize auth state if not done before
    if (!initAttemptedRef.current) {
      initialize().catch(error => {
        logger.error('Error in auth initialization', {
          details: { error: error instanceof Error ? error.message : String(error) }
        });
      });
    }
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      logger.debug(`Auth state changed: ${event}`, {
        details: { event, userId: session?.user?.id }
      });
      
      const currentUser = session?.user || null;
      
      // Update state based on session
      setSession(session);
      setUser(currentUser);
      
      // Determine authentication status
      const isUserAuthenticated = !!session || (currentUser?.id === SYSTEM_ADMIN_ID);
      setIsAuthenticated(isUserAuthenticated);
      
      // Only update status if not 'loading' (to prevent flickering during initial load)
      if (status !== 'loading') {
        setStatus(isUserAuthenticated ? 'authenticated' : 'unauthenticated');
      }
      
      // Process roles
      const userRoles = processUserRoles(currentUser);
      setRoles(userRoles);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [initialize, logger, status, processUserRoles]);

  // Memoize the return value to prevent unnecessary renders
  return useMemo(() => ({
    isInitializing,
    isAuthenticated,
    user,
    session,
    error,
    roles,
    status
  }), [isInitializing, isAuthenticated, user, session, error, roles, status]);
}
