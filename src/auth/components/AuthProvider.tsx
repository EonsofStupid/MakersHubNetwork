
import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth/store';
import { AuthContext } from '@/auth/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { publishAuthEvent } from '@/auth/bridge';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { UserRole } from '@/types/auth';

const logger = getLogger('AuthProvider', LogCategory.AUTH);

interface AuthProviderProps {
  children: React.ReactNode;
  onAuthStateChange?: (authenticated: boolean) => void;
  redirectOnSignOut?: string;
}

export function AuthProvider({ children, onAuthStateChange }: AuthProviderProps) {
  const auth = useAuthStore();
  
  // Initialize auth when component mounts
  useEffect(() => {
    if (!auth.initialized) {
      auth.initialize();
    }
  }, [auth]);
  
  // Listen for auth state changes from Supabase
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info('Auth state changed', { 
        details: { event } 
      });
      
      switch (event) {
        case 'SIGNED_IN':
          // Update session
          auth.setSession(session);
          
          // If we have a user id, fetch roles
          if (session?.user?.id) {
            try {
              const { data: rolesData, error: rolesError } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id);
                
              if (rolesError) {
                throw rolesError;
              }
              
              // Cast roles to UserRole type to ensure compatibility
              const typedRoles = (rolesData?.map(r => r.role) || []) as UserRole[];
              
              // Update roles in auth store
              auth.setRoles(typedRoles);
              
              // Set auth status
              auth.setStatus('authenticated');
              
              // Notify external listeners
              publishAuthEvent('login', { user: session.user });
              
              // Call onAuthStateChange callback
              onAuthStateChange?.(true);
              
            } catch (error) {
              logger.error('Error fetching roles', { 
                details: error instanceof Error ? { message: error.message } : { error } 
              });
              
              // Still mark as authenticated but with no roles
              auth.setRoles([]);
              auth.setStatus('authenticated');
            }
          }
          break;
          
        case 'SIGNED_OUT':
          // Update auth store
          auth.setSession(null);
          auth.setUser(null);
          auth.setRoles([]);
          auth.setStatus('unauthenticated');
          
          // Notify external listeners
          publishAuthEvent('logout');
          
          // Call onAuthStateChange callback
          onAuthStateChange?.(false);
          break;
          
        case 'USER_UPDATED':
          // Update user in auth store
          auth.setUser(session?.user || null);
          break;
          
        case 'TOKEN_REFRESHED':
          // Update session in auth store
          auth.setSession(session);
          break;
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [auth, onAuthStateChange]);
  
  // Return auth context provider with all auth state and methods
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
