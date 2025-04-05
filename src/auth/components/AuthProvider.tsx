
import React, { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from '../context/AuthContext';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useSiteTheme } from '@/components/theme/SiteThemeProvider';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, session, initialized, setSession, initialize } = useAuthStore();
  const [isPreLoaded, setIsPreLoaded] = useState(false);
  const logger = useLogger('AuthProvider', LogCategory.AUTH);
  const { isLoaded: themeIsLoaded } = useSiteTheme();
  
  // Initialize auth on mount
  useEffect(() => {
    if (!initialized) {
      logger.info('Initializing authentication');
      initialize().then(() => {
        setIsPreLoaded(true);
        logger.info('Authentication initialized');
      }).catch(err => {
        setIsPreLoaded(true);
        logger.error('Error initializing auth', { details: err });
      });
    } else {
      setIsPreLoaded(true);
    }
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
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [logger, initialize, setSession]);
  
  // Wait for auth and theme to initialize
  if (!isPreLoaded || !themeIsLoaded) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background/80 backdrop-blur-sm">
        <div className="animate-pulse text-center">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary/30 border-t-primary animate-spin"></div>
          <p className="mt-4 text-primary text-sm">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Provide auth context
  return (
    <AuthContext.Provider value={{ user, session: session as Session | null }}>
      {children}
    </AuthContext.Provider>
  );
}
