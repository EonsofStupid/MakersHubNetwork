
import { LogLevel } from '../types';

export { LogLevel };

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
