
import React, { ReactNode, useEffect, useState } from 'react';
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
  const { user, session, initialized, setSession } = useAuthStore(state => ({
    user: state.user,
    session: state.session,
    initialized: state.initialized,
    setSession: state.setSession
  }));
  const logger = useLogger('AuthProvider', LogCategory.AUTH);
  
  // Set up auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        logger.info(`Auth state change: ${event}`, {
          details: { 
            event,
            userId: currentSession?.user?.id 
          }
        });

        // Update Zustand store with the new session
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
  
  // Don't wait for auth to initialize to render the app
  // Just provide the current auth state (even if null/loading)
  return (
    <AuthContext.Provider value={{ user, session: session as Session | null }}>
      {children}
    </AuthContext.Provider>
  );
}
