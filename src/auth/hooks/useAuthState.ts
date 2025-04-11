
import { useState, useEffect } from 'react';
import { User, UserProfile } from '@/shared/types/auth.types';
import { authBridge } from '@/bridges/AuthBridge';
import { useLogger } from '@/shared/hooks/useLogger';
import { LogCategory } from '@/shared/types/logging';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(authBridge.getUser());
  const [profile, setProfile] = useState<UserProfile | null>(authBridge.getProfile());
  const [roles, setRoles] = useState<string[]>(authBridge.getUserRoles());
  const logger = useLogger('useAuthState', LogCategory.AUTH);

  useEffect(() => {
    logger.debug('Setting up auth state listeners');

    // Listen for auth state changes
    const unsubscribe = authBridge.subscribe((event) => {
      logger.debug(`Auth event received: ${event.type}`);

      if (event.type === 'AUTH_SIGNED_IN' || event.type === 'AUTH_USER_UPDATED' || event.type === 'AUTH_STATE_CHANGED') {
        setUser(authBridge.getUser());
        setRoles(authBridge.getUserRoles());
      } 
      else if (event.type === 'AUTH_PROFILE_UPDATED') {
        setProfile(authBridge.getProfile());
      }
      else if (event.type === 'AUTH_SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setRoles([]);
      }
    });

    // Initial state fetch
    setUser(authBridge.getUser());
    setProfile(authBridge.getProfile());
    setRoles(authBridge.getUserRoles());
    
    return () => {
      logger.debug('Cleaning up auth state listeners');
      unsubscribe();
    };
  }, [logger]);
  
  const hasRole = (role: string | string[]) => {
    return authBridge.hasRole(role);
  };
  
  const isAdmin = () => {
    return authBridge.isAdmin();
  };
  
  const isSuperAdmin = () => {
    return authBridge.isSuperAdmin();
  };

  return {
    user,
    profile,
    roles,
    status: authBridge.status,
    hasRole,
    isAdmin,
    isSuperAdmin
  };
}
