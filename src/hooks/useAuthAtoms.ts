
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useAuthStore } from '@/auth/store/auth.store';
import { 
  userAtom, 
  rolesAtom, 
  isAuthenticatedAtom, 
  isAdminAtom,
  hasAdminAccessAtom,
  authStatusAtom 
} from '@/admin/atoms/auth.atoms';
import { subscribeToAuthEvents } from '@/auth/bridge';

/**
 * Hook for syncing auth store with Jotai atoms
 * This keeps UI components reactive to auth changes
 */
export function useAuthAtoms() {
  const [user, setUser] = useAtom(userAtom);
  const [roles, setRoles] = useAtom(rolesAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);
  const [hasAdminAccess, setHasAdminAccess] = useAtom(hasAdminAccessAtom);
  const [authStatus, setAuthStatus] = useAtom(authStatusAtom);
  
  // Sync auth store with atoms
  useEffect(() => {
    const authState = useAuthStore.getState();
    
    // Initial sync with store
    setUser(authState.user);
    setRoles(authState.roles);
    setIsAuthenticated(authState.isAuthenticated);
    setIsAdmin(authState.isAdmin());
    setHasAdminAccess(authState.roles.includes('admin') || authState.roles.includes('super_admin'));
    setAuthStatus(authState.status);
    
    // Subscribe to store changes
    const unsubscribe = useAuthStore.subscribe(
      (state) => {
        setUser(state.user);
        setRoles(state.roles);
        setIsAuthenticated(state.isAuthenticated);
        setIsAdmin(state.isAdmin());
        setHasAdminAccess(state.roles.includes('admin') || state.roles.includes('super_admin'));
        setAuthStatus(state.status);
      }
    );
    
    // Subscribe to auth events 
    const unsubscribeEvents = subscribeToAuthEvents((event) => {
      // Update atoms based on auth events if needed
      if (event.type === 'AUTH_ROLES_UPDATED') {
        const roles = event.payload?.roles || [];
        setRoles(roles);
        setIsAdmin(roles.includes('admin') || roles.includes('super_admin'));
        setHasAdminAccess(roles.includes('admin') || roles.includes('super_admin'));
      }
    });
    
    return () => {
      unsubscribe();
      unsubscribeEvents();
    };
  }, []);
  
  return {
    user,
    roles,
    isAuthenticated,
    isAdmin,
    hasAdminAccess,
    authStatus
  };
}
