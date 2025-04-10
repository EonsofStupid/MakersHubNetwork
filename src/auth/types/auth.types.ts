
/**
 * Import and re-export the types from our central shared types
 */
import { UserRole, AuthStatus, AuthProvider, AuthEventType } from '@/types/shared';

export type { UserRole, AuthStatus, AuthProvider, AuthEventType };

/**
 * Auth options interface
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
