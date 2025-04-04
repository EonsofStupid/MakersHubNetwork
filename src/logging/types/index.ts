
// Define log levels for the entire application
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
  SUCCESS = 2, // Same level as INFO
  CRITICAL = 5  // Same level as FATAL
}

// Define log categories for easier filtering
export enum LogCategory {
  SYSTEM = 'system',
  APPLICATION = 'application',
  AUTHENTICATION = 'auth',
  AUTH = 'auth', // Add auth alias for backward compatibility
  DATABASE = 'database',
  NETWORK = 'network',
  UI = 'ui',
  PERFORMANCE = 'performance',
  THEME = 'theme',
  ANALYTICS = 'analytics',
  USER_ACTION = 'user-action',
  GENERAL = 'general',
  ADMIN = 'admin',
  CONTENT = 'content',
  DATA = 'data',
  ERROR = 'error',
  API = 'api',
  FEATURE = 'feature'
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
  source?: string;
}

// Logger interface for consistent logging across the app
export interface Logger {
  trace: (message: string, additionalOptions?: Partial<LoggerOptions>) => void;
  debug: (message: string, additionalOptions?: Partial<LoggerOptions>) => void;
  info: (message: string, additionalOptions?: Partial<LoggerOptions>) => void;
  warn: (message: string, additionalOptions?: Partial<LoggerOptions>) => void;
  error: (message: string, additionalOptions?: Partial<LoggerOptions>) => void;
  fatal: (message: string, additionalOptions?: Partial<LoggerOptions>) => void;
  success: (message: string, additionalOptions?: Partial<LoggerOptions>) => void;
  critical: (message: string, additionalOptions?: Partial<LoggerOptions>) => void;
  log: (level: LogLevel, message: string, additionalOptions?: Partial<LoggerOptions>) => void;
  performance: (name: string, durationMs: number, success: boolean, additionalOptions?: Partial<LoggerOptions>) => void;
}

// Log entry structure
export interface LogEntry {
  id: string;
  level: LogLevel;
  category?: LogCategory;
  message: string | React.ReactNode;
  timestamp: string | Date;
  details?: Record<string, any>;
  tags?: string[];
  userId?: string;
  component?: string;
  correlationId?: string;
  success?: boolean;
  source?: string;
  user_id?: string;
  session_id?: string;
  app_version?: string;
  trace?: string;
}

// Transport interface for consistent log handling
export interface LogTransport {
  initialize?: () => Promise<void>;
  log: (entry: LogEntry) => void;
  filter?: (entry: LogEntry) => boolean;
  flush?: () => Promise<void>;
  getLogs?: (limit?: number, filterFn?: (entry: LogEntry) => boolean) => LogEntry[];
  clear?: () => void;
  subscribe?: (callback: (entry: LogEntry) => void) => () => void;
}

// Performance measurement options
export interface PerformanceMeasurementOptions {
  category?: LogCategory;
  warnThreshold?: number;
  onComplete?: (result: { name: string; duration: number; success: boolean }) => void;
  source?: string;
  tags?: string[];
  details?: Record<string, any>;
}

// Performance measurement result
export interface MeasurementResult {
  name: string;
  duration: number;
  success: boolean;
  timestamp: number;
  error?: Error;
}

// Logging configuration
export interface LoggingConfig {
  minLevel: LogLevel;
  enabled?: boolean;
  transports: LogTransport[];
  categoryLevels?: Partial<Record<LogCategory, LogLevel>>;
  enabledCategories?: LogCategory[];
  disabledCategories?: LogCategory[];
  bufferSize?: number;
  flushInterval?: number;
  includeSource?: boolean;
  includeUser?: boolean;
  includeSession?: boolean;
}

// Log event callback
export type LogEventCallback = (entry: LogEntry) => void;

// Logging context type for the React provider
export interface LoggingContextType {
  logs: LogEntry[];
  clearLogs: () => void;
  showLogConsole: boolean;
  setShowLogConsole: (show: boolean) => void;
  toggleLogConsole: () => void;
  minLogLevel: LogLevel;
  setMinLogLevel: (level: LogLevel) => void;
}

// Log options
export interface LogOptions {
  level?: LogLevel;
  category?: LogCategory;
  tags?: string[];
  details?: any;
  includeTrace?: boolean;
  timestamp?: Date;
  report?: boolean;
  source?: string;
}

// Performance logger options
export interface PerformanceLoggerOptions {
  category?: LogCategory;
  source?: string;
  autoStart?: boolean;
  warnThreshold?: number;
  includeInTimeline?: boolean;
}
