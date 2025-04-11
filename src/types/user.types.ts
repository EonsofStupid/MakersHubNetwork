
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
