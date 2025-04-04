
import { ReactNode } from 'react';
import { LogLevel, LogCategory } from '@/constants/logLevel';

/**
 * Logger options
 */
export interface LoggerOptions {
  /** Log category */
  category?: LogCategory;
  
  /** Additional fixed tags for all logs */
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

  /** Additional details to include with the log */
  details?: any;
  
  /** Source of the log (usually component name) */
  source?: string;
}

// Re-export LogLevel and LogCategory for broader usage
export { LogLevel, LogCategory };

/**
 * Options for individual log entries
 */
export interface LogOptions {
  /** Log level for this specific log */
  level?: LogLevel;
  
  /** Log category */
  category?: LogCategory;
  
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
  
  /** Source of the log (usually component name) */
  source?: string;
}

/**
 * Log entry structure
 */
export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string | ReactNode;
  category: LogCategory;
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
  flush?(): Promise<void>;
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
  success(message: string, options?: LogOptions): void;
  critical(message: string, options?: LogOptions): void;
  performance?(message: string, duration: number, options?: LogOptions): void;
}

/**
 * Performance measurement result
 */
export interface MeasurementResult {
  name: string;
  duration: number;
  success: boolean;
  timestamp: number;
  error?: Error;
}

/**
 * Performance measurement options
 */
export interface PerformanceMeasurementOptions {
  category?: LogCategory;
  warnThreshold?: number;
  onComplete?: (result: MeasurementResult) => void;
  tags?: string[];
  details?: Record<string, any>;
}

/**
 * Logging configuration
 */
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

/**
 * Log event callback
 */
export type LogEventCallback = (entry: LogEntry) => void;
