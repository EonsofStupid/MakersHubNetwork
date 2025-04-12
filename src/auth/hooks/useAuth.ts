
import { useEffect, useState, useCallback } from 'react';
import { authBridge } from '@/bridges/AuthBridge';
import { User, UserProfile, AuthStatus, UserRole } from '@/shared/types/shared.types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.IDLE);

  // Initialize auth data and subscribe to changes
  useEffect(() => {
    const init = async () => {
      try {
        setStatus(AuthStatus.LOADING);
        const session = await authBridge.getCurrentSession();
        
        if (session?.user) {
          setUser(session.user);
          
          // Get user profile if available
          if (session.user.id) {
            const userProfile = await authBridge.getUserProfile(session.user.id);
            setProfile(userProfile);
            
            // Extract roles from user metadata or profile
            const userRoles = session.user.app_metadata?.roles || userProfile?.roles || [];
            setRoles(Array.isArray(userRoles) ? userRoles as UserRole[] : []);
          }
          
          setStatus(AuthStatus.AUTHENTICATED);
        } else {
          setStatus(AuthStatus.UNAUTHENTICATED);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setStatus(AuthStatus.ERROR);
      }
    };

    // Subscribe to auth state changes
    const unsubscribe = authBridge.subscribeToAuthEvents((event) => {
      if (event?.type === 'SIGNED_IN' && event.data?.user) {
        setUser(event.data.user);
        setStatus(AuthStatus.AUTHENTICATED);
        
        // Fetch profile when user signs in
        if (event.data.user.id) {
          authBridge.getUserProfile(event.data.user.id)
            .then(userProfile => {
              setProfile(userProfile);
              
              // Update roles
              const userRoles = event.data.user.app_metadata?.roles || userProfile?.roles || [];
              setRoles(Array.isArray(userRoles) ? userRoles as UserRole[] : []);
            })
            .catch(console.error);
        }
      } else if (event?.type === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setRoles([]);
        setStatus(AuthStatus.UNAUTHENTICATED);
      }
    });

    init();

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []);

  // Check if user has a specific role
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    if (!roles.length) return false;
    
    // Superadmin has all roles
    if (roles.includes(UserRole.SUPER_ADMIN)) return true;
    
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    return roles.includes(role);
  }, [roles]);

  // Check if user is admin
  const isAdmin = useCallback((): boolean => {
    return hasRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  }, [hasRole]);

  // Check if user is super admin
  const isSuperAdmin = useCallback((): boolean => {
    return hasRole(UserRole.SUPER_ADMIN);
  }, [hasRole]);

  return {
    user,
    profile,
    roles,
    status,
    hasRole,
    isAdmin,
    isSuperAdmin
  };
}
