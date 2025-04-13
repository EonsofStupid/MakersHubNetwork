
import { AuthStatus, UserRole, UserProfile as SharedUserProfile, UserRoleEnum } from '@/shared/types/shared.types';

// Re-export AuthStatus for consistency
export { AuthStatus, UserRoleEnum };
export type { UserRole };

// UserProfile with auth-specific fields
export interface UserProfile extends SharedUserProfile {
  motion_enabled: boolean; // Make this required for auth
}

// Session types
export interface AuthSession {
  id: string;
  user_id: string;
  created_at: string;
  expires_at?: string;
  last_active_at?: string;
}

// Authentication event types
export enum AuthEventType {
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_OUT = 'SIGNED_OUT',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  PASSWORD_RECOVERY = 'PASSWORD_RECOVERY',
  PASSWORD_RESET = 'PASSWORD_RESET',
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',
  MFA_CHALLENGE = 'MFA_CHALLENGE',
  MFA_VERIFIED = 'MFA_VERIFIED'
}

// Auth event payload interface
export interface AuthEvent {
  type: AuthEventType;
  user: UserProfile | null;
  metadata?: Record<string, any>;
}

// Auth provider option
export type AuthProvider = 'google' | 'github' | 'facebook' | 'twitter' | 'apple';

// Auth bridge interface
export interface IAuthBridge {
  // Session management
  getCurrentSession: () => Promise<AuthSession | null>;
  refreshSession: () => Promise<AuthSession | null>;
  
  // Authentication methods
  signInWithEmail: (credentials: { email: string; password: string }) => Promise<void>;
  signInWithOAuth: (provider: string) => Promise<void>;
  signUp: (credentials: { email: string; password: string; options?: any }) => Promise<void>;
  signOut: () => Promise<void>;
  
  // User management
  getUserProfile: () => Promise<UserProfile | null>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<UserProfile>;
  
  // Password management
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  
  // Event subscription
  subscribeToAuthEvents: (callback: (event: AuthEvent) => void) => () => void;
  
  // Role checking helpers
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}
