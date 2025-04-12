
// Common shared types across the application

// User types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  user_metadata?: Record<string, any>;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string | null;
  bio?: string;
  display_name: string;
  theme_preference: string;
  motion_enabled: boolean;
  website?: string | null;
  location?: string | null;
  roles: UserRole[];
}

// Auth related enums and types
export enum AuthStatus {
  LOADING = 'LOADING',
  INITIAL = 'INITIAL',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED'
}

export enum AuthEventType {
  AUTH_STATE_CHANGE = 'AUTH_STATE_CHANGE',
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_OUT = 'SIGNED_OUT',
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',
  PASSWORD_RECOVERY = 'PASSWORD_RECOVERY',
  USER_UPDATED = 'USER_UPDATED',
  LINKED_ACCOUNT = 'LINKED_ACCOUNT'
}

export interface AuthEvent {
  type: AuthEventType;
  payload?: any;
}

// User role - important for RBAC
export enum UserRole {
  USER = 'user',
  BUILDER = 'builder', // Added builder role
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  EDITOR = 'editor'
}

// Log related types
export enum LogCategory {
  SYSTEM = 'system',
  AUTH = 'auth',
  UI = 'ui',
  DATA = 'data',
  API = 'api',
  PERF = 'perf',
  USER = 'user',
  ADMIN = 'admin',
  CONTENT = 'content',
  CHAT = 'chat',
  NETWORK = 'network',
  DEFAULT = 'default'
}

export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  SUCCESS = 'success',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
  CRITICAL = 'critical',
  SILENT = 'silent'
}

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: number;
  source: string;
  category: LogCategory;
  details?: Record<string, unknown>;
}

export interface LogEvent {
  entry: LogEntry;
}

export interface LogFilter {
  level?: LogLevel;
  category?: LogCategory;
  source?: string;
  search?: string;
}

// Content types
export interface ContentFilter {
  status?: ContentStatus;
  type?: string;
  search?: string;
}

export type ContentStatus = 'draft' | 'published' | 'archived' | 'scheduled';

// Build types - now fully exported
export interface Build {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: BuildStatus;
  created_at: string;
  updated_at: string;
  parts?: BuildPart[];
  mods?: BuildMod[];
  images?: string[];
  complexity_score?: number;
  parts_count?: number;
  mods_count?: number;
  display_name?: string;
  avatar_url?: string;
}

export type BuildStatus = 'pending' | 'approved' | 'rejected' | 'needs_revision' | 'all';

export interface BuildPart {
  id: string;
  build_id: string;
  name: string; // Added name field
  part_name?: string;
  part_url?: string;
  quantity: number;
  notes?: string;
}

export interface BuildMod {
  id: string;
  build_id: string;
  name: string; // Added name field
  mod_name?: string;
  mod_description?: string;
  complexity?: number;
  mod_url?: string;
}

export interface BuildPagination {
  page: number;
  perPage: number;
  total?: number;
}

export interface BuildFilters {
  status?: BuildStatus;
  userId?: string;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  sortBy?: string;
}

// Theme types
export interface Theme {
  id: string;
  name: string;
  colors: Record<string, string>;
  components?: ComponentTokens;
}

export interface ComponentTokens {
  [key: string]: Record<string, string>;
}

// Review types
export interface BuildReview {
  id: string;
  user_id: string;
  build_id: string;
  content: string;
  rating: number;
  categories: string[];
  status: string;
  created_at: string;
  updated_at: string;
  approved?: boolean;
  reviewer_name?: string;
  body?: string | null;
  category?: string[] | null;
  title?: string;
}

export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface ReviewStats {
  totalReviews: number;
  avgRating: number;
  ratingsCount: Record<ReviewRating, number>;
}
