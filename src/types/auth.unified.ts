
/**
 * Unified auth type definitions to resolve import conflicts
 */

// Define the complete set of user roles that includes all possible values
export type UserRole = 
  | 'user' 
  | 'admin' 
  | 'super_admin' 
  | 'moderator' 
  | 'editor'
  | 'maker'
  | 'builder';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  user: any | null;
  session: any | null;
  roles: UserRole[];
  isLoading: boolean;
  error: string | null;
  status: AuthStatus;
  initialized: boolean;
  isAuthenticated: boolean;
}

export interface AuthActions {
  setUser: (user: any | null) => void;
  setSession: (session: any | null) => void;
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

export type AuthStore = AuthState & AuthActions;

// Admin access interfaces
export interface AdminAccess {
  isAdmin: boolean;
  hasAdminAccess: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface WithAdminAccess {
  hasAdminAccess: boolean;
}
