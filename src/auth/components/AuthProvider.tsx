
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
  const { user, session, initialized, setSession, initialize } = useAuthStore();
  const [isPreLoaded, setIsPreLoaded] = useState(false);
  const logger = useLogger('AuthProvider', LogCategory.AUTH);
  
  // Initialize auth on mount with a timeout to prevent blocking the UI
  useEffect(() => {
    const initAuth = async () => {
      if (!initialized) {
        logger.info('Initializing authentication');
        try {
          await initialize();
          logger.info('Authentication initialized');
        } catch (err) {
          logger.error('Error initializing auth', { details: err });
        } finally {
          setIsPreLoaded(true);
        }
      } else {
        setIsPreLoaded(true);
      }
    };

    // Use a small timeout to prevent blocking the initial render
    const timer = setTimeout(initAuth, 10);
    return () => clearTimeout(timer);
  }, [initialized, initialize, logger]);
  
  // Handle auth state changes
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
          
          // Don't include this in the auth state change callback
          // to prevent potential infinite loops
          setTimeout(() => {
            initialize().catch(err => {
              logger.error('Error reinitializing after sign in', { details: err });
            });
          }, 10);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [logger, initialize, setSession]);
  
  // Don't wait for auth to initialize to render the app
  // Just provide the current auth state (even if null/loading)
  return (
    <AuthContext.Provider value={{ user, session: session as Session | null }}>
      {children}
    </AuthContext.Provider>
  );
}
