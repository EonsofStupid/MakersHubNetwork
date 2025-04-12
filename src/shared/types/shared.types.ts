
import { User as SupabaseUser } from '@supabase/supabase-js';

// Auth Types
export type User = SupabaseUser & {
  profile?: UserProfile;
};

export type UserProfile = {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
  roles?: UserRole[];
  settings?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
};

// Convert AuthStatus from type to enum so it can be used as a value
export enum AuthStatus {
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  ERROR = 'ERROR',
  INITIAL = 'INITIAL'
}

export type AuthEvent = {
  type: AuthEventType;
  payload?: Record<string, any>;
};

export type AuthEventType = 
  | 'AUTH_STATE_CHANGE'
  | 'AUTH_LINKING_REQUIRED'
  | 'AUTH_SESSION_EXPIRED'
  | 'AUTH_SIGN_OUT';

// RBAC Types
export type UserRole = 
  | 'user'
  | 'admin'
  | 'super_admin'
  | 'editor'
  | 'moderator'
  | 'guest';

export type Permission = {
  id: string;
  name: string;
  description: string;
};

// Logging Types - Convert from type to enum
export enum LogLevel {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
  SILENT = 'SILENT',
  SUCCESS = 'SUCCESS',
  CRITICAL = 'CRITICAL'
}

export enum LogCategory {
  SYSTEM = 'SYSTEM',
  AUTH = 'AUTH',
  UI = 'UI',
  API = 'API',
  DATABASE = 'DATABASE',
  SECURITY = 'SECURITY',
  PERFORMANCE = 'PERFORMANCE',
  ANALYTICS = 'ANALYTICS',
  USER = 'USER',
  ADMIN = 'ADMIN',
  CHAT = 'CHAT'
}

export type LogEvent = {
  entry: LogEntry;
};

export type LogEntry = {
  id: string;
  level: LogLevel;
  message: string;
  source: string;
  category: LogCategory;
  timestamp: Date;
  details?: Record<string, unknown>;
};

export type LogFilter = {
  level?: LogLevel;
  source?: string;
  category?: LogCategory;
  search?: string;
  from?: Date;
  to?: Date;
};

// Map LogLevel to numeric values for comparison
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.TRACE]: 0,
  [LogLevel.DEBUG]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.WARN]: 3,
  [LogLevel.ERROR]: 4,
  [LogLevel.FATAL]: 5,
  [LogLevel.SILENT]: 6,
  [LogLevel.SUCCESS]: 7,
  [LogLevel.CRITICAL]: 8
};

// Theme Types
export type Theme = {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  tokens: Record<string, ThemeToken>;
  components?: Record<string, ComponentTokens>;
  variables?: Record<string, string>;
};

export type ThemeToken = {
  value: string;
  type: string;
};

export type ComponentTokens = {
  component_name: string;
  styles: Record<string, string>;
};

// Content Types for Admin
export type ContentStatus = 'published' | 'draft' | 'archived' | 'scheduled';
