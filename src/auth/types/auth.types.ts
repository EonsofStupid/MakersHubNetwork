
import { User, UserRole, UserProfile } from '@/shared/types/shared.types';
import { Session } from '@supabase/supabase-js';

// Authentication status
export type AuthStatus = 
  | 'INITIAL'
  | 'LOADING'
  | 'AUTHENTICATED'
  | 'UNAUTHENTICATED'
  | 'ERROR';

// Authentication event types
export type AuthEvent = 
  | 'SIGNED_IN'
  | 'SIGNED_UP'
  | 'SIGNED_OUT'
  | 'PASSWORD_RECOVERY'
  | 'PASSWORD_UPDATED'
  | 'TOKEN_REFRESHED'
  | 'PROFILE_UPDATED'
  | 'SESSION_DELETED'
  | 'USER_UPDATED';

// Authentication event payload
export interface AuthEventPayload {
  user?: User | null;
  session?: Session | null;
  profile?: UserProfile | null;
}

// Auth Bridge API implementation
export interface AuthBridgeImpl {
  // Auth state
  getUser: () => Promise<User | null>;
  getSession: () => Promise<Session | null>;
  getStatus: () => { status: AuthStatus };
  isAuthenticated: () => boolean;
  
  // Sign in methods
  signInWithEmail: (email: string, password: string) => Promise<User | null>;
  signUpWithEmail: (email: string, password: string, metadata?: Record<string, any>) => Promise<User | null>;
  
  // Sign out
  signOut: () => Promise<boolean>;
  
  // User profile
  updateUserProfile: (userId: string, updates: Partial<UserProfile>) => Promise<UserProfile>;
  
  // Password management
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  
  // Roles and permissions
  hasRole: (requiredRole: UserRole | UserRole[]) => () => Promise<boolean>;
  
  // Events
  subscribeToAuthEvents: (callback: (event: string, payload: AuthEventPayload) => void) => () => void;
}

// Re-export needed types for convenience
export type { User, UserRole, UserProfile } from '@/shared/types/shared.types';
