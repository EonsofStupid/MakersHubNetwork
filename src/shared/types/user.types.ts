
import { UserRole } from './auth.types';

/**
 * User profile and metadata types
 */

/**
 * User metadata that can be stored in Supabase auth.user_metadata
 */
export interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
  username?: string;
  bio?: string;
  website?: string;
  location?: string;
  role?: UserRole;
  provider?: string;
}

/**
 * User settings for application preferences
 */
export interface UserSettings {
  userId: string;
  notifications: NotificationPreferences;
  appearance: AppearancePreferences;
  privacy: PrivacyPreferences;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  marketing: boolean;
  newsletter: boolean;
}

/**
 * Appearance preferences
 */
export interface AppearancePreferences {
  theme: string;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
}

/**
 * Privacy preferences
 */
export interface PrivacyPreferences {
  publicProfile: boolean;
  showActivity: boolean;
  allowDataCollection: boolean;
}

/**
 * User activity types
 */
export type UserActivityType = 
  | 'login' 
  | 'signup' 
  | 'profile_update' 
  | 'content_create' 
  | 'content_update'
  | 'comment'
  | 'build_submit'
  | 'build_approve'
  | 'build_reject';

/**
 * User activity record
 */
export interface UserActivity {
  id: string;
  userId: string;
  type: UserActivityType;
  details?: Record<string, any>;
  createdAt: string;
}
