
// User and Auth related types
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
  EDITOR = "editor",
  MODERATOR = "moderator",
  BUILDER = "builder"
}

export enum AuthStatus {
  INITIAL = "INITIAL",
  LOADING = "LOADING",
  AUTHENTICATED = "AUTHENTICATED",
  UNAUTHENTICATED = "UNAUTHENTICATED",
  ERROR = "ERROR"
}

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  app_metadata?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  theme_preference: string | null;
  motion_enabled: boolean;
  website?: string;
  location?: string;
}

export type AuthEvent = {
  type: AuthEventType;
  payload?: Record<string, any>;
};

export type AuthEventType = 
  | "AUTH_SIGNED_IN"
  | "AUTH_SIGNED_OUT"
  | "AUTH_USER_UPDATED"
  | "AUTH_SESSION_UPDATED"
  | "AUTH_PROFILE_UPDATED"
  | "AUTH_ERROR"
  | "AUTH_LINKING_REQUIRED";

// Logging related types
export enum LogLevel {
  TRACE = "trace",
  DEBUG = "debug",
  INFO = "info",
  SUCCESS = "success",
  WARN = "warn",
  ERROR = "error", 
  FATAL = "fatal",
  CRITICAL = "critical",
  SILENT = "silent"
}

export enum LogCategory {
  ADMIN = "admin",
  AUTH = "auth",
  API = "api",
  USER = "user",
  UI = "ui",
  APP = "app",
  CHAT = "chat",
  SYSTEM = "system",
  THEME = "theme",
  PERF = "perf",
  DEFAULT = "default",
  DATA = "data",
  BRIDGE = "bridge",
  CONTENT = "content",
  NETWORK = "network",
  DATABASE = "database",
  SECURITY = "security",
  PERFORMANCE = "performance", 
  ANALYTICS = "analytics"
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
  source?: string;
  category?: LogCategory;
  search?: string;
  userId?: string;
  startTime?: number;
  endTime?: number;
}

// Build types
export interface Build {
  id: string;
  title: string;
  description: string;
  status: BuildStatus;
  submittedBy: string;
  userId: string;
  userName: string;
  complexity_score: number;
  parts_count: number;
  mods_count: number;
  avatar_url?: string;
  display_name?: string;
  created_at: string;
  createdAt: string;
  updatedAt: string;
  images?: string[];
  parts?: BuildPart[];
  mods?: BuildMod[];
  reviews?: any[];
}

export interface BuildPart {
  id: string;
  name: string;
  quantity: number;
  type: string;
  notes?: string;
}

export interface BuildMod {
  id: string;
  name: string;
  description: string;
  build_id: string;
  complexity: number | null;
  created_at: string;
}

export type BuildStatus = "pending" | "approved" | "rejected" | "needs_revision";

// Content types
export type ContentStatus = "published" | "draft" | "archived" | "scheduled";
