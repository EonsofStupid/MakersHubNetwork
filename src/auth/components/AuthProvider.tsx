
import { useEffect, ReactNode, useRef } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component
 * Initializes auth, listens for auth state changes, and provides auth state via Zustand
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { initialize, setSession } = useAuthStore();
  const logger = useLogger('AuthProvider', LogCategory.AUTH);
  const hasInitialized = useRef(false);
  
  useEffect(() => {
    logger.info('AuthProvider mounting');
    
    // Set up Supabase auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Log auth state changes
      logger.info(`Auth state change: ${event}`, {
        details: {
          event,
          userId: session?.user?.id
        }
      });
      
      // Update session in the store
      setSession(session);
    });
    
    // Initialize auth on mount, only once
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
      // Add a small timeout to avoid immediate state updates
      setTimeout(() => {
        initialize().catch(error => {
          logger.error('Error initializing auth', {
            details: error instanceof Error ? { message: error.message } : { error }
          });
        });
      }, 10);
    }
    
    // Clean up auth listener on unmount
    return () => {
      subscription.unsubscribe();
      logger.info('Auth subscription removed');
    };
  }, [initialize, setSession, logger]);
  
  // No context provider, just render children and use Zustand for state
  return <>{children}</>;
}
