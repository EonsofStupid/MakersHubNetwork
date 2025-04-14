
import { useState, useEffect } from 'react';
import { AuthBridge } from '@/bridges/AuthBridge';
import { RBACBridge } from '@/bridges/RBACBridge';
import { UserProfile, UserRole, ROLES, AuthStatus } from '@/shared/types/shared.types';

interface UseAuthStateReturn {
  user: UserProfile | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  roles: UserRole[];
  error: Error | null;
}

/**
 * Hook to get the current authentication state
 */
export const useAuthState = (): UseAuthStateReturn => {
  const [user, setUser] = useState<UserProfile | null>(AuthBridge.getUser());
  const [status, setStatus] = useState<AuthStatus>(
    user ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED
  );
  const [error, setError] = useState<Error | null>(null);
  const [roles, setRoles] = useState<UserRole[]>(RBACBridge.getRoles());

  useEffect(() => {
    // Initialize auth state
    const init = async () => {
      try {
        setStatus(AuthStatus.LOADING);
        
        // Get session from AuthBridge
        const session = await AuthBridge.getCurrentSession();
        
        if (session?.user) {
          setUser(session.user);
          setStatus(AuthStatus.AUTHENTICATED);
          
          // Assign roles based on metadata
          let userRoles: UserRole[] = [ROLES.USER];
          
          if (session.user.app_metadata?.roles) {
            userRoles = session.user.app_metadata.roles as UserRole[];
          }
          
          // For demo purpose, assign admin role for specific emails
          if (session.user.email === 'admin@example.com') {
            userRoles.push(ROLES.ADMIN);
          }
          
          if (session.user.email === 'superadmin@example.com') {
            userRoles.push(ROLES.SUPER_ADMIN);
          }
          
          // Update RBAC bridge
          RBACBridge.setRoles(userRoles);
          setRoles(userRoles);
        } else {
          setUser(null);
          setStatus(AuthStatus.UNAUTHENTICATED);
          RBACBridge.setRoles([]);
          setRoles([]);
        }
      } catch (err) {
        setStatus(AuthStatus.ERROR);
        setError(err as Error);
        setUser(null);
        RBACBridge.setRoles([]);
        setRoles([]);
      }
    };
    
    init();
    
    // Set up auth state listener
    const subscription = AuthBridge.onAuthEvent((event) => {
      init(); // Refresh auth state when auth event occurs
    });
    
    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);
  
  return {
    user,
    isAuthenticated: !!user,
    status,
    roles,
    error
  };
};
