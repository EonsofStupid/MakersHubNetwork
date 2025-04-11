
/**
 * Centralized auth types
 * 
 * Single source of truth for auth types across the application
 */

// Import and re-export from shared
import { UserRole, AuthStatus } from './shared';
export { UserRole, AuthStatus };

// User profile type
export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

// Auth user type (combined with profile)
export interface AuthUser {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  roles: UserRole[];
  profile?: UserProfile;
  metadata?: Record<string, any>;
}

// Auth context interface
export interface AuthContextType {
  user: unknown | null;
  session: unknown | null;
  profile: UserProfile | null;
  status: AuthStatus;
}

// Auth state interface
export interface AuthState {
  user: unknown | null;
  session: unknown | null;
  profile: UserProfile | null;
  roles: UserRole[];
  status: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

// Auth actions interface
export interface AuthActions {
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  
  setSession: (session: unknown | null) => void;
  setUser: (user: unknown | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setRoles: (roles: UserRole[]) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setStatus: (status: AuthStatus) => void;
  
  initialize: () => Promise<void>;
  loadUserProfile: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Admin access types
export interface AdminAccess {
  isAdmin: boolean;
  hasAdminAccess: boolean;
}

export interface WithAdminAccess {
  hasAdminAccess: boolean;
}
