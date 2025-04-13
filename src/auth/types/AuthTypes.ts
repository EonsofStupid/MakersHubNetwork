import { AuthStatus, UserRole, UserProfile as SharedUserProfile, UserRoleEnum, User, AuthEvent as SharedAuthEvent, AuthEventType as SharedAuthEventType } from '@/shared/types/SharedTypes';

// Re-export shared types
export { AuthStatus, UserRoleEnum };
export type { User, UserRole };

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

// Authentication event types - extend shared enum
export const AuthEventType = {
  ...SharedAuthEventType,
  PASSWORD_RESET: 'PASSWORD_RESET',
  MFA_CHALLENGE: 'MFA_CHALLENGE',
  MFA_VERIFIED: 'MFA_VERIFIED'
} as const;

export type AuthEventType = typeof AuthEventType[keyof typeof AuthEventType];

// Auth event payload interface
export interface AuthEvent extends Omit<SharedAuthEvent, 'type'> {
  type: AuthEventType;
  user: UserProfile | null;
  metadata?: Record<string, unknown>;
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
  signUp: (credentials: { email: string; password: string; options?: Record<string, unknown> }) => Promise<void>;
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