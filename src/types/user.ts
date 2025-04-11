
/**
 * Central type definitions for user data
 */

export interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
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
