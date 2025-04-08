
import { useEffect, ReactNode, useRef } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { dispatchAuthEvent } from '@/auth/bridge';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component
 * Initializes auth, listens for auth state changes, and provides auth state via Zustand
 * Uses the AuthBridge to notify other components of auth state changes
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // Use separate getters to avoid triggering re-renders with multiple selectors
  const initialize = useAuthStore(state => state.initialize);
  const setSession = useAuthStore(state => state.setSession);
  const logger = useLogger('AuthProvider', LogCategory.AUTH);
  const hasInitialized = useRef(false);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const authInitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    logger.info('AuthProvider mounting');
    
    // Set up Supabase auth state change listener only once
    if (!subscriptionRef.current) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        // Log auth state changes
        logger.info(`Auth state change: ${event}`, {
          details: {
            event,
            userId: session?.user?.id
          }
        });
        
        // Update session in the store - avoid unnecessary store updates
        if (event !== 'INITIAL_SESSION') {
          setSession(session);
          
          // Dispatch event to AuthBridge for other components
          dispatchAuthEvent({
            type: session ? 'SESSION_UPDATED' : 'SIGNED_OUT',
            payload: { session }
          });
        }
      });
      
      subscriptionRef.current = subscription;
    }
    
    // Initialize auth on mount, only once
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
        subscriptionRef.current.unsubscribe();
        logger.info('Auth subscription removed');
        subscriptionRef.current = null;
      }
    };
  }, [initialize, setSession, logger]);
  
  // No context provider, just render children and use Zustand for state
  return <>{children}</>;
}
