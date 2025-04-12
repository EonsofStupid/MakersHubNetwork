
// Common shared types across the application

// User types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  display_name: string;
  theme_preference: string;
  motion_enabled: boolean;
  website?: string;
  location?: string;
  roles: UserRole[];
}

// Enum for auth status
export enum AuthStatus {
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED'
}

// User role - important for RBAC
export enum UserRole {
  USER = 'user',
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

// Build types
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
}

export type BuildStatus = 'pending' | 'approved' | 'rejected' | 'revision_required' | 'all';

export interface BuildPart {
  id: string;
  build_id: string;
  part_name: string;
  part_url?: string;
  quantity: number;
}

export interface BuildMod {
  id: string;
  build_id: string;
  mod_name: string;
  mod_description: string;
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
