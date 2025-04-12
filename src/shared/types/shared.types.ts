
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
  SECURITY = "security"
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
}

// Build related types
export enum BuildStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NEEDS_REVISION = "needs_revision"
}

export interface BuildPart {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

export interface BuildMod {
  id: string;
  name: string;
  description?: string;
  complexity?: number;
}

export interface Build {
  id: string;
  title: string;
  description?: string;
  status: BuildStatus;
  created_at: string;
  updated_at: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  parts_count: number;
  mods_count: number;
  complexity_score: number;
  parts?: BuildPart[];
  mods?: BuildMod[];
  images?: string[];
}

// Generic types
export type LogDetails = Record<string, unknown>;

// Event types
export interface LogEvent {
  entry: LogEntry;
}
