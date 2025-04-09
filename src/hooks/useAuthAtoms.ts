
import { useAtom } from 'jotai';
import { userAtom, isAuthenticatedAtom, isAdminAtom, hasAdminAccessAtom, rolesAtom } from '@/admin/atoms/auth.atoms';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth.types';
import { AuthUser } from '@/hooks/useAuth';

/**
 * Custom hook that combines Jotai atoms for auth state with the useAuth hook
 * This provides a unified interface for auth-related functionality
 */
export const useAuthAtoms = () => {
  // Get atoms from Jotai store
  const [user] = useAtom(userAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isAdmin] = useAtom(isAdminAtom);
  const [hasAdminAccess] = useAtom(hasAdminAccessAtom);
  const [roles] = useAtom(rolesAtom);
  
  // Get additional auth functionality from useAuth
  const auth = useAuth();
  
  return {
    // Atoms
    user,
    isAuthenticated,
    isAdmin,
    hasAdminAccess,
    roles,
    
    // Direct auth methods
    // Use the methods that actually exist in useAuth
    signIn: auth.signIn || (() => Promise.resolve({ id: '' })), // Fallback if signIn doesn't exist
    logout: auth.logout, // Use the logout method that exists
  };
};
