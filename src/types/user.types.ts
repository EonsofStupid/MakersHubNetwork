
/**
 * User types definitions
 */

// Basic user type
export interface User {
  id: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  isAnonymous?: boolean;
  emailVerified?: boolean;
}

// User profile extends user with additional information
export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  theme_preference?: string;
  motion_enabled?: boolean;
}

// User metadata for storage in auth providers
export interface UserMetadata {
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  theme_preference?: string;
  motion_enabled?: boolean;
}

// User role types
export type UserRole = 
  | 'user'
  | 'admin'
  | 'super_admin'
  | 'editor'
  | 'content_manager'
  | 'designer'
  | 'support'
  | 'moderator'
  | 'guest';
