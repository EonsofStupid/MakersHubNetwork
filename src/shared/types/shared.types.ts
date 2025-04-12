
/**
 * Common shared types used across the application
 */

// Log levels
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  SUCCESS = 'success',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
  FATAL = 'fatal',
  SILENT = 'silent',
}

// Log categories
export enum LogCategory {
  SYSTEM = 'system',
  AUTH = 'auth',
  ADMIN = 'admin',
  CONTENT = 'content',
  UI = 'ui',
  API = 'api',
  DATABASE = 'database',
  THEME = 'theme',
  CHAT = 'chat',
  APP = 'app',
  OTHER = 'other',
}

// User roles
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  SUPER_ADMIN = 'SUPER_ADMIN',
  MODERATOR = 'MODERATOR',
  BUILDER = 'BUILDER',
}

// Auth status
export enum AuthStatus {
  INITIAL = 'INITIAL',
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  ERROR = 'ERROR',
}

// Log entry structure
export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: number;
  source: string;
  category: LogCategory;
  details?: LogDetails;
}

// Log event structure
export interface LogEvent {
  entry: LogEntry;
}

// Log filter structure
export interface LogFilter {
  level?: LogLevel | LogLevel[];
  category?: LogCategory | LogCategory[];
  source?: string | string[];
  search?: string;
  limit?: number;
  startTime?: number;
  endTime?: number;
  userId?: string;
}

// Log details interface
export interface LogDetails {
  [key: string]: unknown;
  moduleId?: string;
  moduleName?: string;
  path?: string;
  errorMessage?: string;
  required?: string;
  requiredPerm?: string;
  eventType?: string;
}

// User profile structure
export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  updated_at?: string | null;
}

// User structure
export interface User {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
  app_metadata: Record<string, any>;
  created_at: string;
  updated_at: string | null;
  confirmed_at: string | null;
}

// Permission type
export type Permission = string;
