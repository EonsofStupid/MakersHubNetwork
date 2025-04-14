
/**
 * Logging system types
 */

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
  TRACE = 'trace',
  SUCCESS = 'success',
  FATAL = 'fatal',
  SILENT = 'silent'
}

// Log categories - single source of truth
export enum LogCategory {
  AUTH = 'auth',
  RBAC = 'rbac',
  API = 'api',
  UI = 'ui',
  SYSTEM = 'system',
  ADMIN = 'admin',
  THEME = 'theme',
  DEBUG = 'debug',
  APP = 'app',
  CHAT = 'chat'
}

// Log details
export interface LogDetails {
  source?: string;
  details?: Record<string, unknown>;
  [key: string]: unknown;
}

// Log entry
export interface LogEntry {
  id: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  timestamp: number;
  details?: LogDetails;
  source?: string;
}

// Log event
export interface LogEvent {
  entry: LogEntry;
}

// Log filter
export interface LogFilter {
  level?: LogLevel;
  category?: LogCategory;
  search?: string;
  startTime?: number;
  endTime?: number;
  source?: string;
  from?: Date | number;
  to?: Date | number;
}

// Log transport
export interface LogTransport {
  log: (entry: LogEntry) => void;
  setMinLevel: (level: LogLevel) => void;
  name?: string;
}

// Legacy mappings for backward compatibility - to be removed post-migration
export const LOG_LEVEL = LogLevel;
export const LOG_CATEGORY = LogCategory;

export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.SUCCESS]: 2,
  [LogLevel.WARN]: 3,
  [LogLevel.ERROR]: 4,
  [LogLevel.CRITICAL]: 5,
  [LogLevel.FATAL]: 6,
  [LogLevel.TRACE]: -1,
  [LogLevel.SILENT]: 100
};
