
// Define log levels for the entire application
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5
}

// Define log categories for easier filtering
export enum LogCategory {
  SYSTEM = 'system',
  APPLICATION = 'application',
  AUTHENTICATION = 'auth',
  DATABASE = 'database',
  NETWORK = 'network',
  UI = 'ui',
  PERFORMANCE = 'performance',
  THEME = 'theme',
  ANALYTICS = 'analytics',
  USER_ACTION = 'user-action'
}

// Base logger options
export interface LoggerOptions {
  level?: LogLevel;
  category?: LogCategory;
  details?: Record<string, any>;
  tags?: string[];
  userId?: string;
  component?: string;
  timestamp?: string;
  correlationId?: string;
}

// Logger interface for consistent logging across the app
export interface Logger {
  trace: (message: string, additionalOptions?: Partial<LoggerOptions>) => void;
  debug: (message: string, additionalOptions?: Partial<LoggerOptions>) => void;
  info: (message: string, additionalOptions?: Partial<LoggerOptions>) => void;
  warn: (message: string, additionalOptions?: Partial<LoggerOptions>) => void;
  error: (message: string, additionalOptions?: Partial<LoggerOptions>) => void;
  fatal: (message: string, additionalOptions?: Partial<LoggerOptions>) => void;
  log: (level: LogLevel, message: string, additionalOptions?: Partial<LoggerOptions>) => void;
  performance: (name: string, durationMs: number, success: boolean, additionalOptions?: Partial<LoggerOptions>) => void;
}

// Log entry structure
export interface LogEntry {
  id: string;
  level: LogLevel;
  category?: LogCategory;
  message: string;
  timestamp: string | Date;
  details?: Record<string, any>;
  tags?: string[];
  userId?: string;
  component?: string;
  correlationId?: string;
  success?: boolean;
  source?: string;
}

// Transport interface for consistent log handling
export interface LogTransport {
  initialize?: () => Promise<void>;
  log: (entry: LogEntry) => void;
  filter?: (entry: LogEntry) => boolean;
  flush?: () => Promise<void>;
  getLogs?: (limit?: number, filterFn?: (entry: LogEntry) => boolean) => LogEntry[];
  subscribe?: (callback: (entry: LogEntry) => void) => () => void;
}
