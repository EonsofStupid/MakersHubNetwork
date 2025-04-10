
/**
 * Centralized auth types
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

// Auth state type
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

// Re-export any shared types
export * from '@/auth/types/shared';

