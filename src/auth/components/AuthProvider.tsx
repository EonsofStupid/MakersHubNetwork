
import React, { ReactNode, useEffect, useRef } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from '../context/AuthContext';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Use selector function for Zustand to prevent unnecessary rerenders
  const { user, session, setSession, initialize, initialized } = useAuthStore(state => ({
    user: state.user,
    session: state.session,
    setSession: state.setSession,
    initialize: state.initialize,
    initialized: state.initialized
  }));
  const logger = useLogger('AuthProvider', LogCategory.AUTH);
  const initAttemptedRef = useRef<boolean>(false);
  
  // Setup initial auth state and listeners
  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initAttemptedRef.current) {
      return;
    }
    
    initAttemptedRef.current = true;
    logger.info('Setting up auth state change listener');
    
    // First set up the state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        logger.info(`Auth state change: ${event}`, {
          details: { 
            event,
            userId: currentSession?.user?.id 
          }
        });

        // Only update session state, avoid triggering other effects
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(currentSession);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
        }
      }
    );
    
    // Then initialize auth if needed - but only once
    if (!initialized) {
      // Use a flag to break potential circular dependencies
      const initializationPromise = initialize();
      
      // Don't block rendering on the initialization promise
      initializationPromise.catch(err => {
        logger.error('Failed to initialize auth', { details: err });
      });
    }
    
    return () => {
      subscription.unsubscribe();
    };
  }, [logger, setSession, initialize, initialized]);
  
  // Provide the current auth state, whether authenticated or not
  return (
    <AuthContext.Provider value={{ user, session: session as Session | null }}>
      {children}
    </AuthContext.Provider>
  );
}
