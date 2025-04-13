
import { UserRole, ROLES } from '@/shared/types/shared.types';

/**
 * Re-export the UserRole type for backward compatibility
 */
export type { UserRole };
export { ROLES };

/**
 * Auth user type
 */
export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  isAnonymous?: boolean;
  tenantId?: string;
  metadata?: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

/**
 * Auth provider types
 */
export type AuthProviderType = 'password' | 'google' | 'github' | 'twitter' | 'facebook' | 'phone' | 'anonymous';

/**
 * Auth credential type
 */
export interface AuthCredential {
  providerId: string;
  signInMethod: string;
}

/**
 * Auth state type
 */
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';
  error: Error | null;
  roles?: string[];
  isLoading?: boolean;
  profile?: any;
}

/**
 * Auth permission type
 */
export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export * from '@/shared/types/shared.types';
