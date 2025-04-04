
// Re-export log level and category constants from the canonical source
export * from '@/logging/types';

// Utility function to check if a log level meets minimum threshold
export function isLogLevelAtLeast(level: number, minLevel: number): boolean {
  return level >= minLevel;
}

// Color mapping for log levels
export const LOG_LEVEL_COLORS = {
  0: '#6B7280', // TRACE: gray-500
  1: '#3B82F6', // DEBUG: blue-500
  2: '#10B981', // INFO/SUCCESS: green-500
  3: '#F59E0B', // WARN: amber-500
  4: '#EF4444', // ERROR: red-500
  5: '#7C3AED', // FATAL/CRITICAL: purple-600
};

// Name mapping for log levels
export const LOG_LEVEL_NAMES = {
  0: 'TRACE',
  1: 'DEBUG',
  2: 'INFO',
  3: 'WARN',
  4: 'ERROR',
  5: 'FATAL',
  2.1: 'SUCCESS', // SUCCESS shares level with INFO
  5.1: 'CRITICAL' // CRITICAL shares level with FATAL
};

// Get CSS class for log level
export function getLogLevelColorClass(level: number): string {
  switch (level) {
    case 0: // TRACE
      return 'text-gray-500';
    case 1: // DEBUG
      return 'text-blue-500';
    case 2: // INFO/SUCCESS
      return 'text-green-500';
    case 3: // WARN
      return 'text-amber-500';
    case 4: // ERROR
      return 'text-red-500';
    case 5: // FATAL/CRITICAL
      return 'text-purple-600';
    default:
      return 'text-gray-700';
  }
}
