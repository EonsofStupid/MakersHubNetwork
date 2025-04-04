
// Re-export LogLevel and LogCategory from the canonical source
export { LogLevel, LogCategory } from '@/constants/logLevel';

// Logger options
export interface LoggerOptions {
  category?: LogCategory;
  source?: string;
  includeTimestamps?: boolean;
  level?: LogLevel;
}

// Logger interface
export interface Logger {
  trace: (message: string, options?: LoggerOptions) => void;
  debug: (message: string, options?: LoggerOptions) => void;
  info: (message: string, options?: LoggerOptions) => void;
  warn: (message: string, options?: LoggerOptions) => void;
  error: (message: string, options?: LoggerOptions) => void;
  fatal: (message: string, options?: LoggerOptions) => void;
  success: (message: string, options?: LoggerOptions) => void;
  log: (level: LogLevel, message: string, options?: LoggerOptions) => void;
}

// Performance logging
export interface PerformanceLoggerOptions {
  category?: LogCategory;
  source?: string;
  includeTimestamps?: boolean;
  level?: LogLevel;
  threshold?: number;
}

// Log entry structure
export interface LogEntry {
  id?: string;
  timestamp: number | string;
  level: LogLevel;
  message: string;
  category?: LogCategory;
  source?: string;
  details?: any;
  sessionId?: string;
  userId?: string;
  meta?: Record<string, any>;
}

// Transport interface
export interface LogTransport {
  log: (entry: LogEntry) => void;
  flush?: () => Promise<void>;
  getLogs?: () => LogEntry[];
  clear?: () => void;
  subscribe?: (callback: (log: LogEntry) => void) => () => void;
}
