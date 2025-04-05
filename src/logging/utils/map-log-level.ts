
import { LogLevel, LOG_LEVEL_VALUES } from '../constants/log-level';

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
 * Uses the LOG_LEVEL_VALUES from constants
 * 
 * @param level The level to check
 * @param minLevel The minimum level required
 * @returns True if level is at least minLevel
 */
export function isLogLevelAtLeast(level: LogLevel, minLevel: LogLevel): boolean {
  return LOG_LEVEL_VALUES[level] >= LOG_LEVEL_VALUES[minLevel];
}
