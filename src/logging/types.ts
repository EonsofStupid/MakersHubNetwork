
/**
 * Log level definitions from most to least important
 */
export enum LogLevel {
  EMERGENCY = 'emergency',
  ALERT = 'alert',
  CRITICAL = 'critical',
  ERROR = 'error',
  WARNING = 'warning',
  NOTICE = 'notice',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
  PERFORMANCE = 'performance'
}

/**
 * Mapping of log level to numeric value for comparisons
 */
export const LOG_LEVEL_VALUE: Record<LogLevel, number> = {
  [LogLevel.EMERGENCY]: 0,
  [LogLevel.ALERT]: 1,
  [LogLevel.CRITICAL]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.WARNING]: 4,
  [LogLevel.NOTICE]: 5,
  [LogLevel.INFO]: 6,
  [LogLevel.DEBUG]: 7,
  [LogLevel.TRACE]: 8,
  [LogLevel.PERFORMANCE]: 9,
};

/**
 * Log category for organization and filtering
 */
export enum LogCategory {
  APP = 'app',
  AUTH = 'auth',
  API = 'api',
  DATABASE = 'database',
  UI = 'ui',
  NAVIGATION = 'navigation',
  PERFORMANCE = 'performance',
  THEME = 'theme',
  ANALYTICS = 'analytics',
  STORAGE = 'storage',
  ERROR = 'error',
  SECURITY = 'security',
  NETWORK = 'network',
  SYSTEM = 'system',
}

/**
 * Interface for log entry metadata
 */
export interface LogMetadata {
  level: LogLevel;
  source: string;
  timestamp: string;
  category?: LogCategory;
  details?: Record<string, unknown>;
  tags?: string[];
  session_id?: string;
  user_id?: string;
  duration?: number;
}

/**
 * Interface for a log entry
 */
export interface LogEntry extends LogMetadata {
  message: string;
  formatted?: string;
}

/**
 * Logging service configuration interface
 */
export interface LoggerConfig {
  minLevel: LogLevel;
  logToConsole: boolean;
  logToServer: boolean;
  serverEndpoint?: string;
  includeTimestamp: boolean;
  includeSource: boolean;
  enableStackTrace: boolean;
  customFormatter?: (entry: LogEntry) => string;
  metadata?: Record<string, unknown>;
  enabledCategories?: LogCategory[];
  disabledCategories?: LogCategory[];
  samplingRate?: number;
  allowRemoteConfig?: boolean;
}

/**
 * Logger instance interface
 */
export interface Logger {
  emergency(message: string, meta?: LogMetadata | Record<string, unknown>): void;
  alert(message: string, meta?: LogMetadata | Record<string, unknown>): void;
  critical(message: string, meta?: LogMetadata | Record<string, unknown>): void;
  error(message: string, meta?: LogMetadata | Record<string, unknown>): void;
  warn(message: string, meta?: LogMetadata | Record<string, unknown>): void;
  notice(message: string, meta?: LogMetadata | Record<string, unknown>): void;
  info(message: string, meta?: LogMetadata | Record<string, unknown>): void;
  debug(message: string, meta?: LogMetadata | Record<string, unknown>): void;
  trace(message: string, meta?: LogMetadata | Record<string, unknown>): void;
  performance(operation: string, duration: number, meta?: LogMetadata | Record<string, unknown>): void;
  log(level: LogLevel, message: string, meta?: LogMetadata | Record<string, unknown>): void;
  group(label: string, collapsed?: boolean): void;
  groupEnd(): void;
  withContext(context: Record<string, unknown>): Logger;
}

/**
 * Performance measurement completion data
 */
export interface MeasurementCompletionData {
  name: string;
  duration: number;
  success: boolean;
  error?: unknown;
  [key: string]: any;
}

// Export LoggerOptions type for convenience
export type LoggerOptions = Partial<{
  category: LogCategory;
  details: Record<string, unknown>;
  tags: string[];
  timestamp: string;
  session_id: string;
  user_id: string;
  duration: number;
}>;
