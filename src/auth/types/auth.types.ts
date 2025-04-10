
/**
 * Import and re-export the UserRole from the central roles.ts file
 */
import { UserRole } from './roles';
export { UserRole };

/**
 * Authentication status types
 */
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

/**
 * Login provider types
 */
export type AuthProvider = 'email' | 'google' | 'github' | 'twitter' | 'facebook';

/**
 * Auth event types for event system
 */
export type AuthEventType = 
  'AUTH_STATE_CHANGE' | 
  'AUTH_ERROR' | 
  'AUTH_LINKING_REQUIRED' |
  'AUTH_SIGNED_IN' | 
  'AUTH_SIGNED_OUT' |
  'AUTH_PERMISSION_CHANGED';

/**
 * User authentication options
 */
export interface AuthOptions {
  /**
   * Redirect URL after successful authentication
   */
  redirectTo?: string;
  
  /**
   * Whether to remember the user's session
   */
  rememberMe?: boolean;
  
  /**
   * Data to pass to the authentication provider
   */
  data?: Record<string, any>;
}

/**
 * Auth profile interface
 */
export interface AuthProfile {
  id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
}
