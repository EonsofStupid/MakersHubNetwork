
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
  const authStore = useAuthStore();
  const { user, session, setSession, initialize, initialized } = {
    user: authStore.user,
    session: authStore.session,
    setSession: authStore.setSession,
    initialize: authStore.initialize,
    initialized: authStore.initialized
  };
  
  const logger = useLogger('AuthProvider', LogCategory.AUTH);
  const initAttemptedRef = useRef<boolean>(false);
  const authSubscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const authTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Setup auth state change listener only once
  useEffect(() => {
    // Only run once 
    if (authSubscriptionRef.current !== null) {
      return;
    }

    logger.info('Setting up auth state change listener');
      
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
      
    // Store subscription to avoid creating multiple listeners
    authSubscriptionRef.current = subscription;
      
    // Clean up subscription on unmount
    return () => {
      if (authSubscriptionRef.current) {
        authSubscriptionRef.current.unsubscribe();
        authSubscriptionRef.current = null;
      }
      
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
        authTimeoutRef.current = null;
      }
    };
  }, []); // Removed dependencies to ensure it runs only once
  
  // Initialize auth only once
  useEffect(() => {
    // Prevent multiple initialization attempts with ref guard
    if (initAttemptedRef.current || initialized) {
      return;
    }
    
    // Mark initialization as attempted immediately to prevent race conditions
    initAttemptedRef.current = true;
    
    // Initialize auth state asynchronously
    // Use setTimeout to break potential circular dependencies
    authTimeoutRef.current = setTimeout(() => {
      const initializeAuth = async () => {
        try {
          logger.info('Initializing auth state');
          await initialize();
        } catch (err) {
          logger.error('Failed to initialize auth', { details: err });
        }
      };
      
      initializeAuth();
    }, 0);
  }, [initialize, initialized]); // Keep only necessary dependencies
  
  // Provide the current auth state, whether authenticated or not
  return (
    <AuthContext.Provider value={{ user, session: session as Session | null }}>
      {children}
    </AuthContext.Provider>
  );
}
