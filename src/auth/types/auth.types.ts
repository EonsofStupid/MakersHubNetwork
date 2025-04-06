
import { Session, User } from '@supabase/supabase-js';

// Define user roles for the application
export type UserRole = 
  | 'super_admin'  // Changed from 'superadmin' to 'super_admin' for consistency
  | 'admin'
  | 'maker'
  | 'builder'
  | 'user'
  | 'moderator'
  | 'editor'
  | 'service';

// Auth event types
export type AuthEventType =
  | 'AUTH_SIGNED_IN'
  | 'AUTH_SIGNED_OUT'
  | 'AUTH_USER_UPDATED'
  | 'AUTH_SESSION_REFRESHED'
  | 'AUTH_ERROR';

// Auth event interface
export interface AuthEvent {
  type: AuthEventType;
  payload?: unknown;
}

// Auth listener function type
export type AuthEventListener = (event: AuthEvent) => void;

// User profile interface
export interface UserProfile {
  id: string;
  user_id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

// Extended user interface with roles and profile
export interface AppUser {
  id: string;
  email: string;
  roles: UserRole[];
  profile?: UserProfile;
  metadata?: Record<string, unknown>;
}

// Auth state interface for auth context
export interface AuthState {
  user: AppUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

// Auth context interface
export interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signInWithProvider: (provider: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}
