
import { LogLevel } from '../types';

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
 * Check if a log level meets or exceeds a minimum threshold
 */
export function isLogLevelAtLeast(level: LogLevel, minLevel: LogLevel): boolean {
  return level >= minLevel;
}

/**
 * Get a display name for a log level
 */
export function getLogLevelName(level: LogLevel): string {
  return LOG_LEVEL_NAMES[level] || 'UNKNOWN';
}

/**
 * Get appropriate styling classes for a log level
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

/**
 * Get the CSS class for log item borders based on level
 */
export function getLogItemClass(level: LogLevel): string {
  switch (level) {
    case LogLevel.WARN:
      return 'border-l-2 border-l-yellow-500';
    case LogLevel.ERROR:
      return 'border-l-2 border-l-red-500';
    case LogLevel.CRITICAL:
      return 'border-l-2 border-l-red-600 bg-red-950/20';
    case LogLevel.SUCCESS:
      return 'border-l-2 border-l-green-500';
    default:
      return '';
  }
}
