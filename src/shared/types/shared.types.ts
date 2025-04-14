
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
  user_metadata?: Record<string, unknown>;
}

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
  DEBUG = 'debug'
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
 * Log details interface
 */
export interface LogDetails {
  source?: string;
  details?: any;
  tags?: string[];
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

/**
 * Theme state interface
 */
export interface ThemeState {
  isDark: boolean;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  fontFamily: string;
  cornerRadius: number;
  animations: boolean;
}

/**
 * Theme effect interface
 */
export interface ThemeEffect {
  type: ThemeEffectType;
  enabled: boolean;
  [key: string]: any;
}

/**
 * Theme effect provider props
 */
export interface EffectRendererProps {
  effect: ThemeEffectType;
  intensity?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Legacy effect enum for backward compatibility
 */
export enum ThemeEffect {
  NONE = 'none',
  BLUR = 'blur',
  GRAIN = 'grain',
  GLITCH = 'glitch',
  GRADIENT = 'gradient',
  CYBER = 'cyber',
  NOISE = 'noise',
  PULSE = 'pulse',
  PARTICLE = 'particle',
}
