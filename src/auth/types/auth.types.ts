
import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

// Auth status enum
export enum AuthStatus {
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  LOADING = 'loading',
  ERROR = 'error'
}

// Extend the User type from Supabase
export type User = SupabaseUser & {
  profile?: {
    username?: string;
    display_name?: string;
    avatar_url?: string;
    bio?: string;
  }
};

// Export Session for broader usage
export type Session = SupabaseSession;

// User roles
export type UserRole = 
  | 'super_admin'
  | 'admin'
  | 'moderator'
  | 'editor'
  | 'user'
  | string;

// Auth store state interface
export interface AuthState {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  status: AuthStatus;
  error: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialized: boolean;
}

// Auth store methods interface
export interface AuthMethods {
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  initialize: () => Promise<void>;
}

// Complete auth store type
export type AuthStore = AuthState & AuthMethods;
