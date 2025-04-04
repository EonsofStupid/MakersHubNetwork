
/**
 * Log levels
 */
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
  NONE = 'none'
}

/**
 * Log level numbers for comparisons
 */
export const LogLevelValue = {
  [LogLevel.TRACE]: 0,
  [LogLevel.DEBUG]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.WARN]: 3,
  [LogLevel.ERROR]: 4,
  [LogLevel.CRITICAL]: 5,
  [LogLevel.NONE]: 6
};

/**
 * Log categories for better organization
 */
export enum LogCategory {
  APP = 'APP',
  UI = 'UI',
  API = 'API',
  AUTH = 'AUTH',
  DATA = 'DATA',
  THEME = 'THEME',
  ADMIN = 'ADMIN',
  CONTENT = 'CONTENT',
  LAYOUT = 'LAYOUT',
  PERFORMANCE = 'PERFORMANCE',
  ERROR = 'ERROR',
  USER = 'USER',
  SYSTEM = 'SYSTEM'
}

/**
 * Default log level if none is specified
 */
export const DEFAULT_LOG_LEVEL = LogLevel.INFO;

/**
 * Color mapping for log levels in console output
 */
export const LogLevelColors = {
  [LogLevel.TRACE]: '#6b7280', // Gray
  [LogLevel.DEBUG]: '#60a5fa', // Blue
  [LogLevel.INFO]: '#10b981', // Green
  [LogLevel.WARN]: '#f59e0b', // Yellow
  [LogLevel.ERROR]: '#ef4444', // Red
  [LogLevel.CRITICAL]: '#7f1d1d' // Dark Red
};

/**
 * Convert a string log level to enum value
 */
export function parseLogLevel(level: string): LogLevel {
  const normalizedLevel = level.toLowerCase();
  
  switch (normalizedLevel) {
    case 'trace':
      return LogLevel.TRACE;
    case 'debug':
      return LogLevel.DEBUG;
    case 'info':
      return LogLevel.INFO;
    case 'warn':
    case 'warning':
      return LogLevel.WARN;
    case 'error':
      return LogLevel.ERROR;
    case 'critical':
    case 'fatal':
      return LogLevel.CRITICAL;
    case 'none':
    case 'off':
      return LogLevel.NONE;
    default:
      return DEFAULT_LOG_LEVEL;
  }
}
