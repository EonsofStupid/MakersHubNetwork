
/**
 * Shared type definitions used across multiple boundaries
 */

// Auth related types
export enum AuthStatus {
  INITIAL = 'idle',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error'
}

// User roles - used throughout the system
export type UserRole = 'admin' | 'user' | 'super_admin' | 'moderator' | 'builder';

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    name?: string; // Legacy
    display_name?: string; // Legacy
  };
  app_metadata?: {
    roles?: UserRole[];
  };
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  avatar_url?: string;
  full_name?: string;
  display_name?: string;
  bio?: string;
  theme_preference?: string;
  motion_enabled?: boolean;
  website?: string;
  created_at?: string;
  updated_at?: string;
}

export type AuthEventType = 
  | 'AUTH_STATE_CHANGE' 
  | 'AUTH_SIGNED_IN' 
  | 'AUTH_SIGNED_OUT'
  | 'AUTH_PROFILE_UPDATED'
  | 'AUTH_LINKING_REQUIRED';

export interface AuthEvent {
  type: AuthEventType;
  user?: User | null;
  session?: any;
  payload?: Record<string, any>;
}

// Logging related types
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug', 
  INFO = 'info',
  SUCCESS = 'success',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
  SILENT = 'silent'
}

export enum LogCategory {
  APP = 'app',
  ADMIN = 'admin',
  AUTH = 'auth',
  API = 'api',
  USER = 'user',
  UI = 'ui',
  CHAT = 'chat',
  CONTENT = 'content',
  SYSTEM = 'system',
  THEME = 'theme',
  NETWORK = 'network',
  PERFORMANCE = 'performance'
}

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string | any;
  timestamp: Date;
  source: string;
  category: LogCategory;
  details?: Record<string, unknown>;
}

export interface LogEvent {
  entry: LogEntry;
}

// Layout related types
export interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  title?: string;
}

export interface NavigationItemType {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  children?: NavigationItemType[];
  requiredRole?: UserRole | UserRole[];
}
