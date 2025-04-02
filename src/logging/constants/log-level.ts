
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

export const LOG_LEVEL_NAMES = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARNING',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.CRITICAL]: 'CRITICAL'
};

/**
 * Check if a log level is at least as severe as the minimum level
 */
export function isLogLevelAtLeast(level: LogLevel, minLevel: LogLevel): boolean {
  return level >= minLevel;
}
