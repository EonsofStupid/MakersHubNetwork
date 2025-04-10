
/**
 * shared.ts - Shared types used across the auth module
 * 
 * These types are shared internally within the auth module and exposed
 * to other modules as needed.
 */

// Define common user roles
export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

// Simple user authentication token type
export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

// Define a common user profile type used across the app
export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  username?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  roles: UserRole[];
  created_at: string;
  updated_at: string;
  preferences?: Record<string, any>;
}
