
import { useAtomValue } from 'jotai';
import { 
  userAtom, 
  rolesAtom, 
  isAuthenticatedAtom, 
  isAdminAtom, 
  hasAdminAccessAtom,
  hasRoleAtom,
  logoutAtom
} from '@/auth/atoms/auth.store.atoms';
import { AuthBridge } from '@/auth/bridge';
import { useRef } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { UserRole } from '@/types/shared';

/**
 * Custom hook that provides access to auth state via Jotai atoms
 * Use this for components that already use Jotai for other state
 */
export const useAuthAtoms = () => {
  const initialized = useRef(false);

  // Get atoms from Jotai store with proper typing
  const user = useAtomValue(userAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const hasAdminAccess = useAtomValue(hasAdminAccessAtom);
  const roles = useAtomValue(rolesAtom);
  const hasRoleFn = useAtomValue(hasRoleAtom);
  const logout = useAtomValue(logoutAtom);
  
  // Initialize auth store if needed
  if (!initialized.current) {
    const authStore = useAuthStore.getState();
    if (!authStore.initialized) {
      // Use setTimeout to avoid triggering during render
      setTimeout(() => {
        authStore.initialize().catch(err => {
          console.error("Failed to initialize auth store:", err);
        });
      }, 0);
    }
    
    initialized.current = true;
  }
  
  // Return atoms and auth methods from AuthBridge
  return {
    // Atoms 
    user,
    isAuthenticated,
    isAdmin,
    hasAdminAccess,
    roles,
    hasRole: hasRoleFn,
    
    // Auth methods from central AuthBridge
    signIn: AuthBridge.signIn,
    logout, // Now properly typed
  };
};
