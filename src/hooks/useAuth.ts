
import { useMemo, useEffect, useState, useCallback } from 'react';
import { authBridge } from '@/auth/bridge';
import { AuthStatus, UserRole } from '@/shared/types/shared.types';

export function useAuth() {
  // Use state to track auth status
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.INITIAL);
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [profile, setProfile] = useState(null);

  // Calculate other derived states
  const isLoading = useMemo(() => {
    return status === AuthStatus.LOADING || status === AuthStatus.INITIAL;
  }, [status]);

  const isAuthenticated = useMemo(() => {
    return status === AuthStatus.AUTHENTICATED;
  }, [status]);

  // Initialize auth state
  useEffect(() => {
    setStatus(AuthStatus.LOADING);
    
    // Check initial auth state
    const checkAuth = async () => {
      try {
        const session = await authBridge.getSession();
        if (session) {
          setStatus(AuthStatus.AUTHENTICATED);
          const user = authBridge.getUser();
          setUser(user);
          // TODO: Get roles and profile
        } else {
          setStatus(AuthStatus.UNAUTHENTICATED);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setStatus(AuthStatus.ERROR);
      }
    };
    
    checkAuth();
    
    // Subscribe to auth state changes
    const unsubscribe = authBridge.subscribeToEvent((event) => {
      if (event.type === 'AUTH_SIGNED_IN') {
        setStatus(AuthStatus.AUTHENTICATED);
        const user = authBridge.getUser();
        setUser(user);
        // TODO: Get roles and profile
      } else if (event.type === 'AUTH_SIGNED_OUT') {
        setStatus(AuthStatus.UNAUTHENTICATED);
        setUser(null);
        setRoles([]);
        setProfile(null);
      } else if (event.type === 'AUTH_ERROR') {
        setStatus(AuthStatus.ERROR);
      } else if (event.type === 'AUTH_USER_UPDATED') {
        const user = authBridge.getUser();
        setUser(user);
      } else if (event.type === 'AUTH_PROFILE_UPDATED') {
        setProfile(event.payload?.profile || null);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Auth methods
  const login = useCallback(async (email: string, password: string) => {
    try {
      setStatus(AuthStatus.LOADING);
      await authBridge.signInWithEmail(email, password);
      // Auth state update will be handled by the event subscription
    } catch (error) {
      setStatus(AuthStatus.ERROR);
      throw error;
    }
  }, []);
  
  const logout = useCallback(async () => {
    try {
      await authBridge.logout();
      // Auth state update will be handled by the event subscription
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  // Role checks
  const hasRole = useCallback((role: UserRole | UserRole[]) => {
    return authBridge.hasRole(role);
  }, []);
  
  const isAdmin = useCallback(() => {
    return authBridge.isAdmin();
  }, []);
  
  const isSuperAdmin = useCallback(() => {
    return authBridge.isSuperAdmin();
  }, []);

  // Return the auth context
  return {
    status,
    user,
    roles,
    profile,
    isLoading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    isAdmin,
    isSuperAdmin,
  };
}

export default useAuth;
