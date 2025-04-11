
// Basic shared types used across the application

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export type UserRole = 'user' | 'admin' | 'superadmin' | 'moderator' | 'builder';

export type Permission = string;

export interface User {
  id: string;
  email: string;
  user_metadata?: UserMetadata;
  app_metadata?: UserAppMetadata;
  created_at?: string;
  updated_at?: string;
}

export interface UserMetadata {
  name?: string;
  full_name?: string;
  avatar_url?: string;
  [key: string]: any;
}

export interface UserAppMetadata {
  roles?: UserRole[];
  [key: string]: any;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  roles?: UserRole[];
  created_at?: string;
  updated_at?: string;
}
