
/**
 * Centralized auth types
 * 
 * Single source of truth for auth types across the application
 */

// Import and re-export from shared
import { UserRole, AuthStatus } from './shared';
export { UserRole, AuthStatus };

// User profile type
export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

// Auth user type (combined with profile)
export interface AuthUser {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  roles: UserRole[];
  profile?: UserProfile;
  metadata?: Record<string, any>;
}

// Re-export any shared types
export * from '@/auth/types/shared';
