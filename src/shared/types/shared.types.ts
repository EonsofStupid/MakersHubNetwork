
// Common types used across multiple domains

// Logging types
export enum LogCategory {
  APP = 'app',
  ADMIN = 'admin',
  AUTH = 'auth',
  API = 'api',
  USER = 'user',
  UI = 'ui',
  CHAT = 'chat',
  SYSTEM = 'system',
  THEME = 'theme',
  PERF = 'perf',
  DEFAULT = 'default',
  DATA = 'data',
  BRIDGE = 'bridge',
  CONTENT = 'content',
  NETWORK = 'network'
}

export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
  SILENT = 'silent'
}

export interface LogEvent {
  timestamp: Date;
  level: LogLevel;
  message: string;
  source: string;
  category: LogCategory;
  details?: Record<string, unknown>;
}

// Auth types
export type UserRole = 'user' | 'admin' | 'super_admin' | 'moderator' | 'editor' | 'builder' | 'guest';

// Admin layout types
export interface AdminLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

// Navigation types
export type NavigationItemType = {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  requiredRole: string[];
};
