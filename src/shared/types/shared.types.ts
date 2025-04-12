
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
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  SCHEDULED = 'scheduled' // Adding missing SCHEDULED status
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
  SUPERADMIN = 'superadmin', // Fixed to match usage
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
  CONTENT = 'CONTENT', // Added missing CONTENT category
  CHAT = 'CHAT',
  NETWORK = 'NETWORK',
  DEFAULT = 'DEFAULT',
  APP = 'APP' // Added missing APP category
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

// Base entity interface
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface AuditableEntity extends BaseEntity {
  created_by: string;
}

// User profile interface
export interface UserProfile {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  roles: UserRole[];
  location?: string;
  website?: string;
  bio?: string;
  theme_preference?: string;
  is_active?: boolean;
  last_login?: string;
  user_metadata?: Record<string, any>;
  social_links?: Record<string, string>;
  preferences?: Record<string, any>;
}

// Create an explicit User interface
export interface User {
  id: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  app_metadata?: {
    roles?: string[];
    [key: string]: any;
  };
}

// Build interfaces
export interface Build extends BaseEntity {
  id: string;
  title: string;
  description: string;
  status: BuildStatus;
  submitted_by: string;
  complexity_score: number;
  complexity?: number; // Added for compatibility
  parts_count: number;
  mods_count: number;
  parts?: any[]; // Added for compatibility
  mods?: any[]; // Added for compatibility
  images?: string[];
  image_urls?: string[]; // Added for compatibility
  user?: { // Added for compatibility
    id: string;
    displayName?: string;
    email?: string;
    avatarUrl?: string;
  };
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
  content?: string; // Added for compatibility
  approved: boolean;
  category?: string[];
  categories?: string[]; // Added for compatibility
  is_verified_purchase?: boolean; // Added for compatibility
  image_urls?: string[];
  updated_at: string;
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
  avgRating?: number; // Added for compatibility
  ratingCounts: Record<number, number>;
  recentReviews: BuildReview[];
}

// Review draft interface
export interface ReviewDraft {
  build_id?: string;
  product_id?: string;
  rating: number;
  content: string;
  categories: string[];
  image_urls?: string[];
}

export interface ReviewRating {
  rating: number;
  count: number;
  percentage: number;
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
  timestamp: string; // Keep as string for base type
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

// Auth events callback type
export interface AuthEventCallback {
  (event: AuthEvent): void;
}

// Theme log details
export interface ThemeLogDetails extends LogDetails {
  themeName?: string;
  themeId?: string;
  tokens?: number;
  componentCount?: number;
}

// Export AuthEventType enum
export enum AuthEventType {
  // Auth state changes
  AUTH_STATE_CHANGE = 'AUTH_STATE_CHANGE',
  
  // User events
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_UP = 'SIGNED_UP',
  SIGNED_OUT = 'SIGNED_OUT',
  USER_UPDATED = 'USER_UPDATED',
  PASSWORD_RECOVERY = 'PASSWORD_RECOVERY',
  PASSWORD_UPDATED = 'PASSWORD_UPDATED',
  
  // Session events
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',
  SESSION_DELETED = 'SESSION_DELETED',
  
  // Profile events
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  
  // Account management
  ACCOUNT_LINKED = 'ACCOUNT_LINKED',
  ACCOUNT_UNLINKED = 'ACCOUNT_UNLINKED',
  MFA_ENABLED = 'MFA_ENABLED',
  MFA_DISABLED = 'MFA_DISABLED'
}
