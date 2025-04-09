
// Re-export atoms from central source of truth for backward compatibility
import { 
  userAtom, 
  rolesAtom, 
  isAuthenticatedAtom, 
  isAdminAtom, 
  hasAdminAccessAtom,
  userNameAtom,
  userAvatarAtom,
  AuthStatusType
} from '@/auth/atoms/auth.atoms';

// Export all atoms from the central source of truth
export { 
  userAtom, 
  rolesAtom, 
  isAuthenticatedAtom, 
  isAdminAtom, 
  hasAdminAccessAtom,
  userNameAtom,
  userAvatarAtom
};

// Re-export type definitions for backward compatibility
export { AuthStatusType };

// Auth status atom (legacy)
export { isAuthenticatedAtom as authStatusAtom };
