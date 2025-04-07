
import { ReactNode } from 'react';

/**
 * Log levels in order of increasing severity
 */
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  SUCCESS = 'success',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum LogCategory {
  SYSTEM = 'system',
  NETWORK = 'network',
  UI = 'ui',
  AUTH = 'auth',
  ADMIN = 'admin',
  PERFORMANCE = 'performance',
  CHAT = 'chat',
  THEME = 'theme',
  DATABASE = 'database',
  CONTENT = 'content'
}

export interface LogMessage {
  level: LogLevel;
  message: string | ReactNode;
  timestamp: Date;
  category?: LogCategory;
  source?: string;
  details?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  duration?: number;
  tags?: string[];
  error?: boolean;
  success?: boolean;
}

export interface LogEntry extends LogMessage {
  id: string;
  searchableMessage?: string; // For searching log messages
  searchableDetails?: string; // For searching log details
}

export interface LogOptions {
  category?: LogCategory;
  source?: string;
  details?: Record<string, unknown>;
  tags?: string[];
  userId?: string;
  sessionId?: string;
  duration?: number;
  error?: boolean;
  success?: boolean;
  warning?: boolean;
}

export interface LoggerOptions {
  minLevel?: LogLevel;
  enableConsole?: boolean;
  bufferSize?: number;
  defaultCategory?: LogCategory;
  defaultSource?: string;
}

export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  bufferSize: number;
  defaultCategory: LogCategory;
  defaultSource: string;
  context?: Record<string, unknown>; // Adding context to LoggerConfig
  transports: Transport[];
}

export interface Logger {
  debug: (message: string | ReactNode, options?: LogOptions) => LogEntry | undefined;
  info: (message: string | ReactNode, options?: LogOptions) => LogEntry | undefined;
  warn: (message: string | ReactNode, options?: LogOptions) => LogEntry | undefined;
  error: (message: string | ReactNode, options?: LogOptions) => LogEntry | undefined;
  critical: (message: string | ReactNode, options?: LogOptions) => LogEntry | undefined;
  getTransports: () => Transport[]; // Add this method to Logger interface
}

export interface Transport {
  log: (logEntry: LogEntry) => void;
  flush?: () => Promise<void>;
  getLogs?: () => LogEntry[];
  getFilteredLogs?: (options?: any) => LogEntry[];
  clear?: () => void;
  subscribe?: (callback: (logs: LogEntry[]) => void) => () => void;
}

// Add LoggingConfig interface needed by logger.service.ts
export interface LoggingConfig {
  minLevel: LogLevel;
  transports: Transport[];
  bufferSize?: number;
  flushInterval?: number;
  includeSource?: boolean;
  includeUser?: boolean;
  includeSession?: boolean;
  enabledCategories?: LogCategory[];
}
