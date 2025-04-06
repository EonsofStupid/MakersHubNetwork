
// User roles and permissions
export type UserRole = 
  | 'admin'
  | 'super_admin'
  | 'editor'
  | 'moderator'
  | 'user'
  | 'guest'
  | 'maker'; // Added 'maker' role

// Admin access interface
export interface AdminAccess {
  isAdmin: boolean;
  hasAdminAccess: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// User profile minimal type
export interface UserProfile {
  id: string;
  email?: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  roles?: UserRole[];
  last_sign_in_at?: string;
  created_at?: string;
}

// Auth status type
export enum AuthStatus {
  INITIAL = 'initial',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error',
}

// Auth state interface
export interface AuthState {
  status: AuthStatus;
  user: UserProfile | null;
  error: Error | null;
  roles: UserRole[];
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Auth actions interface
export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, username?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Auth store interface
export interface AuthStore extends AuthState, AuthActions {}

// Additional types
export type WithAdminAccess = AdminAccess;
