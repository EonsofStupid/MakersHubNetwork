
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
  const { user, session, setSession } = useAuthStore(state => ({
    user: state.user,
    session: state.session,
    setSession: state.setSession
  }));
  const logger = useLogger('AuthProvider', LogCategory.AUTH);
  const initAttemptedRef = useRef<boolean>(false);
  
  // Set up auth state change listener
  useEffect(() => {
    // Prevent setup from running multiple times
    if (initAttemptedRef.current) {
      return;
    }
    
    initAttemptedRef.current = true;
    logger.info('Setting up auth state change listener');
    
    // Don't perform other auth actions inside this subscription callback
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
    
    return () => {
      subscription.unsubscribe();
    };
  }, [logger, setSession]);
  
  // Provide the current auth state, don't trigger actions here
  return (
    <AuthContext.Provider value={{ user, session: session as Session | null }}>
      {children}
    </AuthContext.Provider>
  );
}
