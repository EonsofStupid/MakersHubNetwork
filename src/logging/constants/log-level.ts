
import { LogLevel } from '../types';

/**
 * Names for log levels
 */
export const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  TRACE: 'TRACE',
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  FATAL: 'FATAL',
};

/**
 * Log level color classes for UI display
 */
export function getLogLevelColorClass(level: LogLevel): string {
  switch (level) {
    case 'TRACE':
      return 'text-slate-400';
    case 'DEBUG':
      return 'text-blue-400';
    case 'INFO':
      return 'text-green-400';
    case 'WARN':
      return 'text-amber-400';
    case 'ERROR':
      return 'text-red-500';
    case 'FATAL':
      return 'text-red-600 font-bold';
    default:
      return 'text-slate-400';
  }
}

/**
 * Get user-friendly log level name
 */
export function getLogLevelName(level: LogLevel): string {
  return LOG_LEVEL_NAMES[level] || 'UNKNOWN';
}

/**
 * Returns CSS classes for log item based on level
 */
export function getLogItemClass(level: LogLevel): string {
  return `log-item log-level-${level.toLowerCase()} ${getLogLevelColorClass(level)}`;
}

/**
 * Check if a log level meets or exceeds a minimum level
 */
export function isLogLevelAtLeast(level: LogLevel, minLevel: LogLevel): boolean {
  const levels: Record<LogLevel, number> = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5,
  };
  return levels[level] >= levels[minLevel];
}
