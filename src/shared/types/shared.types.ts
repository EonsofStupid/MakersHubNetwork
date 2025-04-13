
// This is the central place for all shared types across the app
// All common enums and interfaces should be defined here to avoid duplication

// Auth-related enums
export enum AuthStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error'
}

export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin'
}

// Content status enum
export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

// Build status enum
export enum BuildStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVISION = 'needs_revision',
  DELETED = 'deleted'
}

// Logging related types
export enum LogCategory {
  APP = 'app',
  AUTH = 'auth',
  API = 'api',
  ADMIN = 'admin',
  USER = 'user',
  SYSTEM = 'system',
  THEME = 'theme',
  CONTENT = 'content',
  DEBUG = 'debug'
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export const LOG_LEVEL_VALUES = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.CRITICAL]: 4
};

export type LogDetails = Record<string, any>;

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  details?: LogDetails;
  source?: string;
}

export interface LogEvent {
  entry: LogEntry;
}

export interface LogFilter {
  level?: LogLevel;
  category?: LogCategory;
  search?: string;
  from?: Date;
  to?: Date;
}

// User-related types
export interface UserBase {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Review types
export enum ReviewRating {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

// This makes numeric enum values also valid
export type ReviewRatingValue = ReviewRating | 1 | 2 | 3 | 4 | 5;

// Theme-related types
export interface ThemeToken {
  id: string;
  name: string;
  value: string;
  category: string;
}
