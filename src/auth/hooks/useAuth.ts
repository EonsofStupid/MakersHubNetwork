
import { useEffect, useState, useCallback } from 'react';
import { authBridge } from '@/bridges/AuthBridge';
import { User, UserProfile, AuthStatus, UserRole } from '@/shared/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [status, setStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    isLoading: true
  });

  // Initialize auth data and subscribe to changes
  useEffect(() => {
    const init = async () => {
      try {
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
          
          setStatus({
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          setStatus({
            isAuthenticated: false,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setStatus({
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    // Subscribe to auth state changes
    const unsubscribe = authBridge.subscribeToEvent('AUTH_STATE_CHANGE', (event) => {
      if (event?.type === 'SIGNED_IN' && event.data?.user) {
        setUser(event.data.user);
        setStatus({
          isAuthenticated: true,
          isLoading: false
        });
        
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
        setStatus({
          isAuthenticated: false,
          isLoading: false
        });
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
    if (roles.includes('superadmin')) return true;
    
    if (Array.isArray(role)) {
      return role.some(r => roles.includes(r));
    }
    
    return roles.includes(role);
  }, [roles]);

  // Check if user is admin
  const isAdmin = useCallback((): boolean => {
    return hasRole(['admin', 'superadmin']);
  }, [hasRole]);

  // Check if user is super admin
  const isSuperAdmin = useCallback((): boolean => {
    return hasRole('superadmin');
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
