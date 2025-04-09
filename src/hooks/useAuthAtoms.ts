
import { useAtom } from 'jotai';
import { 
  userAtom, 
  rolesAtom, 
  isAuthenticatedAtom, 
  isAdminAtom, 
  hasAdminAccessAtom
} from '@/auth/atoms/auth.atoms';
import { AuthBridge } from '@/auth/bridge';
import { useRef, useEffect } from 'react';

/**
 * Custom hook that provides access to auth state via Jotai atoms
 * This avoids circular dependencies with the useAuth hook
 * Includes initialization guard to prevent infinite loops
 */
export const useAuthAtoms = () => {
  const initialized = useRef(false);

  // Get atoms from Jotai store
  const [user] = useAtom(userAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isAdmin] = useAtom(isAdminAtom);
  const [hasAdminAccess] = useAtom(hasAdminAccessAtom);
  const [roles] = useAtom(rolesAtom);

  // Add guard for initialization
  useEffect(() => {
    if (initialized.current) {
      return; // Prevent multiple initializations
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
