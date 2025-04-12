
// Core shared types used across the application

// Auth-related types
export type UserRole = 'user' | 'admin' | 'super_admin' | 'moderator' | 'editor';

export interface UserProfile {
  id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email?: string;
  profile?: UserProfile;
  roles?: UserRole[];
}

export enum AuthStatus {
  INITIAL = 'INITIAL',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  LOADING = 'LOADING',
  ERROR = 'ERROR'
}

export interface AuthState {
  status: AuthStatus;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AuthEventType = 
  | 'AUTH_STATE_CHANGE'
  | 'AUTH_SIGNIN' 
  | 'AUTH_SIGNOUT' 
  | 'AUTH_ERROR'
  | 'AUTH_SESSION_EXPIRED'
  | 'AUTH_LINKING_REQUIRED';

export interface AuthEvent {
  type: AuthEventType;
  payload?: Record<string, any>;
  timestamp: number;
}
