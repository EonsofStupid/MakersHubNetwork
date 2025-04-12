
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authBridge } from '@/bridges/AuthBridge';
import { User, UserProfile, AuthStatus, AuthEventType } from '@/shared/types';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/logging/types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  status: AuthStatus;
  roles: string[];
  hasRole: (role: string | string[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [status, setStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    isLoading: true,
  });
  const logger = useLogger('AuthProvider', LogCategory.AUTH);

  useEffect(() => {
    logger.info('Initializing AuthProvider');

    // Initialize session
    const initSession = async () => {
      try {
        const session = await authBridge.getCurrentSession();
        
        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
          
          // Extract roles from user metadata
          const userRoles = session.user.app_metadata?.roles || [];
          setRoles(Array.isArray(userRoles) ? userRoles : []);
          
          setStatus({
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setStatus({
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        logger.error('Failed to initialize auth session', {
          details: { message: error instanceof Error ? error.message : String(error) }
        });
        
        setStatus({
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    // Subscribe to auth events
    const unsubscribe = authBridge.subscribeToEvent('AUTH_STATE_CHANGE', (event) => {
      logger.info('Auth state changed', { details: { eventType: event?.type } });
      
      if (event?.type === 'SIGNED_IN') {
        setUser(event.data?.user || null);
        setStatus({
          isAuthenticated: true,
          isLoading: false,
        });
      } else if (event?.type === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setRoles([]);
        setStatus({
          isAuthenticated: false,
          isLoading: false,
        });
      } else if (event?.type === 'PROFILE_FETCHED') {
        setProfile(event.data?.profile || null);
        // If profile has roles, set them
        if (event.data?.profile?.roles) {
          setRoles(event.data.profile.roles);
        }
      } else if (event?.type === 'USER_UPDATED') {
        setUser(event.data?.user || null);
        // Extract roles from updated user metadata
        if (event.data?.user?.app_metadata?.roles) {
          setRoles(event.data.user.app_metadata.roles);
        }
      }
    });

    initSession();

    return () => {
      unsubscribe();
      logger.info('AuthProvider cleanup');
    };
  }, [logger]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const fetchedProfile = await authBridge.getUserProfile(userId);
      if (fetchedProfile) {
        setProfile(fetchedProfile);
      }
    } catch (error) {
      logger.error('Failed to fetch user profile', {
        details: { message: error instanceof Error ? error.message : String(error) }
      });
    }
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!roles.length) return false;
    
    if (roles.includes('superadmin')) {
      return true;
    }
    
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    return roles.includes(role);
  };

  const isAdmin = (): boolean => {
    return hasRole(['admin', 'superadmin']);
  };

  const isSuperAdmin = (): boolean => {
    return hasRole('superadmin');
  };

  const value = {
    user,
    profile,
    status,
    roles,
    hasRole,
    isAdmin,
    isSuperAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
