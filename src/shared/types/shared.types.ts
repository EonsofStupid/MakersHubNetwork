
/**
 * Shared types used across multiple modules
 */

// Content status enum
export enum ContentStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
  SCHEDULED = 'scheduled'
}

// User role enum
export enum UserRole {
  USER = 'user',
  BUILDER = 'builder',
  MODERATOR = 'moderator',
  EDITOR = 'editor',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

// Log category enum
export enum LogCategory {
  UI = 'ui',
  API = 'api',
  AUTH = 'auth',
  DATA = 'data',
  PERF = 'perf',
  SYSTEM = 'system',
  SECURITY = 'security',
  CHAT = 'chat',
  APP = 'app'
}

// Log level enum
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  SUCCESS = 'success',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
  FATAL = 'fatal',
  SILENT = 'silent'
}

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
}

// Auth status type
export enum AuthStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error'
}

// Log details interface
export interface LogDetails {
  [key: string]: unknown;
}

// Theme log details interface
export interface ThemeLogDetails extends Record<string, unknown> {
  themeName?: string;
  themeId?: string;
  action?: string;
  tokenName?: string;
  tokenValue?: string;
  errorMessage?: string;
  duration?: number;
}
