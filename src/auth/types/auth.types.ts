
import { UserRole } from '@/shared/types/shared.types';

/**
 * Authentication status enum
 */
export enum AUTH_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error'
}

export type AuthStatus = AUTH_STATUS;

/**
 * User profile interface
 */
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  bio?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
  roles?: UserRole[];
}

/**
 * Authentication state interface
 */
export interface AuthState {
  // State
  user: UserProfile | null;
  profile: UserProfile | null;
  status: AuthStatus;
  error: Error | null;
  isAuthenticated: boolean;
  initialized: boolean;
  isLoading: boolean;
  roles: UserRole[];
  
  // Auth actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile?: (profile: Partial<UserProfile>) => Promise<void>;
}
