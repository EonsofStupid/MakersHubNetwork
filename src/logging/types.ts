
/**
 * Log levels from lowest to highest priority
 */
export type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

/**
 * Log categories for organizing logs
 */
export enum LogCategory {
  GENERAL = 'general',
  UI = 'ui',
  AUTH = 'auth',
  API = 'api',
  DATABASE = 'database',
  FEATURE = 'feature',
  THEME = 'theme',
  ADMIN = 'admin',
  CONTENT = 'content',
  SYSTEM = 'system',
  PERFORMANCE = 'performance'
}

/**
 * Logger options
 */
export interface LoggerOptions {
  category?: LogCategory | string;
  
  /** Additional fixed tags for all logs from this logger */
  tags?: string[];
  
  /** Minimum log level for this logger */
  minLevel?: LogLevel;
  
  /** If true, errors will be sent to error reporting service */
  reportErrors?: boolean;
  
  /** Additional context to include with all logs */
  context?: Record<string, any>;
  
  /** If true, the logger will include stack traces for all logs */
  includeTraces?: boolean;
  
  /** If this logger is disabled */
  disabled?: boolean;
}

/**
 * Options for individual log entries
 */
export interface LogOptions {
  /** Log level for this specific log */
  level?: LogLevel;
  
  /** Log category */
  category?: LogCategory | string;
  
  /** Tags for filtering/grouping */
  tags?: string[];
  
  /** Additional details (will be JSON stringified) */
  details?: any;
  
  /** Whether to include stack trace */
  includeTrace?: boolean;
  
  /** Custom timestamp (defaults to now) */
  timestamp?: Date;
  
  /** If true, this log will be reported to error service even if it's not an error */
  report?: boolean;
}

/**
 * Log entry structure
 */
export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  category: LogCategory | string;
  tags: string[];
  details?: any;
  trace?: string;
  user_id?: string;
  session_id?: string;
  app_version?: string;
}

/**
 * Transport interface for log destinations
 */
export interface LogTransport {
  log(entry: LogEntry): void;
  getLogs?(): LogEntry[];
  clear?(): void;
}

/**
 * Logger interface
 */
export interface Logger {
  trace(message: string, options?: LogOptions): void;
  debug(message: string, options?: LogOptions): void;
  info(message: string, options?: LogOptions): void;
  warn(message: string, options?: LogOptions): void;
  error(message: string, options?: LogOptions): void;
  fatal(message: string, options?: LogOptions): void;
}
