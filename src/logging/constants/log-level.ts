
import { LogLevel, LogCategory } from '@/constants/logLevel';

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
  SUCCESS: 'SUCCESS',
  CRITICAL: 'CRITICAL'
};

/**
 * Maps string representation to log level
 */
export const STRING_TO_LOG_LEVEL: Record<string, LogLevel> = {
  'TRACE': 'TRACE',
  'DEBUG': 'DEBUG',
  'INFO': 'INFO',
  'WARN': 'WARN',
  'WARNING': 'WARN',
  'ERROR': 'ERROR',
  'CRITICAL': 'CRITICAL',
  'SUCCESS': 'SUCCESS',
  'FATAL': 'FATAL'
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
    case 'CRITICAL':
      return 'text-red-600 font-bold';
    case 'SUCCESS':
      return 'text-green-500';
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
  switch (level) {
    case 'WARN':
      return 'border-l-2 border-l-yellow-500';
    case 'ERROR':
      return 'border-l-2 border-l-red-500';
    case 'FATAL':
    case 'CRITICAL':
      return 'border-l-2 border-l-red-600 bg-red-950/20';
    case 'SUCCESS':
      return 'border-l-2 border-l-green-500';
    default:
      return '';
  }
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
    CRITICAL: 6,
    SUCCESS: 2 // SUCCESS is same priority as INFO
  };
  return levels[level] >= levels[minLevel];
}

/**
 * Get log level from string
 */
export function getLogLevelFromString(levelString: string): LogLevel {
  return STRING_TO_LOG_LEVEL[levelString.toUpperCase()] || 'INFO';
}
