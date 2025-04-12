
/**
 * Shared types used across multiple modules
 */

// Content status type (string literals instead of enum)
export type ContentStatus = 
  | 'published'
  | 'draft'
  | 'archived'
  | 'scheduled';

// User role type (string literals instead of enum)
export type UserRole = 
  | 'user'
  | 'builder'
  | 'moderator'
  | 'editor'
  | 'admin'
  | 'super_admin';

// Log category type (string literals instead of enum)
export type LogCategory = 
  | 'ui'
  | 'api'
  | 'auth'
  | 'data'
  | 'perf'
  | 'system'
  | 'security'
  | 'chat'
  | 'app'
  | 'admin'
  | 'content'
  | 'default'
  | 'editor'
  | 'database'
  | 'performance'
  | 'error'
  | 'network';

// Log level type (string literals instead of enum)
export type LogLevel = 
  | 'trace'
  | 'debug'
  | 'info'
  | 'success'
  | 'warn'
  | 'error'
  | 'critical'
  | 'fatal'
  | 'silent';

// Constants for LogCategory (to replace enum values)
export const LogCategory = {
  UI: 'ui' as LogCategory,
  API: 'api' as LogCategory,
  AUTH: 'auth' as LogCategory,
  DATA: 'data' as LogCategory,
  PERF: 'perf' as LogCategory,
  SYSTEM: 'system' as LogCategory,
  SECURITY: 'security' as LogCategory,
  CHAT: 'chat' as LogCategory,
  APP: 'app' as LogCategory,
  ADMIN: 'admin' as LogCategory,
  CONTENT: 'content' as LogCategory,
  DEFAULT: 'default' as LogCategory,
  EDITOR: 'editor' as LogCategory,
  DATABASE: 'database' as LogCategory,
  PERFORMANCE: 'performance' as LogCategory,
  ERROR: 'error' as LogCategory,
  NETWORK: 'network' as LogCategory
} as const;

// Constants for LogLevel (to replace enum values)
export const LogLevel = {
  TRACE: 'trace' as LogLevel,
  DEBUG: 'debug' as LogLevel,
  INFO: 'info' as LogLevel,
  SUCCESS: 'success' as LogLevel,
  WARN: 'warn' as LogLevel,
  ERROR: 'error' as LogLevel,
  CRITICAL: 'critical' as LogLevel,
  FATAL: 'fatal' as LogLevel,
  SILENT: 'silent' as LogLevel
} as const;

// Constants for UserRole (to replace enum values)
export const UserRole = {
  USER: 'user' as UserRole,
  BUILDER: 'builder' as UserRole,
  MODERATOR: 'moderator' as UserRole,
  EDITOR: 'editor' as UserRole,
  ADMIN: 'admin' as UserRole,
  SUPER_ADMIN: 'super_admin' as UserRole
} as const;

// Constants for content status (to replace enum values)
export const ContentStatus = {
  PUBLISHED: 'published' as ContentStatus,
  DRAFT: 'draft' as ContentStatus,
  ARCHIVED: 'archived' as ContentStatus,
  SCHEDULED: 'scheduled' as ContentStatus
} as const;

// Auth status type (string literals instead of enum)
export type AuthStatus = 
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

// Constants for AuthStatus (to replace enum values)
export const AuthStatus = {
  IDLE: 'idle' as AuthStatus,
  LOADING: 'loading' as AuthStatus,
  AUTHENTICATED: 'authenticated' as AuthStatus,
  UNAUTHENTICATED: 'unauthenticated' as AuthStatus,
  ERROR: 'error' as AuthStatus
} as const;

