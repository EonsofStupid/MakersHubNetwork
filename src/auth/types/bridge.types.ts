
/**
 * Bridge interface types for auth module
 * 
 * These types define the communication boundary between the auth module
 * and other parts of the application
 */

import { User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types/shared';
import { UserProfile } from './auth.types';

/**
 * Auth event types for bridge communication
 */
export type AuthEventType = 
  | 'login'
  | 'logout'
  | 'session-refresh'
  | 'user-updated'
  | 'profile-loaded'
  | 'auth-error'
  | 'AUTH_SIGNED_IN'
  | 'AUTH_SIGNED_OUT'
  | 'AUTH_STATE_CHANGE'
  | 'AUTH_ERROR'
  | 'AUTH_SESSION_REFRESHED' 
  | 'AUTH_USER_UPDATED'
  | 'AUTH_TOKEN_REFRESHED'
  | 'AUTH_PERMISSION_CHANGED'
  | 'AUTH_LINKING_REQUIRED';

/**
 * Auth event payload type
 */
export type AuthEventPayload = {
  type: AuthEventType;
  user?: User | null;
  session?: Session | null;
  profile?: UserProfile | null;
  error?: string | Error | null;
  payload?: Record<string, any>;
  [key: string]: any;
};

/**
 * Auth bridge interface
 * This defines the contract for communication with the auth module
 */
export interface IAuthBridge {
  // Authentication status checks
  hasRole: (role: UserRole | UserRole[] | undefined) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isAuthenticated: () => boolean;
  
  // Authentication operations
  signIn: (email: string, password: string) => Promise<{ user: User; session: Session } | { error: Error }>;
  signInWithGoogle: () => Promise<{ user: User; session: Session } | { error: Error }>;
  linkSocialAccount: (provider: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // State management
  setRoles: (roles: UserRole[]) => void;
  setCurrentUser: (user: User | null) => void;
  
  // Event subscription
  subscribe: (event: AuthEventType, listener: (payload: AuthEventPayload) => void) => () => void;
  publish: (event: AuthEventType, payload: Omit<AuthEventPayload, 'type'>) => void;
  
  // Initialization
  initialize: () => boolean;
}
