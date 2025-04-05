
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/auth/store/auth.store';
import { UserRole } from '@/auth/types/auth.types';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

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
    initialized
  } = useAuthStore();
  
  const logger = useLogger('AuthProvider', LogCategory.AUTH);
  
  // Initialize auth state on mount
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  // Set up auth state change listener
  useEffect(() => {
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
                    logger.error('Error fetching user roles', { details: rolesError });
                  }
                  
                  const roles = (rolesData?.map(r => r.role) as UserRole[]) || [];
                  setRoles(roles);
                } catch (error) {
                  logger.error('Error processing sign in', { details: error });
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
    
    return () => {
      logger.info('Cleaning up auth provider');
      subscription.unsubscribe();
    };
  }, [logger, setUser, setSession, setRoles, setStatus]);
  
  // If not initialized, show loading indicator
  if (!initialized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="h-6 w-6 border-t-2 border-primary animate-spin rounded-full" />
      </div>
    );
  }
  
  return <>{children}</>;
}
