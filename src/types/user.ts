
import { UserRole } from './shared';
import { UserMetadata } from './user.types';

/**
 * Core User type definition
 * This is the central user type used throughout the application
 */
export interface User {
  id: string;
  email?: string;
  user_metadata?: UserMetadata;
  app_metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  role?: UserRole;
  roles?: UserRole[];
  displayName?: string;
  isAnonymous?: boolean;
  permissions?: string[];
  lastLoginAt?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  [key: string]: any;
}

/**
 * Basic user profile information
 */
export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Preferences for user configuration
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  emailNotifications?: boolean;
  language?: string;
  timezone?: string;
  [key: string]: any;
}
