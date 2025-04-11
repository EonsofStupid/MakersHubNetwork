
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from '../context/AuthContext';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useSiteTheme } from '@/app/components/theme/SiteThemeProvider';
import { errorToObject } from '@/shared/utils/render';
import { publishAuthEvent } from '@/auth/bridge';
import { UserProfile } from '@/types/auth.types';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Get the store state and methods
  const { 
    user, 
    session, 
    profile, 
    status, 
    setSession, 
    initialize, 
    initialized 
  } = useAuthStore();
  
  const [isInitializing, setIsInitializing] = useState(false);
  
  const logger = useLogger('AuthProvider', LogCategory.AUTH);
  const authSubscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const initTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initAttemptedRef = useRef<boolean>(false);
  
  // Get theme loading status to ensure correct initialization order
  const { isLoaded: themeLoaded } = useSiteTheme();
  
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

        // Publish the auth event so other systems can react to it
        publishAuthEvent({
          type: 'AUTH_STATE_CHANGE',
          payload: { event, session: currentSession }
        });

        // Only update session state, avoid triggering other effects
        setSession(currentSession);
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
      
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
    };
  }, []); // Empty deps to ensure it runs only once
  
  // Initialize auth only once after theme is loaded
  useEffect(() => {
    // Wait for theme to be loaded first
    if (!themeLoaded) {
      return;
    }
    
    // Prevent multiple initialization attempts with ref guard
    if (initAttemptedRef.current || initialized || isInitializing) {
      return;
    }
    
    // Mark initialization as attempted immediately to prevent race conditions
    initAttemptedRef.current = true;
    setIsInitializing(true);
    
    // Initialize auth state asynchronously with a small delay
    // This delay helps break potential circular dependencies
    initTimeoutRef.current = setTimeout(() => {
      logger.info('Initializing auth state');
      
      initialize().catch(err => {
        logger.error('Failed to initialize auth', { details: errorToObject(err) });
      }).finally(() => {
        setIsInitializing(false);
      });
    }, 50); // Small delay to help with timing issues
    
  }, [initialize, initialized, logger, themeLoaded, isInitializing]); 
  
  // Provide the current auth state, whether authenticated or not
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        profile: profile as UserProfile | null, 
        status 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
