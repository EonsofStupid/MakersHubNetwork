
// Shared type definitions

// User roles
export enum UserRole {
  USER = "user",
  BUILDER = "builder",
  MODERATOR = "moderator",
  EDITOR = "editor",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin"
}

// Authentication status
export enum AuthStatus {
  INITIAL = "INITIAL",
  LOADING = "LOADING",
  AUTHENTICATED = "AUTHENTICATED",
  UNAUTHENTICATED = "UNAUTHENTICATED",
  ERROR = "ERROR"
}

// Log categories
export enum LogCategory {
  DEFAULT = "default",
  SYSTEM = "system",
  AUTH = "auth",
  UI = "ui",
  API = "api",
  ADMIN = "admin",
  CHAT = "chat",
  DATABASE = "database",
  PERFORMANCE = "performance",
  ERROR = "error",
  SECURITY = "security",
  CONTENT = "content",
  EDITOR = "editor",
  NETWORK = "network",
  DATA = "data",
  PERF = "perf",
  USER = "user"
}

// Log levels
export enum LogLevel {
  TRACE = "trace",
  DEBUG = "debug",
  INFO = "info",
  SUCCESS = "success",
  WARN = "warn",
  ERROR = "error",
  CRITICAL = "critical",
  FATAL = "fatal",
  SILENT = "silent"
}

// Log level values for comparison
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.TRACE]: 0,
  [LogLevel.DEBUG]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.SUCCESS]: 3,
  [LogLevel.WARN]: 4,
  [LogLevel.ERROR]: 5,
  [LogLevel.CRITICAL]: 6,
  [LogLevel.FATAL]: 7,
  [LogLevel.SILENT]: 8
};

// Log entry
export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: number;
  source: string;
  category: LogCategory;
  details?: Record<string, unknown>;
}

// Log filter
export interface LogFilter {
  level?: LogLevel | LogLevel[];
  category?: LogCategory | LogCategory[];
  source?: string | string[];
  from?: Date;
  to?: Date;
  search?: string;
  userId?: string;
  startTime?: number;
  endTime?: number;
}

// Content related types
export enum ContentStatus {
  DRAFT = "draft",
  PENDING = "pending",
  PUBLISHED = "published",
  ARCHIVED = "archived",
  FEATURED = "featured",
  REJECTED = "rejected"
}

// Review related types
export enum ReviewRating {
  AWFUL = 1,
  BAD = 2,
  OK = 3,
  GOOD = 4,
  EXCELLENT = 5
}

export interface Review {
  id: string;
  build_id: string;
  user_id: string;
  rating: ReviewRating;
  content: string;
  created_at: string;
  approved: boolean;
  categories?: string[];
  status?: ContentStatus;
}

export interface BuildReview {
  id: string;
  build_id: string;
  user_id: string;
  rating: ReviewRating;
  content: string;
  title?: string;
  body?: string;
  approved?: boolean;
  created_at: string;
  categories?: string[];
  status: ContentStatus;
  reviewer_name?: string; 
  category?: string[];
  image_urls?: string[];
}

export interface ReviewStats {
  totalReviews: number;
  avgRating: number;
  totalApproved: number;
  totalPending: number;
  totalRejected: number;
  ratingCounts: Record<ReviewRating, number>;
}

export interface ReviewDraft {
  id?: string;
  build_id: string;
  user_id: string;
  rating: ReviewRating;
  content: string;
  title?: string;
  body?: string;
  category?: string[];
  image_urls?: string[];
  created_at?: string;
  updated_at?: string;
}

// Generic types
export type LogDetails = Record<string, unknown>;

// Event types
export interface LogEvent {
  entry: LogEntry;
}

// User profile type
export interface User {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, any>;
  app_metadata?: {
    roles?: UserRole[];
  };
  created_at?: string;
}

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  theme_preference: string | null;
  motion_enabled: boolean | null;
  user_id?: string;
  location?: string | null;
  website?: string | null;
}

// Auth event types
export type AuthEventType = 
  | 'SIGNED_IN'
  | 'SIGNED_UP' 
  | 'SIGNED_OUT'
  | 'PASSWORD_UPDATED'
  | 'PROFILE_UPDATED';

export interface AuthEvent {
  type: AuthEventType;
  user?: User;
  payload?: any;
}

// ReviewAdmin store interface
export interface ReviewAdminStore {
  reviews: Review[];
  selectedReview: Review | null;
  stats: ReviewStats | null;
  isLoading: boolean;
  error: string | null;
  pendingReviews: BuildReview[];
  filters?: {
    buildId?: string;
    approved?: boolean | 'all';
    rating?: ReviewRating | 'all';
    sort?: 'newest' | 'oldest' | 'highest' | 'lowest';
    approvedOnly?: boolean;
    sortBy?: string;
  };
  
  // Actions
  fetchReviews: (buildId?: string) => Promise<void>;
  fetchReviewsByBuildId: (buildId: string) => Promise<void>;
  fetchPendingReviews: () => Promise<void>;
  fetchReviewStats: (buildId?: string) => Promise<void>;
  approveReview: (reviewId: string, message?: string) => Promise<void>;
  rejectReview: (reviewId: string, reason: string) => Promise<void>;
  updateFilters: (filters: any) => void;
}
