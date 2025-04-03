
/**
 * Log level definitions from most to least important
 */
export enum LogLevel {
  CRITICAL = 0,  // Most severe
  ERROR = 1,
  WARN = 2,      // Add WARN as alias for WARNING
  INFO = 3,
  DEBUG = 4,
  TRACE = 5,
  SUCCESS = 6    // Add SUCCESS level
}

/**
 * Log category for organization and filtering
 */
export enum LogCategory {
  SYSTEM = 'system',
  APP = 'app',
  AUTH = 'auth',
  ADMIN = 'admin',   // Add ADMIN category
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
  GENERAL = 'general' // Add GENERAL category as default
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
  id?: string;       // Add ID field for entries
  message: string;
  formatted?: string;
}

/**
 * Logging service configuration interface
 */
export interface LoggingConfig {
  minLevel: LogLevel;
  transports: LogTransport[];
  bufferSize?: number;
  flushInterval?: number;
  includeSource?: boolean;
  includeUser?: boolean;
  includeSession?: boolean;
  enabledCategories?: LogCategory[];
  disabledCategories?: LogCategory[];
}

/**
 * Logger instance interface
 */
export interface Logger {
  trace: (message: string, options?: LoggerOptions) => void;
  debug: (message: string, options?: LoggerOptions) => void;
  info: (message: string, options?: LoggerOptions) => void;
  warn: (message: string, options?: LoggerOptions) => void;
  error: (message: string, options?: LoggerOptions) => void;
  critical: (message: string, options?: LoggerOptions) => void;
  success: (message: string, options?: LoggerOptions) => void;
  performance: (message: string, duration: number, options?: LoggerOptions) => void;
}

/**
 * Log transport interface
 */
export interface LogTransport {
  log: (entry: LogEntry) => void;
  flush?: () => Promise<void>;
  getLogs?: () => LogEntry[];
  clear?: () => void;
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
  source: string;
  category: LogCategory;
  details: Record<string, unknown>;
  tags: string[];
  timestamp: string;
  session_id: string;
  user_id: string;
  duration: number;
}>;

/**
 * Options for performance logging
 */
export interface PerformanceLoggerOptions {
  category?: LogCategory;
  threshold?: number;  // Threshold in ms for warning logs
  details?: Record<string, unknown>;
  silent?: boolean;
  onComplete?: (data: MeasurementCompletionData) => void;
}

