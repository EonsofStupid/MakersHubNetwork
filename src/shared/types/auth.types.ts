
import { User } from '@supabase/supabase-js';

/**
 * User roles in the application
 */
export type UserRole = 'user' | 'admin' | 'super_admin' | 'maker' | 'editor' | 'moderator';

/**
 * User permissions in the application
 */
export type Permission = 
  | 'read:users' 
  | 'write:users' 
  | 'delete:users'
  | 'read:content' 
  | 'write:content' 
  | 'delete:content'
  | 'read:builds' 
  | 'approve:builds' 
  | 'reject:builds'
  | 'manage:settings' 
  | 'view:admin' 
  | 'manage:admin';

/**
 * User profile data structure
 */
export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
}

/**
 * Auth state interface
 */
export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  isReady: boolean;
  error: string | null;
}

/**
 * Auth event types for bridge communication
 */
export type AuthEventType = 
  | 'SIGNED_IN' 
  | 'SIGNED_OUT' 
  | 'USER_UPDATED' 
  | 'PASSWORD_RECOVERY' 
  | 'TOKEN_REFRESHED'
  | 'PROFILE_FETCHED'
  | 'PROFILE_UPDATED'
  | 'SESSION_EXPIRED';
  
/**
 * Auth event payload
 */
export interface AuthEvent {
  type: AuthEventType;
  payload?: any;
}

/**
 * Auth event handler type
 */
export type AuthEventHandler = (event: AuthEvent) => void;
