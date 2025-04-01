
/**
 * Logging levels as a proper enum with string values
 */

// Define log levels as an enum (recommended for this case)
export enum LogLevel {
  DEBUG = 'debug',
  TRACE = 'trace',
  INFO = 'info',
  SUCCESS = 'success',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Define log level values for numeric comparison
export const LOG_LEVEL_VALUES = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.TRACE]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.SUCCESS]: 3,
  [LogLevel.WARN]: 4,
  [LogLevel.ERROR]: 5,
  [LogLevel.CRITICAL]: 6,
};

// Function to compare log levels
export function isLogLevelAtLeast(level: LogLevel, minLevel: LogLevel): boolean {
  return LOG_LEVEL_VALUES[level] >= LOG_LEVEL_VALUES[minLevel];
}
