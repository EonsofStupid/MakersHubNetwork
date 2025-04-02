
import { LogLevel } from '../types';

/**
 * Mapping of log levels to their display names
 */
export const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.TRACE]: 'TRACE',
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO', 
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.CRITICAL]: 'CRITICAL',
  [LogLevel.SUCCESS]: 'SUCCESS'
};

/**
 * Check if a log level meets or exceeds a minimum level
 */
export function isLogLevelAtLeast(level: LogLevel, minLevel: LogLevel): boolean {
  return level >= minLevel;
}

/**
 * Get a CSS color class for a log level
 */
export function getLogLevelColorClass(level: LogLevel): string {
  switch (level) {
    case LogLevel.TRACE:
      return 'text-gray-500';
    case LogLevel.DEBUG:
      return 'text-gray-400';
    case LogLevel.INFO:
      return 'text-blue-400';
    case LogLevel.WARN:
      return 'text-yellow-400';
    case LogLevel.ERROR:
      return 'text-red-400';
    case LogLevel.CRITICAL:
      return 'text-red-600 font-bold';
    case LogLevel.SUCCESS:
      return 'text-green-400';
    default:
      return 'text-gray-400';
  }
}
