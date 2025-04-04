
import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

// Auth status enum as const
export const AuthStatus = {
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  LOADING: 'LOADING',
  ERROR: 'ERROR'
} as const;

export type AuthStatus = typeof AuthStatus[keyof typeof AuthStatus];

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
export const UserRole = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  EDITOR: 'editor',
  USER: 'user'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole] | string;

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
  signIn?: (email: string, password: string) => Promise<boolean>;
  signOut?: () => Promise<boolean>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

// Complete auth store type
export type AuthStore = AuthState & AuthMethods;
