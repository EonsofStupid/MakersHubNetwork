
/**
 * Log levels in order of increasing severity
 */
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  SUCCESS = 'success',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * Helper function to compare log levels
 * Returns true if the level is at least the minimum level
 */
export function isLogLevelAtLeast(level: LogLevel, minLevel: LogLevel): boolean {
  const levels = {
    [LogLevel.TRACE]: 0,
    [LogLevel.DEBUG]: 1,
    [LogLevel.INFO]: 2,
    [LogLevel.SUCCESS]: 2,
    [LogLevel.WARN]: 3,
    [LogLevel.ERROR]: 4,
    [LogLevel.CRITICAL]: 5
  };
  
  const levelValue = levels[level] ?? 0;
  const minLevelValue = levels[minLevel] ?? 0;
  
  return levelValue >= minLevelValue;
}
