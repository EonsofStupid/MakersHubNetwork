
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { UserRole } from '../types/auth.types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string;
    email: string;
    roles: UserRole[];
    profile?: Record<string, unknown>;
  } | null;
  session: Session | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    session: null
  });

  // Function to get user roles
  const getUserRoles = useCallback(async (userId: string): Promise<UserRole[]> => {
    try {
      // In a real app, this would fetch roles from a database
      // For now, we'll return mock roles
      return ['user'];
    } catch (error) {
      console.error('Error getting user roles:', error);
      return [];
    }
  }, []);

  // Function to get user session and profile
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        const session = data.session;

        if (session) {
          const userId = session.user.id;
          const roles = await getUserRoles(userId);
          
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: {
              id: userId,
              email: session.user.email || '',
              roles,
              profile: {}
            },
            session
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            session: null
          });
        }
      } catch (error) {
        console.error('Error fetching auth session:', error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          session: null
        });
      }
    };

    fetchSession();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const roles = await getUserRoles(session.user.id);
        
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: {
            id: session.user.id,
            email: session.user.email || '',
            roles,
            profile: {}
          },
          session
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          session: null
        });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [getUserRoles]);

  return authState;
}
