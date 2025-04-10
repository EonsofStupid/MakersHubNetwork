/**
 * shared.ts
 * 
 * Central location for shared type definitions used across the application.
 * These types ensure consistency between Zustand stores and Jotai atoms.
 */

// Auth related types
export type UserRole = 'super_admin' | 'admin' | 'editor' | 'moderator' | 'builder' | 'maker' | 'viewer' | 'user';
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';
export type AuthProvider = 'email' | 'google' | 'github' | 'twitter' | 'facebook';

// Auth event system types
export type AuthEventType = 
  'AUTH_STATE_CHANGE' | 
  'AUTH_ERROR' | 
  'AUTH_LINKING_REQUIRED' |
  'AUTH_SIGNED_IN' | 
  'AUTH_SIGNED_OUT' |
  'AUTH_PERMISSION_CHANGED';

// Bridge names for debugging and logging
export type BridgeName = 'AuthBridge' | 'ChatBridge' | 'ThemeBridge' | 'LogBridge';

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

// Permission types
export type PermissionValue = string;

// Bridge interfaces
export interface IAuthBridge {
  getUser: () => any;
  getRoles: () => UserRole[];
  isAuthenticated: () => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  logout: () => Promise<any>;
  linkSocialAccount: (provider: string) => Promise<any>;
}
