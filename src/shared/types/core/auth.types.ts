
/**
 * Authentication related types
 */

// Auth status enum - defined as a const object for type safety
export const AUTH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error',
} as const;

export type AuthStatus = typeof AUTH_STATUS[keyof typeof AUTH_STATUS];

// User roles enum - defined as a const object for type safety
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  MODERATOR: 'moderator',
  BUILDER: 'builder',
  GUEST: 'guest'
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// User profile
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  roles?: UserRole[];
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
  bio?: string; // Added based on errors
}

// Auth event types
export enum AuthEventType {
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  USER_UPDATED = 'USER_UPDATED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  PASSWORD_RECOVERY = 'PASSWORD_RECOVERY'
}

// Auth user
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

// Auth credential
export interface AuthCredential {
  providerId: string;
  signInMethod: string;
}

// Auth state
export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  error: Error | null;
  isLoading: boolean;
  profile: UserProfile | null;
  initialized: boolean;
  sessionToken?: string | null;
  refreshToken?: string | null;
}

// Auth provider type
export type AuthProviderType = 'password' | 'google' | 'github' | 'twitter' | 'facebook' | 'phone' | 'anonymous';
