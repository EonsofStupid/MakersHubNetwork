
/**
 * Logging levels constants and types
 */

// Define log levels as runtime constants
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn', 
  ERROR: 'error',
  SUCCESS: 'success',
  TRACE: 'trace',
  CRITICAL: 'critical',
} as const;

// Define log level values for numeric comparison
export const LOG_LEVEL_VALUES = {
  [LOG_LEVELS.DEBUG]: 0,
  [LOG_LEVELS.TRACE]: 1,
  [LOG_LEVELS.INFO]: 2,
  [LOG_LEVELS.SUCCESS]: 3,
  [LOG_LEVELS.WARN]: 4,
  [LOG_LEVELS.ERROR]: 5,
  [LOG_LEVELS.CRITICAL]: 6,
};

// Type for log levels
export type LogLevel = typeof LOG_LEVELS[keyof typeof LOG_LEVELS];

// Function to compare log levels
export function isLogLevelAtLeast(level: LogLevel, minLevel: LogLevel): boolean {
  return LOG_LEVEL_VALUES[level] >= LOG_LEVEL_VALUES[minLevel];
}
