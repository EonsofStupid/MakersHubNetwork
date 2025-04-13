
// Main shared types file for the application

// User Role types
export type UserRoleString = 'guest' | 'user' | 'moderator' | 'admin' | 'superadmin' | 'builder';

// Enum representation of UserRole for type safety
export enum UserRoleEnum {
  GUEST = 'guest',
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
  BUILDER = 'builder'
}

// Export UserRole as both type and enum for backwards compatibility
export const UserRole = UserRoleEnum;
export type UserRole = UserRoleString;

// Authentication Status
export enum AuthStatus {
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error',
  IDLE = 'idle'
}

// Content Status enumeration
export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  SCHEDULED = 'scheduled'
}

// Build Status
export enum BuildStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVISION = 'needs_revision'
}

// Log Category enumeration
export enum LogCategory {
  SYSTEM = 'system',
  AUTH = 'auth',
  ADMIN = 'admin',
  USER = 'user',
  UI = 'ui',
  NETWORK = 'network',
  STORE = 'store',
  DEFAULT = 'default',
  CHAT = 'chat',
  CONTENT = 'content'  
}

// Log Level enumeration
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
  TRACE = 'trace',
  SUCCESS = 'success',
  FATAL = 'fatal'
}

// Log level values for filtering
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.CRITICAL]: 4,
  [LogLevel.TRACE]: 0,
  [LogLevel.SUCCESS]: 1,
  [LogLevel.FATAL]: 4
};

// Review Status enumeration
export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// Review Stats interface
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

// Theme related enums
export enum ThemeContext {
  SITE = 'site',
  ADMIN = 'admin',
  APP = 'app'
}

export enum ThemeStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  ACTIVE = 'active'
}

// Log related interfaces
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

export interface LogEntry {
  id: string;
  timestamp: string; // Use string for consistency
  level: LogLevel;
  message: string;
  category: LogCategory;
  source: string;
  details?: LogDetails;
}

export interface LogEvent {
  type: string;
  entry: LogEntry;
}

export interface LogFilter {
  level?: LogLevel;
  category?: LogCategory;
  source?: string;
  search?: string;
  startTime?: number;
  endTime?: number;
}

// User related interfaces
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  user_metadata: Record<string, any>;
}

export interface UserProfile {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  theme_preference?: string;
  motion_enabled?: boolean;
  roles?: UserRoleString[];
  location?: string;
  website?: string;
  social_links?: Record<string, string>;
  preferences?: Record<string, any>;
  last_login?: string;
}

// Theme related interfaces
export interface ThemeLogDetails extends LogDetails {
  themeId?: string;
  themeName?: string;
  tokenCount?: number;
  componentCount?: number;
}

// Auth related interfaces
export enum AuthEventType {
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_OUT = 'SIGNED_OUT',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  PASSWORD_RECOVERY = 'PASSWORD_RECOVERY',
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  AUTH_STATE_CHANGE = 'AUTH_STATE_CHANGE'
}

export interface AuthEvent {
  type: AuthEventType;
  user: UserProfile | null;
  metadata?: Record<string, any>;
}

// Build related interfaces
export interface UserInfo {
  displayName?: string;
  avatarUrl?: string;
  id: string;
}

export interface BuildPart {
  id: string;
  name: string;
  quantity: number;
  part_id: string;
  notes?: string;
  build_id?: string; // Added this field to resolve type mismatch
}

export interface BuildMod {
  id: string;
  name: string;
  description?: string;
  complexity?: number;
  build_id?: string; // Added this field to resolve type mismatch
}

export interface Build {
  id: string;
  title: string;
  description: string;
  status: BuildStatus;
  complexity_score: number;
  parts_count: number;
  mods_count: number;
  submitted_by: string;
  created_at: string;
  updated_at: string;
  images?: string[];
  user?: UserInfo;
  parts?: BuildPart[];
  mods?: BuildMod[];
  complexity?: number;
  image_urls?: string[];
}

export interface BuildReview {
  id: string;
  build_id: string;
  user_id: string;
  rating: number;
  title?: string;
  body?: string;
  content?: string;
  created_at: string;
  updated_at?: string;
  approved: boolean;
  category?: string[];
  categories?: string[];
  image_urls?: string[];
  user?: UserInfo;
  is_verified_purchase?: boolean;
}

// Add ReviewFilters interface to fix missing approvedOnly property
export interface ReviewFilters {
  sortBy?: string;
  approvedOnly?: boolean;
  rating?: number;
  search?: string;
  page?: number;
  perPage?: number;
}

// Add ReviewAdminState interface to fix missing properties
export interface ReviewAdminState {
  reviews: BuildReview[];
  isLoading: boolean;
  error: string | null;
  filters: ReviewFilters;
  pendingReviews: BuildReview[];
  stats: ReviewStats;
}
