
import { useEffect, useState, useCallback } from 'react';
import { authBridge } from '@/bridges/AuthBridge';
import { User, UserRole } from '@/shared/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  roles: UserRole[];
}

export function useAuthState() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    roles: [],
  });

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        const session = await authBridge.getCurrentSession();
        
        if (session?.user) {
          // Extract roles from user metadata
          const userRoles = session.user.app_metadata?.roles || [];
          
          setState({
            user: session.user,
            isAuthenticated: true,
            isLoading: false,
            roles: Array.isArray(userRoles) ? userRoles as UserRole[] : [],
          });
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            roles: [],
          });
        }
      } catch (error) {
        console.error('Auth state initialization error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    // Subscribe to auth changes
    const unsubscribe = authBridge.subscribeToEvent('AUTH_STATE_CHANGE', (event) => {
      if (event?.type === 'SIGNED_IN' && event.data?.user) {
        const userRoles = event.data.user.app_metadata?.roles || [];
        
        setState({
          user: event.data.user,
          isAuthenticated: true,
          isLoading: false,
          roles: Array.isArray(userRoles) ? userRoles as UserRole[] : [],
        });
      } else if (event?.type === 'SIGNED_OUT') {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          roles: [],
        });
      }
    });

    initAuth();

    return () => {
      unsubscribe();
    };
  }, []);

  // Check if user has a specific role
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    if (!state.roles.length) return false;
    
    // Superadmin has all roles
    if (state.roles.includes('superadmin')) return true;
    
    if (Array.isArray(role)) {
      return role.some(r => state.roles.includes(r));
    }
    
    return state.roles.includes(role);
  }, [state.roles]);

  return {
    ...state,
    hasRole,
  };
}
