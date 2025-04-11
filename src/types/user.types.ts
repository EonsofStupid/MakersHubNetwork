
import { UserRole } from './shared';

/**
 * Central type definitions for user data throughout the application
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

export interface User {
  id: string;
  email?: string;
  user_metadata?: UserMetadata;
  app_metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

/**
 * Extended user type with additional fields
 */
export interface ExtendedUser extends User {
  role?: UserRole;
  roles?: UserRole[];
  displayName?: string;
  isAnonymous?: boolean;
  permissions?: string[];
  lastLoginAt?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
}

/**
 * User preferences type
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  emailNotifications?: boolean;
  language?: string;
  timezone?: string;
  [key: string]: any;
}
