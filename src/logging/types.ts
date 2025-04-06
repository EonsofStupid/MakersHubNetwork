
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
  USER = 'user',
  CONTENT = 'content' // Adding missing CONTENT category
}

/**
 * Log entry structure
 */
export interface LogEntry {
  id?: string; // Make ID required for UI components
  timestamp: number;
  level: LogLevel;
  message: string;
  category?: LogCategory;
  source?: string;
  details?: Record<string, any>;
  user?: string;
  session?: string;
  tags?: string[]; // Add support for tags
}

/**
 * Transport interface for implementing different logging destinations
 */
export interface LogTransport {
  id: string;
  name: string;
  enabled: boolean;
  log: (entry: LogEntry) => void;
  
  // Make these methods required, not optional
  getLogs: () => LogEntry[];
  subscribe: (callback: (entry: LogEntry) => void) => { unsubscribe: () => void };
  clear: () => void;
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
 * Logger options type 
 */
export interface LogOptions {
  details?: Record<string, any>;
  category?: LogCategory;
  source?: string;
  tags?: string[]; // Add support for tags
}

/**
 * Logger interface for type safety across different logger implementations
 */
export interface Logger {
  debug: (message: string, options?: LogOptions) => void;
  trace: (message: string, options?: LogOptions) => void;
  info: (message: string, options?: LogOptions) => void;
  success: (message: string, options?: LogOptions) => void;
  warn: (message: string, options?: LogOptions) => void;
  error: (message: string, options?: LogOptions) => void;
  critical: (message: string, options?: LogOptions) => void;
  logCustomTiming: (label: string, startTime: number) => number;
}

// Re-export LogLevel for components that import from types
export { LogLevel } from './constants/log-level';
