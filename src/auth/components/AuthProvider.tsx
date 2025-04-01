
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthProvider as LegacyAuthProvider } from '@/hooks/useAuth';
import { notifyAuthReady, notifySignIn, notifySignOut, notifyUserUpdated, notifySessionUpdated, notifyAuthError } from '@/auth/bridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { UserRole } from '@/auth/types/auth.types';

/**
 * Primary Authentication Provider
 * This component initializes authentication state and publishes auth events to the bridge
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const logger = useLogger('AuthProvider', LogCategory.AUTH);
  
  useEffect(() => {
    logger.info('Initializing auth provider');
    
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('Error getting session', { details: error });
          notifyAuthError(error.message);
          setInitialized(true);
          return;
        }
        
        if (session) {
          logger.info('User session found', { details: { userId: session.user.id } });
          
          // Get user roles
          const { data: rolesData, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id);
            
          if (rolesError) {
            logger.error('Error fetching user roles', { details: rolesError });
          }
          
          const roles = (rolesData?.map(r => r.role) as UserRole[]) || [];
          
          // Notify auth system about authenticated user
          notifySignIn(session.user, session, roles);
        } else {
          logger.info('No user session found');
          notifyAuthReady(null, null, []);
        }
        
        setInitialized(true);
      } catch (error) {
        logger.error('Error initializing auth', { details: error });
        notifyAuthError('Failed to initialize authentication');
        setInitialized(true);
      }
    };
    
    initializeAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.info(`Auth state changed: ${event}`, { details: { event } });
        
        switch (event) {
          case 'SIGNED_IN':
            if (session?.user) {
              // Get user roles with setTimeout to avoid potential deadlocks
              setTimeout(async () => {
                try {
                  const { data: rolesData, error: rolesError } = await supabase
                    .from('user_roles')
                    .select('role')
                    .eq('user_id', session.user.id);
                    
                  if (rolesError) {
                    logger.error('Error fetching user roles', { details: rolesError });
                  }
                  
                  const roles = (rolesData?.map(r => r.role) as UserRole[]) || [];
                  notifySignIn(session.user, session, roles);
                } catch (error) {
                  logger.error('Error processing sign in', { details: error });
                }
              }, 0);
            }
            break;
            
          case 'SIGNED_OUT':
            notifySignOut();
            break;
            
          case 'USER_UPDATED':
            if (session?.user) {
              notifyUserUpdated(session.user);
            }
            break;
            
          case 'TOKEN_REFRESHED':
            if (session) {
              notifySessionUpdated(session);
            }
            break;
        }
      }
    );
    
    return () => {
      logger.info('Cleaning up auth provider');
      subscription.unsubscribe();
    };
  }, [logger]);
  
  // If not initialized, show loading indicator
  if (!initialized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="h-6 w-6 border-t-2 border-primary animate-spin rounded-full" />
      </div>
    );
  }
  
  // Use the LegacyAuthProvider for backward compatibility
  return <LegacyAuthProvider>{children}</LegacyAuthProvider>;
}