// Review stats interface
export interface ReviewStats {
  totalReviews: number;
  avgRating: number;
  ratingCounts: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// Review rating type
export type ReviewRating = 1 | 2 | 3 | 4 | 5;

// Constants for ReviewRating
export const ReviewRating = {
  ONE: 1 as ReviewRating,
  TWO: 2 as ReviewRating,
  THREE: 3 as ReviewRating,
  FOUR: 4 as ReviewRating,
  FIVE: 5 as ReviewRating
} as const;

// Build review interface
export interface BuildReview {
  id: string;
  build_id: string;
  user_id: string;
  rating: ReviewRating;
  title: string;
  body: string;
  status: ContentStatus;
  is_verified_purchase: boolean;
  created_at: string;
  updated_at: string;
  image_urls?: string[];
  helpful_count?: number;
  user?: {
    displayName?: string;
    avatarUrl?: string;
  };
  content?: string; // Optional alias for body for backward compatibility
  categories?: string[]; // Optional categories field
  approved?: boolean; // Optional approval status
  reviewer_name?: string; // Optional reviewer name
}

// Log value mapping
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  'trace': 0,
  'debug': 1,
  'info': 2,
  'success': 3,
  'warn': 4,
  'error': 5,
  'critical': 6,
  'fatal': 7,
  'silent': 8
};

// Log details interface
export interface LogDetails {
  [key: string]: unknown;
}

// Log entry interface
export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: number;
  source: string;
  category: LogCategory;
  details?: LogDetails;
}

// Log event interface
export interface LogEvent {
  entry: LogEntry;
}

// Log filter interface
export interface LogFilter {
  level?: LogLevel;
  category?: LogCategory;
  source?: string;
  search?: string;
  // Additional filter properties
  userId?: string;
  startTime?: number;
  endTime?: number;
}

// Auth event type
export type AuthEventType = 
  | 'AUTH_STATE_CHANGE'
  | 'SIGNED_IN'
  | 'SIGNED_UP'
  | 'SIGNED_OUT'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY'
  | 'PASSWORD_UPDATED'
  | 'TOKEN_REFRESHED'
  | 'SESSION_DELETED'
  | 'PROFILE_UPDATED'
  | 'ACCOUNT_LINKED'
  | 'ACCOUNT_UNLINKED'
  | 'MFA_ENABLED'
  | 'MFA_DISABLED';

// Constants for AuthEventType
export const AuthEventType = {
  AUTH_STATE_CHANGE: 'AUTH_STATE_CHANGE' as AuthEventType,
  SIGNED_IN: 'SIGNED_IN' as AuthEventType,
  SIGNED_UP: 'SIGNED_UP' as AuthEventType,
  SIGNED_OUT: 'SIGNED_OUT' as AuthEventType,
  USER_UPDATED: 'USER_UPDATED' as AuthEventType,
  PASSWORD_RECOVERY: 'PASSWORD_RECOVERY' as AuthEventType,
  PASSWORD_UPDATED: 'PASSWORD_UPDATED' as AuthEventType,
  TOKEN_REFRESHED: 'TOKEN_REFRESHED' as AuthEventType,
  SESSION_DELETED: 'SESSION_DELETED' as AuthEventType,
  PROFILE_UPDATED: 'PROFILE_UPDATED' as AuthEventType,
  ACCOUNT_LINKED: 'ACCOUNT_LINKED' as AuthEventType,
  ACCOUNT_UNLINKED: 'ACCOUNT_UNLINKED' as AuthEventType,
  MFA_ENABLED: 'MFA_ENABLED' as AuthEventType,
  MFA_DISABLED: 'MFA_DISABLED' as AuthEventType
} as const;

// Auth event interface
export interface AuthEvent {
  type: AuthEventType;
  payload?: {
    user?: any;
    session?: any;
    profile?: any;
    error?: any;
  };
  timestamp: number;
}

// User interface
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  user_metadata: Record<string, any>;
  app_metadata?: Record<string, any>;
  confirmed_at?: string | null;
}

// User profile interface
export interface UserProfile {
  id: string;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  theme_preference?: string | null;
  motion_enabled?: boolean | null;
  website?: string | null;
  location?: string | null;
}

// Theme log details
export interface ThemeLogDetails extends Record<string, unknown> {
  themeName?: string;
  themeId?: string;
  action?: string;
  tokenName?: string;
  tokenValue?: string;
  errorMessage?: string;
  duration?: number;
  success?: boolean;
  error?: boolean;
  theme?: string;
  details?: Record<string, unknown>;
}
