
import { LogLevel } from '../constants/log-level';

/**
 * Maps LogLevel enum values to their string representation
 */
export const LOG_LEVEL_MAP: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: "DEBUG",
  [LogLevel.TRACE]: "TRACE",
  [LogLevel.INFO]: "INFO",
  [LogLevel.SUCCESS]: "SUCCESS",
  [LogLevel.WARN]: "WARN", 
  [LogLevel.ERROR]: "ERROR",
  [LogLevel.CRITICAL]: "CRITICAL"
};

/**
 * Safely compares log levels
 * @param level The level to check
 * @param minLevel The minimum level required
 * @returns True if level is at least minLevel
 */
export function isLogLevelAtLeast(level: LogLevel, minLevel: LogLevel): boolean {
  // Use the values from LOG_LEVEL_VALUES in constants
  const levelValues = {
    [LogLevel.DEBUG]: 0,
    [LogLevel.TRACE]: 1,
    [LogLevel.INFO]: 2,
    [LogLevel.SUCCESS]: 3,
    [LogLevel.WARN]: 4,
    [LogLevel.ERROR]: 5,
    [LogLevel.CRITICAL]: 6,
  };
  return levelValues[level] >= levelValues[minLevel];
}
