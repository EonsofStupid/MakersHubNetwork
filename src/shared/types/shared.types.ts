
/**
 * Core shared types across all boundaries
 */

// Auth related shared types
export enum AuthStatus {
  INITIAL = 'INITIAL',
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  ERROR = 'ERROR'
}

export type User = {
  id: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    display_name?: string;
    bio?: string;
    theme_preference?: string;
    motion_enabled?: boolean;
    website?: string;
  };
  app_metadata?: {
    roles?: UserRole[];
    permissions?: string[];
  };
}

export type UserRole = 'user' | 'admin' | 'super_admin';

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  theme_preference?: string;
  motion_enabled?: boolean;
  website?: string;
  created_at?: string;
  updated_at?: string;
}

// Auth events
export type AuthEventType = 
  | 'AUTH_STATE_CHANGE'
  | 'AUTH_SIGNIN'
  | 'AUTH_SIGNOUT'
  | 'AUTH_ERROR'
  | 'AUTH_USER_UPDATED'
  | 'AUTH_PROFILE_UPDATED'
  | '*';

export interface AuthEvent {
  type: AuthEventType;
  payload?: Record<string, any>;
  timestamp: number;
}

// Logging related shared types
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
  SUCCESS = 'success',
  TRACE = 'trace',
  SILENT = 'silent'
}

export enum LogCategory {
  SYSTEM = 'SYSTEM',
  AUTH = 'AUTH',
  UI = 'UI',
  API = 'API',
  DATABASE = 'DATABASE',
  DEFAULT = 'DEFAULT',
  CHAT = 'CHAT',
  CONTENT = 'CONTENT',
  NETWORK = 'NETWORK',
  ADMIN = 'ADMIN'
}

export interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  category: LogCategory;
  source: string;
  message: string;
  details?: Record<string, unknown>;
  userId?: string;
}

export interface LogEvent {
  entry: LogEntry;
}

export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.TRACE]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.SUCCESS]: 3,
  [LogLevel.WARN]: 4,
  [LogLevel.ERROR]: 5,
  [LogLevel.CRITICAL]: 6,
  [LogLevel.SILENT]: 100
};

// Navigation types
export interface NavigationItemType {
  title: string;
  href: string;
  icon?: React.ReactNode;
  requiredPermission?: string;
  badge?: string;
  children?: NavigationItemType[];
}

// Layout types
export interface AdminLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  title?: string;
}
