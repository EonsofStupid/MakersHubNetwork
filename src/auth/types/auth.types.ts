
import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

// Auth status as const object with derived type
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

// User roles as const object with derived type
export const UserRole = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  EDITOR: 'editor',
  MAKER: 'maker',
  BUILDER: 'builder',
  VIEWER: 'viewer',
  USER: 'user',
  MODERATOR: 'moderator'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

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

// Admin access types
export interface AdminAccess {
  isAdmin: boolean;
  hasAdminAccess: boolean;
}

export interface WithAdminAccess {
  hasAdminAccess: boolean;
}

// Auth store methods interface
export interface AuthMethods {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setRoles: (roles: UserRole[]) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setStatus: (status: AuthStatus) => void;
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

// Complete auth store type
export type AuthStore = AuthState & AuthMethods;
