
/**
 * Role definitions
 */
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  MODERATOR: 'moderator',
  BUILDER: 'builder',
  GUEST: 'guest',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

/**
 * RBAC constants for role-based access control groups
 */
export const RBAC = {
  AUTHENTICATED: [ROLES.USER, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MODERATOR, ROLES.BUILDER],
  ADMIN_ONLY: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  SUPER_ADMINS: [ROLES.SUPER_ADMIN],
  MODERATORS: [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  BUILDERS: [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN]
};

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
  roles?: UserRole[];
  bio?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

/**
 * User type (for compatibility)
 */
export interface User extends UserProfile {}

/**
 * Log categories
 */
export enum LogCategory {
  AUTH = 'auth',
  RBAC = 'rbac',
  API = 'api',
  UI = 'ui',
  SYSTEM = 'system',
  CHAT = 'chat',
  THEME = 'theme',
  DEBUG = 'debug',
  ADMIN = 'admin',
  APP = 'app'
}

/**
 * Log levels
 */
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  SUCCESS = 'success',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
  CRITICAL = 'critical',
  SILENT = 'silent'
}

/**
 * Log level values for comparing severity
 */
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.TRACE]: 0,
  [LogLevel.DEBUG]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.SUCCESS]: 3,
  [LogLevel.WARN]: 4,
  [LogLevel.ERROR]: 5,
  [LogLevel.FATAL]: 6,
  [LogLevel.CRITICAL]: 7,
  [LogLevel.SILENT]: 8,
};

/**
 * Auth event types
 */
export enum AuthEventType {
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_OUT = 'SIGNED_OUT',
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',
  PASSWORD_RECOVERY = 'PASSWORD_RECOVERY',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
}

/**
 * Log entry interface
 */
export interface LogEntry {
  id: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  timestamp: Date;
  source?: string;
  details?: any;
  tags?: string[];
}

/**
 * Log details interface
 */
export interface LogDetails {
  source?: string;
  details?: any;
  tags?: string[];
  themeName?: string;
  error?: string | Error;
  userId?: string;
  email?: string;
  roles?: UserRole[];
  message?: string;
  tokenCount?: number;
  variableCount?: number;
  animationCount?: number;
  componentCount?: number;
  count?: number;
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
 * Log event interface
 */
export interface LogEvent {
  type: 'new-log' | 'logs-cleared';
  data: any;
}

/**
 * Theme effect types enum
 * Includes both old and new naming conventions for backward compatibility
 */
export enum ThemeEffectType {
  NONE = 'none',
  BLUR = 'blur',
  MORPH = 'morph', // Legacy name for blur
  NOISE = 'noise',
  GLITCH = 'glitch', // Legacy name for noise
  GRADIENT = 'gradient',
  GLOW = 'glow',
  SHADOW = 'shadow',
  NEON = 'neon',
  CYBER = 'cyber', // Legacy name for neon
  PULSE = 'pulse',
  PARTICLE = 'particle',
  GRAIN = 'grain'
}

// Import these from theme.types.ts to avoid duplication
import { 
  Theme, 
  ThemeState, 
  ComponentTokens, 
  DesignTokens,
  ThemeToken,
  ThemeComponent
} from './theme.types';

export { 
  Theme, 
  ThemeState, 
  ComponentTokens, 
  DesignTokens,
  ThemeToken,
  ThemeComponent
};

// Build types (stub declarations to fix imports)
export enum BuildStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface BuildPart {
  id: string;
  name: string;
}

export interface BuildMod {
  id: string;
  name: string;
}

export interface UserInfo {
  id: string;
  name: string;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Theme effect interface
export interface ThemeEffect {
  type: ThemeEffectType;
  enabled: boolean;
  [key: string]: any;
}

// Theme effect provider props
export interface EffectRendererProps {
  effect: ThemeEffectType;
  intensity?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}
