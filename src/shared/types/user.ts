
export interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
  [key: string]: any;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  user_metadata?: UserMetadata;
  app_metadata?: {
    roles?: string[];
    [key: string]: any;
  };
  displayName?: string; // Add for compatibility
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  banned_until?: string;
  aud: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  social_links?: Record<string, string>;
  preferences?: Record<string, any>;
  roles?: UserRole[];
  created_at?: string;
  updated_at?: string;
}

export type UserRole = 'user' | 'admin' | 'superadmin' | 'moderator' | 'builder';

export type Permission = string;
