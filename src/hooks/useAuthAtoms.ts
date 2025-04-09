
import { useAtomValue } from 'jotai';
import { 
  userAtom, 
  rolesAtom, 
  isAuthenticatedAtom, 
  isAdminAtom, 
  hasAdminAccessAtom
} from '@/auth/atoms/auth.atoms';
import { AuthBridge } from '@/auth/bridge';
import { useRef, useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';

/**
 * Custom hook that provides access to auth state via Jotai atoms
 * This avoids circular dependencies with the useAuth hook
 * Includes initialization guard to prevent infinite loops
 */
export const useAuthAtoms = () => {
  const initialized = useRef(false);

  // Get atoms from Jotai store
  const user = useAtomValue(userAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const hasAdminAccess = useAtomValue(hasAdminAccessAtom);
  const roles = useAtomValue(rolesAtom);
  
  // Initialize auth store if needed
  useEffect(() => {
    if (initialized.current) {
      return; // Prevent multiple initializations
    }
    
    const authStore = useAuthStore.getState();
    if (!authStore.initialized) {
      authStore.initialize().catch(err => {
        console.error("Failed to initialize auth store:", err);
      });
    }
    
    initialized.current = true;
  }, []);
  
  // Return atoms and auth methods from AuthBridge
  return {
    // Atoms
    user,
    isAuthenticated,
    isAdmin,
    hasAdminAccess,
    roles,
    
    // Auth methods from central AuthBridge
    signIn: AuthBridge.signIn,
    logout: AuthBridge.logout,
  };
};
