
// Re-export log level and category constants from the canonical source
import { LogLevel, LogCategory } from '../types';

export { LogLevel, LogCategory };

// Log level name mapping for UI display
export const LOG_LEVEL_NAMES: Record<number, string> = {
  0: 'TRACE',
  1: 'DEBUG', 
  2: 'INFO',
  3: 'WARN',
  4: 'ERROR',
  5: 'FATAL/CRITICAL',
};

/**
 * Check if a log level meets or exceeds the minimum level
 */
export function isLogLevelAtLeast(level: number, minLevel: number): boolean {
  return level >= minLevel;
}

/**
 * Get CSS color class for a log level
 */
export function getLogLevelColorClass(level: number): string {
  switch (level) {
    case 0: return 'text-gray-400'; // TRACE
    case 1: return 'text-gray-500'; // DEBUG
    case 2: return 'text-blue-500'; // INFO/SUCCESS 
    case 3: return 'text-yellow-500'; // WARN
    case 4: return 'text-red-500'; // ERROR
    case 5: return 'text-red-600 font-bold'; // FATAL/CRITICAL
    default: return 'text-gray-500';
  }
}
