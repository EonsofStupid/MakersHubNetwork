
import { useAtom } from 'jotai';
import { userAtom, isAuthenticatedAtom, isAdminAtom, hasAdminAccessAtom, rolesAtom } from '@/admin/atoms/auth.atoms';
import { useAuth } from '@/hooks/useAuth';
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
  
  // Create a signIn method that matches expected signature
  const signIn = async (email: string, password: string): Promise<AuthUser> => {
    // Use browser mock authentication - in real app this would call an auth API
    const mockUser: AuthUser = {
      id: '123456',
      email: email,
      user_metadata: {
        full_name: 'Cyber User',
        avatar_url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + email,
      },
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('impulse_user', JSON.stringify(mockUser));
    
    // Return the mock user
    return mockUser;
  };
  
  return {
    // Atoms
    user,
    isAuthenticated,
    isAdmin,
    hasAdminAccess,
    roles,
    
    // Auth methods - ensure compatibility with both auth systems
    signIn,
    logout: auth.logout,
  };
};
