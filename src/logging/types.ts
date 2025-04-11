
/**
 * Core logging types
 */
import React from 'react';

export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  SUCCESS = 'success',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * LogCategory enum for consistent categorization across the app
 */
export enum LogCategory {
  SYSTEM = 'system',
  AUTH = 'auth',
  UI = 'ui',
  API = 'api',
  DATABASE = 'database',
  CHAT = 'chat',
  ADMIN = 'admin',
  NETWORK = 'network',
  PERF = 'performance',
  SECURITY = 'security',
  USER = 'user',
  PERFORMANCE = 'performance',
  CONTENT = 'content',
  THEME = 'theme',
  NOTIFICATION = 'notification',
  ANALYTICS = 'analytics',
  PAYMENT = 'payment',
  MEDIA = 'media'
}

/**
 * Core log entry structure
 */
export interface LogEntry {
  id: string;
  timestamp: string | Date;
  level: LogLevel;
  message: string | React.ReactNode | unknown;
  category: LogCategory;
  source?: string;
  details?: Record<string, unknown> | unknown;
  userId?: string;
  sessionId?: string;
  tags?: string[];
  duration?: number; // Add duration field for performance metrics
}

/**
 * Log filter options
 */
export interface LogFilterOptions {
  level?: LogLevel;
  levels?: LogLevel[];
  category?: LogCategory;
  categories?: LogCategory[];
  source?: string;
  sources?: string[];
  from?: Date;
  to?: Date;
  limit?: number;
  search?: string;
  userId?: string;
  sessionId?: string;
  tags?: string[];
}

/**
 * Log transport interface
 */
export interface LogTransport {
  log(entry: LogEntry): void;
  getEntries(filter?: LogFilterOptions): LogEntry[];
  clear(): void;
}

/**
 * Logging configuration
 */
export interface LoggingConfig {
  level: LogLevel;
  enabled: boolean;
  consoleTransport: boolean;
  memoryTransport: boolean;
  uiTransport: boolean;
  memoryLimit: number;
}
