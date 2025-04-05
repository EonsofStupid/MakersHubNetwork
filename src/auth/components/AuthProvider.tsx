import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/auth/store/auth.store';
import { UserRole } from '@/auth/types/auth.types';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';

/**
 * Primary Authentication Provider
 * Initializes authentication state and sets up auth event listeners
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { 
    setUser, 
    setSession, 
    setRoles, 
    initialize, 
    setStatus,
    setInitialized
  } = useAuthStore();
  
  const logger = useLogger('AuthProvider', LogCategory.AUTH);
  
  // Initialize auth state on mount
  useEffect(() => {
    // Set loading state while initializing
    setStatus('loading');
    
    logger.info('Setting up auth state change listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.info(`Auth state changed: ${event}`, { details: { event } });
        
        switch (event) {
          case 'SIGNED_IN':
            if (session?.user) {
              setUser(session.user);
              setSession(session);
              setStatus('authenticated');
              
              // Get user roles with setTimeout to avoid potential deadlocks
              setTimeout(async () => {
                try {
                  const { data: rolesData, error: rolesError } = await supabase
                    .from('user_roles')
                    .select('role')
                    .eq('user_id', session.user.id);
                    
                  if (rolesError) {
                    logger.error('Error fetching user roles', {
                      category: LogCategory.AUTH,
                      details: safeDetails(rolesError)
                    });
                  }
                  
                  const roles = (rolesData?.map(r => r.role) as UserRole[]) || [];
                  setRoles(roles);
                } catch (error) {
                  logger.error('Error processing sign in', {
                    category: LogCategory.AUTH,
                    details: safeDetails(error)
                  });
                }
              }, 0);
            }
            break;
            
          case 'SIGNED_OUT':
            setUser(null);
            setSession(null);
            setRoles([]);
            setStatus('unauthenticated');
            break;
            
          case 'USER_UPDATED':
            if (session?.user) {
              setUser(session.user);
            }
            break;
            
          case 'TOKEN_REFRESHED':
            if (session) {
              setSession(session);
            }
            break;
        }
      }
    );
    
    // CRITICAL CHANGE: Initialize auth in background but don't block rendering
    initialize()
      .then(() => {
        logger.info('Auth initialized successfully');
      })
      .catch(error => {
        logger.error('Failed to initialize auth', {
          category: LogCategory.AUTH,
          details: safeDetails(error)
        });
      })
      .finally(() => {
        setInitialized(true);
      });
    
    return () => {
      logger.info('Cleaning up auth provider');
      subscription.unsubscribe();
    };
  }, [logger, setUser, setSession, setRoles, setStatus, initialize, setInitialized]);
  
  // We no longer block rendering with a loading indicator
  return <>{children}</>;
}
