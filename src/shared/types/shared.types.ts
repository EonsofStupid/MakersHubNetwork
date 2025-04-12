
// String literal types as enums
export enum AuthStatus {
  AUTHENTICATED = 'AUTHENTICATED',
  LOADING = 'LOADING',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  ERROR = 'ERROR',
  IDLE = 'IDLE'
}

export enum BuildStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_REVIEW = 'in_review',
  NEEDS_REVISION = 'needs_revision'
}

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum PartStatus {
  ACTIVE = 'ACTIVE',
  DISCONTINUED = 'DISCONTINUED',
  DRAFT = 'DRAFT'
}

export enum ThemeStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED'
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  SUPERADMIN = 'superadmin',
  EDITOR = 'editor',
  BUILDER = 'builder',
  MAKER = 'maker',
  VIEWER = 'viewer'
}

export enum ThemeContext {
  SITE = 'SITE',
  ADMIN = 'ADMIN',
  APP = 'APP'
}

export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
  SUCCESS = 'success',
  CRITICAL = 'critical',
  SILENT = 'silent'
}

export enum LogCategory {
  AUTH = 'AUTH',
  UI = 'UI',
  API = 'API',
  STORE = 'STORE',
  THEME = 'THEME',
  ADMIN = 'ADMIN',
  SYSTEM = 'SYSTEM',
  CONTENT = 'CONTENT',
  CHAT = 'CHAT',
  NETWORK = 'NETWORK',
  DEFAULT = 'DEFAULT'
}

// Log level values for numeric comparison
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.TRACE]: 0,
  [LogLevel.DEBUG]: 1, 
  [LogLevel.INFO]: 2,
  [LogLevel.WARN]: 3,
  [LogLevel.ERROR]: 4,
  [LogLevel.FATAL]: 5,
  [LogLevel.SUCCESS]: 2, // Same level as info but used for successful operations
  [LogLevel.CRITICAL]: 5, // Same level as fatal but used for critical issues
  [LogLevel.SILENT]: 999 // Highest level, will disable all logging
};

// Log details interface
export interface LogDetails {
  [key: string]: unknown;
}

export interface ThemeLogDetails extends LogDetails {
  themeName?: string;
  themeId?: string;
  tokens?: number;
  componentCount?: number;
}

// Base entity interface
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface AuditableEntity extends BaseEntity {
  created_by: string;
}

// Build interfaces
export interface Build extends BaseEntity {
  id: string;
  title: string;
  description: string;
  status: BuildStatus;
  submitted_by: string;
  complexity_score: number;
  parts_count: number;
  mods_count: number;
  images?: string[];
  processed_at?: string;
}

// Build review interface
export interface BuildReview extends BaseEntity {
  id: string;
  user_id: string;
  build_id: string;
  rating: number;
  title: string;
  body: string;
  approved: boolean;
  category?: string[];
  image_urls?: string[];
  user?: {
    id: string;
    displayName?: string;
    email?: string;
  };
}

export interface BuildPart {
  id: string;
  build_id: string;
  part_id: string;
  quantity: number;
  notes?: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingCounts: Record<number, number>;
  recentReviews: BuildReview[];
}

// Date range type for filtering
export interface DateRange {
  from: Date | null;
  to: Date | null;
}

// Log Entry type
export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  category: LogCategory;
  timestamp: string;
  source?: string;
  details?: LogDetails;
}

// Log Event type
export interface LogEvent {
  type: string;
  entry: LogEntry;
}

// Log Filter type
export interface LogFilter {
  level?: LogLevel;
  category?: LogCategory;
  search?: string;
  userId?: string;
  startTime?: Date;
  endTime?: Date;
  source?: string;
}

// Auth Event type
export interface AuthEvent {
  type: string;
  user: UserProfile | null;
  metadata?: Record<string, unknown>;
}

// User profile interface
export interface UserProfile {
  id: string;
  email?: string;
  roles: UserRole[];
  display_name?: string;
  avatar_url?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
}

// Auth events callback type
export interface AuthEventCallback {
  (event: AuthEvent): void;
}
