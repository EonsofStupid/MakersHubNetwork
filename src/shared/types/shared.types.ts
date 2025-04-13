
/**
 * Core shared types used across the application
 */

/**
 * Role definitions - using enum for strong typing and const object for runtime use
 */
export enum UserRoleEnum {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  MODERATOR = 'moderator',
  BUILDER = 'builder',
  GUEST = 'guest',
}

// Export as const for runtime access
export const ROLES = {
  USER: 'user' as UserRoleEnum.USER,
  ADMIN: 'admin' as UserRoleEnum.ADMIN,
  SUPER_ADMIN: 'super_admin' as UserRoleEnum.SUPER_ADMIN,
  MODERATOR: 'moderator' as UserRoleEnum.MODERATOR,
  BUILDER: 'builder' as UserRoleEnum.BUILDER,
  GUEST: 'guest' as UserRoleEnum.GUEST,
} as const;

// Type alias for UserRole
export type UserRole = typeof ROLES[keyof typeof ROLES];

// Backward compatibility
export { ROLES as UserRoleEnum };
export type UserRoleType = UserRole;

/**
 * Permission definitions
 */
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
  | 'view_analytics';

/**
 * RBAC route policies
 */
export const RBAC_POLICIES: Record<string, UserRole[]> = {
  '/admin': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/admin/users': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/admin/roles': [ROLES.SUPER_ADMIN],
  '/admin/permissions': [ROLES.SUPER_ADMIN],
  '/admin/keys': [ROLES.SUPER_ADMIN],
  '/admin/analytics': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/projects/create': [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/projects/edit': [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/projects/delete': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
};

// Export for use in RBAC system
export const PATH_POLICIES = RBAC_POLICIES;

/**
 * Auth status enum
 */
export enum AUTH_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error',
}

export type AuthStatus = AUTH_STATUS;

/**
 * User profile type
 */
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  user_metadata?: Record<string, unknown>;
  roles?: UserRole[]; // Include roles in the profile for convenience
}

/**
 * Auth Event Type
 */
export enum AuthEventType {
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_OUT = 'SIGNED_OUT',
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',
  USER_UPDATED = 'USER_UPDATED',
  PASSWORD_RECOVERY = 'PASSWORD_RECOVERY',
  USER_DELETED = 'USER_DELETED',
}

/**
 * Log categories - using enum for strong typing
 */
export enum LogCategory {
  APP = 'app',
  AUTH = 'auth',
  RBAC = 'rbac',
  API = 'api',
  UI = 'ui',
  SYSTEM = 'system',
  ADMIN = 'admin',
  CHAT = 'chat',
}

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
  TRACE = 'trace',
  SUCCESS = 'success',
  FATAL = 'fatal',
  SILENT = 'silent',
}

// Log level values for sorting/filtering
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.TRACE]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.SUCCESS]: 3,
  [LogLevel.WARN]: 4,
  [LogLevel.ERROR]: 5,
  [LogLevel.CRITICAL]: 6,
  [LogLevel.FATAL]: 7,
  [LogLevel.SILENT]: 8,
};

/**
 * Log entry interface
 */
export interface LogDetails {
  source?: string;
  [key: string]: any;
}

export interface LogEntry {
  id: string;
  level: LogLevel;
  category: LogCategory;
  message: string | Record<string, unknown>;
  details?: LogDetails;
  timestamp: string;
  source: string;
}

export interface LogEvent {
  entry: LogEntry;
  type?: string;
}

export interface LogFilter {
  level?: LogLevel;
  category?: LogCategory;
  source?: string;
  search?: string;
}

/**
 * Theme log details
 */
export interface ThemeLogDetails extends LogDetails {
  themeName?: string;
  cssVarsCount?: number;
  error?: string;
  [key: string]: any;
}

/**
 * Build status, types for build system
 */
export enum BuildStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface BuildPart {
  id: string;
  name: string;
  quantity: number;
}

export interface BuildMod {
  id: string;
  name: string;
  complexity: number;
}

export interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

// Base entity for shared types
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// User interface
export interface User {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// RBAC helper
export const RBAC = {
  superAdmins: [ROLES.SUPER_ADMIN],
  admins: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  moderators: [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  builders: [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  normalUsers: [ROLES.USER, ROLES.BUILDER, ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  guests: [ROLES.GUEST],
};

// Theme related types
export enum ThemeContext {
  SITE = 'site',
  ADMIN = 'admin',
  CHAT = 'chat',
}

export enum ThemeStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  ACTIVE = 'active',
}

// Make TS aware this is a module
export const __SHARED_TYPES__ = true;
