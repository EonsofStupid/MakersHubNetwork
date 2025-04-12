
// Re-export or define shared types used throughout the application
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  SUCCESS = 'success',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
  SILENT = 'silent'
}

export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.TRACE]: 0,
  [LogLevel.DEBUG]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.SUCCESS]: 3,
  [LogLevel.WARN]: 4,
  [LogLevel.ERROR]: 5,
  [LogLevel.CRITICAL]: 6,
  [LogLevel.SILENT]: 7
};

export enum LogCategory {
  DEFAULT = 'default',
  SYSTEM = 'system',
  APP = 'app',
  AUTH = 'auth',
  API = 'api',
  DATA = 'data',
  UI = 'ui',
  CHAT = 'chat',
  THEME = 'theme',
  ADMIN = 'admin',
  USER = 'user',
  PERFORMANCE = 'perf',
  BRIDGE = 'bridge'
}

// Auth types
export enum AuthStatus {
  INITIAL = 'INITIAL',
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  ERROR = 'ERROR'
}

export enum AuthEventType {
  AUTH_SIGNIN = 'AUTH_SIGNIN',
  AUTH_SIGNOUT = 'AUTH_SIGNOUT',
  AUTH_ERROR = 'AUTH_ERROR',
  AUTH_USER_UPDATED = 'AUTH_USER_UPDATED',
  AUTH_LINKING_REQUIRED = 'AUTH_LINKING_REQUIRED'
}

export interface AuthEvent {
  type: AuthEventType;
  payload?: Record<string, unknown>;
  timestamp?: number;
}

export type UserRole = 'user' | 'admin' | 'maker' | 'moderator' | 'super_admin';

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  user_metadata: UserProfile;
  app_metadata: {
    roles: UserRole[];
  };
}

export interface UserProfile {
  avatar_url?: string;
  full_name?: string;
  name?: string; 
  display_name?: string;
  bio?: string;
  theme_preference?: string;
  motion_enabled?: boolean;
  website?: string;
}

export interface LogFilter {
  level?: LogLevel;
  category?: LogCategory | LogCategory[];
  source?: string;
  search?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  category: LogCategory;
  source: string;
  message: string;
  details?: Record<string, unknown>;
}

// Admin layout props
export interface AdminLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

// Navigation item type
export type NavigationItemType = 'link' | 'group' | 'divider';
