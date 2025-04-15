
/**
 * Logging related type definitions
 */

export enum LogCategory {
  APP = 'APP',
  ADMIN = 'ADMIN',
  AUTH = 'AUTH',
  API = 'API',
  UI = 'UI',
  PERFORMANCE = 'PERFORMANCE',
  ERROR = 'ERROR',
  SECURITY = 'SECURITY',
  THEME = 'THEME',
  RBAC = 'RBAC',
  SYSTEM = 'SYSTEM',
  CHAT = 'CHAT',
  DEBUG = 'DEBUG'
}

export type LogCategoryType = keyof typeof LogCategory;

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
  TRACE = -1,
  SUCCESS = 5,
  FATAL = 6,
  SILENT = 100
}

// Mapping for log level values
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.TRACE]: -1,
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.CRITICAL]: 4,
  [LogLevel.SUCCESS]: 5,
  [LogLevel.FATAL]: 6,
  [LogLevel.SILENT]: 100
};

export interface LogDetails {
  source?: string;
  moduleId?: string;
  moduleName?: string;
  path?: string;
  errorMessage?: string;
  required?: string;
  requiredPerm?: string;
  eventType?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  id: string;
  level: LogLevel;
  category: LogCategoryType;
  message: string;
  timestamp: number;
  details?: LogDetails;
  source?: string;
}

export interface LogEvent {
  entry: LogEntry;
}

export interface LogFilter {
  level?: LogLevel;
  category?: LogCategoryType;
  from?: number | Date;
  to?: number | Date;
  search?: string;
}
