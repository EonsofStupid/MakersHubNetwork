
import { useCallback, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import CircuitBreaker from '@/utils/CircuitBreaker';

// Hardcoded admin user for testing purposes
const SYSTEM_ADMIN_ID = '00000000-0000-0000-0000-000000000003';

export function useAuthState() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const logger = getLogger('useAuthState', LogCategory.AUTH);
  
  // Initialize circuit breaker for this component
  CircuitBreaker.init('auth-state', 5, 1000);

  const initialize = useCallback(async () => {
    try {
      // Skip initialization if circuit breaker is tripped
      if (CircuitBreaker.isTripped('auth-state')) {
        logger.warn('Circuit breaker triggered for auth state - using fallback');
        setIsInitializing(false);
        return;
      }
      
      // Increment circuit breaker counter
      CircuitBreaker.count('auth-state');
      
      logger.info('Initializing auth state');
      
      // Try to get session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      const session = data?.session;
      
      // Update state based on session
      setSession(session);
      setUser(session?.user || null);
      setIsAuthenticated(!!session);
      
      // Special case for system admin user
      if (session?.user?.id === SYSTEM_ADMIN_ID) {
        logger.info('System admin user detected');
        // Force isAuthenticated for system admin
        setIsAuthenticated(true);
      }
      
      logger.info('Auth state initialized', {
        details: {
          isAuthenticated: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id || null
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.error('Failed to initialize auth state', {
        details: { error: errorMessage }
      });
      setError(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      // Always mark initialization as complete
      setIsInitializing(false);
    }
  }, [logger]);

  // Set up authentication state change listener
  useEffect(() => {
    // Skip if circuit breaker is tripped
    if (CircuitBreaker.isTripped('auth-state')) {
      logger.warn('Circuit breaker tripped for auth state listener');
      return;
    }
    
    // Initialize auth state
    initialize().catch(error => {
      logger.error('Error in auth initialization', {
        details: { error: error instanceof Error ? error.message : String(error) }
      });
    });
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      logger.debug(`Auth state changed: ${event}`, {
        details: { event, userId: session?.user?.id }
      });
      
      // Update state based on session
      setSession(session);
      setUser(session?.user || null);
      setIsAuthenticated(!!session);
      
      // Special case for system admin user
      if (session?.user?.id === SYSTEM_ADMIN_ID) {
        logger.info('System admin user detected in auth change');
        // Force isAuthenticated for system admin
        setIsAuthenticated(true);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [initialize, logger]);

  return {
    isInitializing,
    isAuthenticated,
    user,
    session,
    error
  };
}
