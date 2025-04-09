
// Re-export atoms from auth bridge for backward compatibility
import { 
  userAtom, 
  rolesAtom, 
  isAuthenticatedAtom, 
  isAdminAtom, 
  hasAdminAccessAtom 
} from '@/auth/bridge';

// Auth status type definition
export type AuthStatusType = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

// Derived atoms - re-export from bridge for backward compatibility
export { 
  userAtom, 
  rolesAtom, 
  isAuthenticatedAtom, 
  isAdminAtom, 
  hasAdminAccessAtom 
};

// Auth status atom (legacy)
export { isAuthenticatedAtom as authStatusAtom };
