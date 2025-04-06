
/**
 * Log level enum for the application logging system
 */
export enum LogLevel {
  TRACE = 10,
  DEBUG = 20,
  INFO = 30,
  WARN = 40,
  ERROR = 50,
  CRITICAL = 60,
  SUCCESS = 35,  // Added SUCCESS log level between INFO and WARN
}

/**
 * Check if a log level meets or exceeds a certain threshold level
 */
export function isLogLevelAtLeast(level: LogLevel, minLevel: LogLevel): boolean {
  return level >= minLevel;
}

/**
 * Map of log level values for easier reference
 */
export const LOG_LEVEL_VALUES = {
  TRACE: LogLevel.TRACE,
  DEBUG: LogLevel.DEBUG,
  INFO: LogLevel.INFO,
  WARN: LogLevel.WARN,
  ERROR: LogLevel.ERROR,
  CRITICAL: LogLevel.CRITICAL,
  SUCCESS: LogLevel.SUCCESS  // Added SUCCESS log level
};
