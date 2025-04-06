
// User roles and permissions
export type UserRole = 
  | 'admin'
  | 'super_admin'
  | 'editor'
  | 'moderator'
  | 'user'
  | 'guest'
  | 'maker'
  | 'builder'; // Added 'builder' role

// Admin access interface
export interface AdminAccess {
  isAdmin: boolean;
  hasAdminAccess: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Extended user metadata type
export interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
  display_name?: string;
  bio?: string;
  theme_preference?: string;
  motion_enabled?: boolean;
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
  user_metadata?: UserMetadata;
}

// Auth status type
export enum AuthStatus {
  INITIAL = 'initial',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error',
  IDLE = 'idle'
}

// Auth state interface
export interface AuthState {
  status: AuthStatus;
  user: UserProfile | null;
  error: Error | null;
  roles: UserRole[];
  isLoading: boolean;
  isAuthenticated: boolean;
  session?: any;
  initialized?: boolean;
}

// Auth actions interface
export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, username?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setUser?: (user: UserProfile | null) => void;
  setSession?: (session: any) => void;
  setRoles?: (roles: UserRole[]) => void;
  setStatus?: (status: AuthStatus) => void;
  setError?: (error: Error | string | null) => void;
  setLoading?: (isLoading: boolean) => void;
  setInitialized?: (initialized: boolean) => void;
  initialize?: () => Promise<void>;
  hasRole?: (role: UserRole) => boolean;
  isAdmin?: () => boolean;
}

// Auth store interface
export interface AuthStore extends AuthState, AuthActions {}

// Additional types
export type WithAdminAccess = AdminAccess;
