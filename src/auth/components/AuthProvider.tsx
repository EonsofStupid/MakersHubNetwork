
import { useEffect, ReactNode, useRef } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { supabase } from '@/lib/supabase';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { dispatchAuthEvent, dispatchSignInEvent, dispatchSignOutEvent } from '@/auth/bridge';
import CircuitBreaker from '@/utils/CircuitBreaker';

interface AuthProviderProps {
  children: ReactNode;
  onError?: (error: Error) => void;
}

/**
 * AuthProvider component
 * Initializes auth, listens for auth state changes, and provides auth state via Zustand
 * Uses the AuthBridge to notify other components of auth state changes
 * Enhanced with better initialization handling and circuit breakers
 */
export function AuthProvider({ children, onError }: AuthProviderProps) {
  // Use separate getters to avoid triggering re-renders with multiple selectors
  const initialize = useAuthStore(state => state.initialize);
  const setSession = useAuthStore(state => state.setSession);
  const logger = useLogger('AuthProvider', LogCategory.AUTH);
  const hasInitialized = useRef(false);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const authInitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Initialize circuit breaker to prevent infinite loops
    CircuitBreaker.init('AuthProvider-effect', 10, 1000); 
    
    // Check if we're caught in an infinite loop
    if (CircuitBreaker.isTripped('AuthProvider-effect')) {
      logger.warn('Breaking potential infinite loop in AuthProvider');
      return;
    }
    
    // Increment counter for circuit breaker
    CircuitBreaker.count('AuthProvider-effect');
    
    logger.info('AuthProvider mounting');
    
    // Set up Supabase auth state change listener only once
    if (!subscriptionRef.current) {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          // Log auth state changes but don't act on initial session
          logger.info(`Auth state change: ${event}`, {
            details: {
              event,
              userId: session?.user?.id
            }
          });
          
          // Update session in the store - avoid unnecessary store updates on INITIAL_SESSION
          if (event !== 'INITIAL_SESSION') {
            setSession(session);
            
            // Dispatch event to AuthBridge for other components
            if (session) {
              // User signed in or session updated
              dispatchAuthEvent({
                type: 'SESSION_UPDATED',
                payload: { session }
              });
              
              if (event === 'SIGNED_IN') {
                dispatchSignInEvent({ session });
              }
            } else if (event === 'SIGNED_OUT') {
              // User signed out
              dispatchSignOutEvent();
            }
          }
        });
        
        subscriptionRef.current = subscription;
      } catch (error) {
        // Handle any errors when setting up auth listener
        logger.error('Error setting up auth state listener', {
          details: error instanceof Error ? { message: error.message } : { error }
        });
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    }
    
    // Initialize auth on mount, only once, with a delay to break potential cycles
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
      // Add a small timeout to avoid immediate state updates
      // Clear any existing timeout to prevent duplicates
      if (authInitTimeoutRef.current) {
        clearTimeout(authInitTimeoutRef.current);
      }
      
      authInitTimeoutRef.current = setTimeout(() => {
        initialize().then(() => {
          // Notify via bridge that auth is initialized
          dispatchAuthEvent({ type: 'INITIALIZED' });
        }).catch(error => {
          logger.error('Error initializing auth', {
            details: error instanceof Error ? { message: error.message } : { error }
          });
          onError?.(error instanceof Error ? error : new Error(String(error)));
        });
      }, 100);
    }
    
    // Clean up auth listener on unmount
    return () => {
      if (authInitTimeoutRef.current) {
        clearTimeout(authInitTimeoutRef.current);
        authInitTimeoutRef.current = null;
      }
      
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe();
          logger.info('Auth subscription removed');
        } catch (e) {
          logger.warn('Error unsubscribing from auth events', {
            details: e instanceof Error ? { message: e.message } : { error: e }
          });
        }
        subscriptionRef.current = null;
      }
    };
  }, [initialize, setSession, logger, onError]);
  
  // No context provider, just render children and use Zustand for state
  return <>{children}</>;
}
