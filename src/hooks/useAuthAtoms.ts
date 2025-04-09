
import { useAtom } from 'jotai';
import { 
  userAtom, 
  rolesAtom, 
  isAuthenticatedAtom, 
  isAdminAtom, 
  hasAdminAccessAtom, 
  AuthBridge 
} from '@/auth/bridge';
import { UserRole } from '@/types/auth.types';
import { User } from '@supabase/supabase-js';

// Define AuthUser type locally to avoid import issues
interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

/**
 * Custom hook that provides access to auth state via Jotai atoms
 * This avoids circular dependencies with the useAuth hook
 */
export const useAuthAtoms = () => {
  // Get atoms from Jotai store
  const [user] = useAtom(userAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isAdmin] = useAtom(isAdminAtom);
  const [hasAdminAccess] = useAtom(hasAdminAccessAtom);
  const [roles] = useAtom(rolesAtom);
  
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
