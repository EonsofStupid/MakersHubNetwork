
/**
 * Shared type definitions used across the application
 */

// User role types
export type UserRole = 
  | 'user'
  | 'admin'
  | 'superadmin'
  | 'moderator'
  | 'builder';

// Authentication status
export type AuthStatus = 
  | 'idle' 
  | 'loading' 
  | 'authenticated' 
  | 'unauthenticated' 
  | 'error';

// Authentication event types
export type AuthEventType = 
  | 'SIGNED_IN' 
  | 'SIGNED_OUT' 
  | 'USER_UPDATED' 
  | 'PASSWORD_RECOVERY'
  | 'PROFILE_FETCHED';

// Role constants
export const ROLES = {
  SUPERADMIN: 'superadmin' as UserRole,
  ADMIN: 'admin' as UserRole,
  MODERATOR: 'moderator' as UserRole,
  BUILDER: 'builder' as UserRole,
  USER: 'user' as UserRole
} as const;
