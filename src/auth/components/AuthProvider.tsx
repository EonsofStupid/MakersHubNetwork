
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { authBridge, subscribeToAuthEvents, publishAuthEvent } from '@/bridges/AuthBridge';
import { AuthEvent, UserProfile, UserRole } from '@/shared/types/auth.types';

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  isReady: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[] | undefined) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  status: 'loading',
  isReady: false,
  signIn: async () => null,
  signInWithGoogle: async () => null,
  logout: async () => {},
  hasRole: () => false,
  isAdmin: () => false,
  isSuperAdmin: () => false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, initialUser = null }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>(
    initialUser ? 'authenticated' : 'loading'
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        // Try to get current session
        const currentUser = authBridge.getUser();
        if (currentUser) {
          setUser(currentUser);
          setStatus('authenticated');
        } else {
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setStatus('unauthenticated');
      } finally {
        setIsReady(true);
      }
    };

    initAuth();
    
    // Subscribe to auth events
    const unsubscribe = subscribeToAuthEvents((event: AuthEvent) => {
      switch (event.type) {
        case 'SIGNED_IN':
          if (event.payload?.user) {
            setUser(event.payload.user as User);
            setStatus('authenticated');
          }
          break;
          
        case 'SIGNED_OUT':
          setUser(null);
          setProfile(null);
          setStatus('unauthenticated');
          break;
          
        case 'PROFILE_FETCHED':
          if (event.payload?.profile) {
            setProfile(event.payload.profile as UserProfile);
          }
          break;
          
        case 'USER_UPDATED':
          if (event.payload?.user) {
            setUser(event.payload.user as User);
          }
          break;
          
        default:
          break;
      }
    });
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Check if user has a specific role
  const hasRole = (role: UserRole | UserRole[] | undefined): boolean => {
    if (!role || !profile) return false;
    
    const userRole = profile.role || 'user';
    
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    
    return userRole === role;
  };
  
  const isAdmin = (): boolean => {
    return hasRole(['admin', 'super_admin']);
  };
  
  const isSuperAdmin = (): boolean => {
    return hasRole('super_admin');
  };

  const contextValue: AuthContextType = {
    user,
    profile,
    status,
    isReady,
    signIn: authBridge.signIn.bind(authBridge),
    signInWithGoogle: authBridge.signInWithGoogle.bind(authBridge),
    logout: async () => {
      await authBridge.signOut();
    },
    hasRole,
    isAdmin,
    isSuperAdmin,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
