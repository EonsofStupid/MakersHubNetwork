
import { LogLevel } from '../constants/log-level';

/**
 * Check if a log level meets or exceeds the minimum level
 */
export function isLogLevelAtLeast(level: LogLevel, minLevel: LogLevel): boolean {
  const levelOrder = {
    [LogLevel.TRACE]: 0,
    [LogLevel.DEBUG]: 1,
    [LogLevel.INFO]: 2,
    [LogLevel.SUCCESS]: 3,
    [LogLevel.WARN]: 4,
    [LogLevel.ERROR]: 5,
    [LogLevel.CRITICAL]: 6,
  };

  return levelOrder[level] >= levelOrder[minLevel];
}

/**
 * Maps a log level string to the corresponding LogLevel enum value
 */
export function mapLogLevel(level: string): LogLevel {
  switch (level.toLowerCase()) {
    case 'trace':
      return LogLevel.TRACE;
    case 'debug':
      return LogLevel.DEBUG;
    case 'info':
      return LogLevel.INFO;
    case 'success':
      return LogLevel.SUCCESS;
    case 'warn':
    case 'warning':
      return LogLevel.WARN;
    case 'error':
      return LogLevel.ERROR;
    case 'critical':
    case 'fatal':
      return LogLevel.CRITICAL;
    default:
      return LogLevel.INFO;
  }
}

/**
 * Export a utility for use with TanStack Router and other contexts
 */
export const logLevelUtils = {
  isLogLevelAtLeast,
  mapLogLevel,
};
