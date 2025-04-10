
/**
 * Shared auth types
 * 
 * Define types that are shared between the auth module and other modules.
 * These are re-exported from the central auth.types.ts.
 */

// User profile type
export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

// User role enum
export type UserRole = 
  | 'user' 
  | 'admin' 
  | 'super_admin' 
  | 'moderator' 
  | 'editor' 
  | 'viewer' 
  | 'developer';

// Auth user type (combined with profile)
export interface AuthUser {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  roles: UserRole[];
  profile?: UserProfile;
  metadata?: Record<string, any>;
}

