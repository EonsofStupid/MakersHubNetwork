
/**
 * Role definitions
 */
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superadmin',
  MODERATOR: 'moderator',
  BUILDER: 'builder',
  GUEST: 'guest',
} as const;

export type UserRole = 'user' | 'admin' | 'superadmin' | 'moderator' | 'builder' | 'guest';

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
  '/admin': ['admin', 'superadmin'],
  '/admin/users': ['admin', 'superadmin'],
  '/admin/roles': ['superadmin'],
  '/admin/permissions': ['superadmin'],
  '/admin/keys': ['superadmin'],
  '/admin/analytics': ['admin', 'superadmin'],
  '/projects/create': ['builder', 'admin', 'superadmin'],
  '/projects/edit': ['builder', 'admin', 'superadmin'],
  '/projects/delete': ['admin', 'superadmin'],
};

/**
 * Auth status types
 */
export enum AuthStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error',
}

// For backward compatibility
export const AUTH_STATUS = {
  IDLE: AuthStatus.IDLE,
  LOADING: AuthStatus.LOADING,
  AUTHENTICATED: AuthStatus.AUTHENTICATED,
  UNAUTHENTICATED: AuthStatus.UNAUTHENTICATED,
  ERROR: AuthStatus.ERROR,
} as const;

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
  app_metadata?: Record<string, unknown>;
  display_name?: string;
  bio?: string;
  location?: string;
  website?: string;
  theme_preference?: string;
  motion_enabled?: boolean;
}

/**
 * Log categories
 */
export enum LogCategory {
  AUTH = 'auth',
  RBAC = 'rbac',
  API = 'api',
  UI = 'ui',
  APP = 'app',
  SYSTEM = 'system',
  CHAT = 'chat',
  ADMIN = 'admin',
}

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  SUCCESS = 'success',
  TRACE = 'trace',
  FATAL = 'fatal',
  CRITICAL = 'critical',
  SILENT = 'silent',
}

/**
 * Log entry interface
 */
export interface LogEntry {
  id?: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  timestamp: Date;
  source?: string;
  details?: Record<string, any>;
  tags?: string[];
}

/**
 * Log event interface
 */
export interface LogEvent {
  entry: LogEntry;
}

/**
 * Theme context
 */
export enum ThemeContext {
  SITE = 'site',
  ADMIN = 'admin',
  APP = 'app',
}

/**
 * Theme status
 */
export enum ThemeStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
}

/**
 * Theme log details
 */
export interface ThemeLogDetails {
  themeId: string;
  userId?: string;
  action: string;
  component?: string;
  previousValue?: any;
  newValue?: any;
  timestamp: Date;
}

// RBAC helpers for backward compatibility
export const RBAC = {
  roles: ROLES,
  superAdmins: ['superadmin'] as UserRole[],
  admins: ['admin', 'superadmin'] as UserRole[],
  moderators: ['moderator', 'admin', 'superadmin'] as UserRole[],
  builders: ['builder', 'admin', 'superadmin'] as UserRole[],
  users: ['user', 'builder', 'moderator', 'admin', 'superadmin'] as UserRole[],
  guests: ['guest'] as UserRole[],
  authenticated: ['user', 'builder', 'moderator', 'admin', 'superadmin'] as UserRole[],
  adminOnly: ['admin', 'superadmin'] as UserRole[],
};

// Path policies for backward compatibility
export const PATH_POLICIES = RBAC_POLICIES;
