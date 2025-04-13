
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

export type UserRole = typeof ROLES[keyof typeof ROLES];

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
  roles?: UserRole[];
}

// User type for backward compatibility
export interface User extends UserProfile {
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
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

// For backward compatibility
export const LOG_CATEGORY = {
  AUTH: LogCategory.AUTH,
  RBAC: LogCategory.RBAC,
  API: LogCategory.API,
  UI: LogCategory.UI,
  SYSTEM: LogCategory.SYSTEM,
  APP: LogCategory.APP,
  CHAT: LogCategory.CHAT,
  ADMIN: LogCategory.ADMIN,
} as const;

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
}

// For backward compatibility
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.TRACE]: 0,
  [LogLevel.DEBUG]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.SUCCESS]: 3,
  [LogLevel.WARN]: 4,
  [LogLevel.ERROR]: 5,
  [LogLevel.FATAL]: 6,
  [LogLevel.CRITICAL]: 7,
};

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
 * Log details interface
 */
export interface LogDetails {
  details?: Record<string, any>;
  tags?: string[];
  source?: string;
  userId?: string;
  email?: string;
  error?: string | Error;
  message?: string;
}

/**
 * Log filter interface
 */
export interface LogFilter {
  level?: LogLevel;
  category?: LogCategory;
  source?: string;
  search?: string;
  from?: Date;
  to?: Date;
}

/**
 * Auth event type
 */
export enum AuthEventType {
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_OUT = 'SIGNED_OUT',
  USER_UPDATED = 'USER_UPDATED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  PASSWORD_RECOVERY = 'PASSWORD_RECOVERY',
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',
  SESSION_DELETED = 'SESSION_DELETED',
}

/**
 * Build status
 */
export enum BuildStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELED = 'canceled',
}

/**
 * Build part
 */
export enum BuildPart {
  ENGINE = 'engine',
  CHASSIS = 'chassis',
  BODY = 'body',
  ELECTRONICS = 'electronics',
  INTERIOR = 'interior',
}

/**
 * Build mod
 */
export enum BuildMod {
  STANDARD = 'standard',
  PERFORMANCE = 'performance',
  LUXURY = 'luxury',
  OFFROAD = 'offroad',
  RACING = 'racing',
}

/**
 * User info
 */
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
}

/**
 * Base entity
 */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
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
  superAdmins: [ROLES.SUPER_ADMIN],
  admins: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  moderators: [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  builders: [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  users: [ROLES.USER, ROLES.BUILDER, ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  guests: [ROLES.GUEST],
};

// Path policies for backward compatibility
export const PATH_POLICIES = RBAC_POLICIES;
