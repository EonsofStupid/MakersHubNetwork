
import { LogLevel } from './constants/log-level';

/**
 * Log categories for grouping related log entries
 */
export enum LogCategory {
  SYSTEM = 'system',
  AUTH = 'auth',
  DATABASE = 'database',
  API = 'api',
  UI = 'ui',
  ADMIN = 'admin',
  THEME = 'theme',
  PERFORMANCE = 'performance',
  NETWORK = 'network',
  USER = 'user'
}

/**
 * Log entry structure
 */
export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  category?: LogCategory;
  source?: string;
  details?: Record<string, any>;
  user?: string;
  session?: string;
}

/**
 * Transport interface for implementing different logging destinations
 */
export interface LogTransport {
  id: string;
  name: string;
  enabled: boolean;
  log: (entry: LogEntry) => void;
}

/**
 * Configuration for the logging system
 */
export interface LoggingConfig {
  minLevel: LogLevel;
  enabledCategories: LogCategory[];
  transports: LogTransport[];
  bufferSize: number;
  flushInterval: number;
  includeSource: boolean;
  includeUser: boolean;
  includeSession: boolean;
}

/**
 * Performance timing interface for measuring code execution time
 */
export interface PerformanceTiming {
  label: string;
  startTime: number;
  endTime: number;
  duration: number;
  source?: string;
}

/**
 * Logger interface for type safety across different logger implementations
 */
export interface Logger {
  debug: (message: string, options?: { details?: Record<string, any> }) => void;
  trace: (message: string, options?: { details?: Record<string, any> }) => void;
  info: (message: string, options?: { details?: Record<string, any> }) => void;
  success: (message: string, options?: { details?: Record<string, any> }) => void;
  warn: (message: string, options?: { details?: Record<string, any> }) => void;
  error: (message: string, options?: { details?: Record<string, any> }) => void;
  critical: (message: string, options?: { details?: Record<string, any> }) => void;
  logCustomTiming: (label: string, startTime: number) => number;
}
