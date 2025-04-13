
/**
 * Role definitions
 */
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superadmin', // This is the official spelling
  MODERATOR: 'moderator',
  BUILDER: 'builder',
  GUEST: 'guest'
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

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

// Convenience access patterns for role groups
export const RBAC = {
  adminOnly: [ROLES.ADMIN, ROLES.SUPER_ADMIN] as const,
  superAdmins: [ROLES.SUPER_ADMIN] as const,
  moderators: [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN] as const,
  builders: [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN] as const,
  authenticated: [ROLES.USER, ROLES.MODERATOR, ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN] as const,
};

// Define path policies
export const PATH_POLICIES: Record<string, UserRole[]> = {
  '/admin': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/admin/users': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/admin/settings': [ROLES.SUPER_ADMIN],
};

/**
 * Auth status types
 */
export const AUTH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error',
} as const;

export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];

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
}

/**
 * Log categories
 */
export const LOG_CATEGORY = {
  AUTH: 'auth',
  RBAC: 'rbac',
  API: 'api',
  UI: 'ui',
  SYSTEM: 'system',
  ADMIN: 'admin',
} as const;

export type LogCategory = (typeof LOG_CATEGORY)[keyof typeof LOG_CATEGORY];

/**
 * Log levels
 */
export const LOG_LEVEL = {
  TRACE: 'trace',
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
  SUCCESS: 'success'
} as const;

export type LogLevel = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL];

/**
 * Log level values for comparison
 */
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
  success: 35
};

/**
 * Log details interface
 */
export interface LogDetails {
  message?: string;
  details?: Record<string, unknown>;
  timestamp?: string;
  [key: string]: unknown;
}

/**
 * Log entry interface
 */
export interface LogEntry {
  id: string;
  level: LogLevel;
  category: LogCategory;
  message: string | Record<string, unknown>;
  details?: Record<string, unknown>;
  timestamp: string;
  source: string;
}

/**
 * Log event interface
 */
export interface LogEvent {
  entry: LogEntry;
}

/**
 * Log filter interface
 */
export interface LogFilter {
  level?: LogLevel | LogLevel[];
  category?: LogCategory | LogCategory[];
  source?: string | string[];
  search?: string;
  from?: Date;
  to?: Date;
}

/**
 * Auth event types
 */
export const AUTH_EVENT_TYPE = {
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
  PASSWORD_RECOVERY: 'PASSWORD_RECOVERY',
  TOKEN_REFRESHED: 'TOKEN_REFRESHED',
  USER_UPDATED: 'USER_UPDATED',
  USER_DELETED: 'USER_DELETED'
} as const;

export type AuthEventType = (typeof AUTH_EVENT_TYPE)[keyof typeof AUTH_EVENT_TYPE];

/**
 * Base entity for database models
 */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

/**
 * User type  
 */
export interface User extends BaseEntity {
  email: string;
  name?: string;
  avatar_url?: string;
  last_sign_in_at?: string; 
  user_metadata?: Record<string, unknown>;
}

/**
 * Build status types
 */
export const BUILD_STATUS = {
  PENDING: 'pending',
  BUILDING: 'building',
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const;

export type BuildStatus = (typeof BUILD_STATUS)[keyof typeof BUILD_STATUS];

/**
 * Build part type
 */
export interface BuildPart {
  id: string;
  name: string;
  type: string;
  status: BuildStatus;
}

/**
 * Build mod type
 */
export interface BuildMod {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
}

/**
 * User info type
 */
export interface UserInfo {
  id: string;
  email: string;
  name?: string;
}

/**
 * Theme types
 */

export interface ThemeContext {
  tokens: Record<string, any>;
  components: Record<string, any>;
}

export const THEME_STATUS = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error'
} as const;

export type ThemeStatus = (typeof THEME_STATUS)[keyof typeof THEME_STATUS];

export interface ThemeLogDetails extends LogDetails {
  tokenName?: string;
  componentName?: string;
  themeName?: string;
}
