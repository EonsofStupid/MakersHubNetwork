
/**
 * Core type definitions
 */

// Role definitions as const enum
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  MODERATOR: 'moderator',
  BUILDER: 'builder',
  GUEST: 'guest'
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// User Profile
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  roles?: UserRole[];
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

// Auth status
export const AUTH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error',
} as const;

export type AuthStatus = typeof AUTH_STATUS[keyof typeof AUTH_STATUS];

// Log categories
export enum LogCategory {
  AUTH = 'auth',
  RBAC = 'rbac',
  API = 'api',
  UI = 'ui',
  SYSTEM = 'system',
  APP = 'app',
  ADMIN = 'admin',
  CHAT = 'chat',
  THEME = 'theme'
}

// Log levels  
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

// Core permission type
export type Permission =
  | 'create_project'
  | 'edit_project'
  | 'delete_project'
  | 'submit_build'
  | 'access_admin'
  | 'manage_api_keys'
  | 'manage_users'
  | 'manage_roles'
  | 'manage_permissions'
  | 'view_analytics'
  | 'admin:view'
  | 'admin:edit'
  | 'admin:delete'
  | 'user:view'
  | 'user:edit'
  | 'user:delete'
  | 'content:view'
  | 'content:edit'
  | 'content:delete'
  | 'settings:view'
  | 'settings:edit';

