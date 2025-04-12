
import { useEffect, useState, useCallback } from 'react';
import { authBridge } from '@/bridges/AuthBridge';
import { User, UserRole } from '@/shared/types';

/**
 * Hook to check if the current user has a specific role
 * @param role The role or roles to check
 * @returns Object containing the role check result and loading state
 */
export function useHasRole(role: UserRole | UserRole[]): { 
  hasRole: boolean; 
  isLoading: boolean;
  user: User | null;
} {
  const [hasRole, setHasRole] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const session = await authBridge.getCurrentSession();
        setUser(session?.user || null);
        
        if (session?.user) {
          const userRoles = session.user.app_metadata?.roles || [];
          
          // Super admin has all roles
          if (userRoles.includes('superadmin')) {
            setHasRole(true);
            setIsLoading(false);
            return;
          }
          
          // Check if user has required role(s)
          if (Array.isArray(role)) {
            setHasRole(role.some(r => userRoles.includes(r)));
          } else {
            setHasRole(userRoles.includes(role));
          }
        } else {
          setHasRole(false);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking user role:', error);
        setHasRole(false);
        setIsLoading(false);
      }
    };

    // Subscribe to auth state changes
    const unsubscribe = authBridge.subscribeToEvent('AUTH_STATE_CHANGE', (event) => {
      if (event?.type === 'SIGNED_IN') {
        setUser(event.data?.user || null);
        
        const userRoles = event.data?.user?.app_metadata?.roles || [];
        
        // Super admin has all roles
        if (userRoles.includes('superadmin')) {
          setHasRole(true);
          return;
        }
        
        // Check if user has required role(s)
        if (Array.isArray(role)) {
          setHasRole(role.some(r => userRoles.includes(r)));
        } else {
          setHasRole(userRoles.includes(role));
        }
      } else if (event?.type === 'SIGNED_OUT') {
        setUser(null);
        setHasRole(false);
      }
    });

    checkUserRole();

    return () => {
      unsubscribe();
    };
  }, [role]);

  return { hasRole, isLoading, user };
}
