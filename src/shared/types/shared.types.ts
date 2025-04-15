
// Auth types
export const AUTH_STATUS = {
  LOADING: 'LOADING',
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  IDLE: 'IDLE',
  ERROR: 'ERROR'
} as const;

export type AuthStatus = keyof typeof AUTH_STATUS;
export type AuthEventType = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED';

// RBAC types
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  BUILDER: 'builder',
  USER: 'user',
  GUEST: 'guest'
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// Permission type
export type Permission = string;

// User profile type
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  roles?: UserRole[];
  bio?: string;
  created_at?: string;
  last_sign_in_at?: string;
  updated_at?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    website?: string;
    [key: string]: any;
  };
  app_metadata?: {
    roles?: UserRole[];
    [key: string]: any;
  };
}

// Theme effect types
export const ThemeEffectType = {
  NONE: 'NONE',
  CYBER: 'CYBER',
  NEON: 'NEON',
  ELECTRIC: 'ELECTRIC',
  GLITCH: 'GLITCH',
  SYNTHWAVE: 'SYNTHWAVE',
  HOLOGRAM: 'HOLOGRAM',
  BLUR: 'BLUR',
  MORPH: 'MORPH',
  NOISE: 'NOISE',
  GRADIENT: 'GRADIENT',
  PULSE: 'PULSE',
  PARTICLE: 'PARTICLE',
  GRAIN: 'GRAIN'
} as const;

export type ThemeEffect = keyof typeof ThemeEffectType;

// Logging types
export const LogCategory = {
  APP: 'APP',
  ADMIN: 'ADMIN',
  AUTH: 'AUTH',
  API: 'API',
  UI: 'UI',
  PERFORMANCE: 'PERFORMANCE',
  ERROR: 'ERROR',
  SECURITY: 'SECURITY',
  THEME: 'THEME',
  RBAC: 'RBAC',
  SYSTEM: 'SYSTEM',
  CHAT: 'CHAT',
  DEBUG: 'DEBUG'
} as const;

export type LogCategoryType = keyof typeof LogCategory;

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
  TRACE = -1,
  SUCCESS = 5,
  FATAL = 6,
  SILENT = 100
}

// Mapping for log level values
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.TRACE]: -1,
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.CRITICAL]: 4,
  [LogLevel.SUCCESS]: 5,
  [LogLevel.FATAL]: 6,
  [LogLevel.SILENT]: 100
};

export interface LogDetails {
  source?: string;
  moduleId?: string;
  moduleName?: string;
  path?: string;
  errorMessage?: string;
  required?: string;
  requiredPerm?: string;
  eventType?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  id: string;
  level: LogLevel;
  category: LogCategoryType;
  message: string;
  timestamp: number;
  details?: LogDetails;
  source?: string;
}

export interface LogEvent {
  entry: LogEntry;
}

export interface LogFilter {
  level?: LogLevel;
  category?: LogCategoryType;
  from?: number;
  to?: number;
  search?: string;
}

// Base entity type
export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// User type
export interface User extends BaseEntity {
  email: string;
  name?: string;
  avatar_url?: string;
  roles?: UserRole[];
}
