import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthStatus, UserProfile, AUTH_STATUS } from '@/shared/types/core/auth.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface AuthContextProps {
  user: UserProfile | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setStatus: React.Dispatch<React.SetStateAction<AuthStatus>>;
  supabase: any;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  status: AUTH_STATUS.IDLE,
  setUser: () => {},
  setStatus: () => {},
  supabase: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>(AUTH_STATUS.LOADING);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          const userProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at || session.user.created_at, // Ensure updated_at is not undefined
            user_metadata: session.user.user_metadata,
            app_metadata: session.user.app_metadata,
          };
          setUser(userProfile);
          setStatus(AuthStatus.AUTHENTICATED);
        } else {
          setUser(null);
          setStatus(AuthStatus.UNAUTHENTICATED);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const userProfile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at, // Ensure updated_at is not undefined
          user_metadata: session.user.user_metadata,
          app_metadata: session.user.app_metadata,
        };
        setUser(userProfile);
        setStatus(AuthStatus.AUTHENTICATED);
      } else {
        setStatus(AuthStatus.UNAUTHENTICATED);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    isAuthenticated: status === AUTH_STATUS.AUTHENTICATED,
    status,
    setUser,
    setStatus,
    supabase,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
