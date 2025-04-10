
/**
 * shared.ts
 * 
 * Central location for shared type definitions
 */

// Auth related types
export type UserRole = 'super_admin' | 'admin' | 'editor' | 'moderator' | 'builder' | 'maker' | 'viewer' | 'user';
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';
export type AuthProvider = 'email' | 'google' | 'github' | 'twitter' | 'facebook';

// Role constants
export const ROLES = {
  SUPER_ADMIN: 'super_admin' as UserRole,
  ADMIN: 'admin' as UserRole,
  EDITOR: 'editor' as UserRole,
  MODERATOR: 'moderator' as UserRole,
  BUILDER: 'builder' as UserRole,
  MAKER: 'maker' as UserRole,
  VIEWER: 'viewer' as UserRole,
  USER: 'user' as UserRole
} as const;

// Re-export for convenience
export type { PermissionValue } from '@/auth/permissions';

