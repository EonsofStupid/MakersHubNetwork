
/**
 * Core user types for the application
 * These are exported from types/user.ts and should be used throughout the application
 */

export interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
  display_name?: string;
  bio?: string;
  theme_preference?: string;
  motion_enabled?: boolean;
  [key: string]: any;
}

// For backward compatibility - the main User type is now in src/types/user.ts
export type { User, UserProfile, UserPreferences } from './user';

// Re-export the User interface for direct access
export interface User {
  id: string;
  email?: string;
  user_metadata?: UserMetadata;
  app_metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  role?: string;
  roles?: string[];
  displayName?: string;
  isAnonymous?: boolean;
  permissions?: string[];
  lastLoginAt?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  [key: string]: any;
}
