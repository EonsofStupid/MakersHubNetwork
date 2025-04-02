
import { LogLevel, LOG_LEVEL_NAMES } from '../constants/log-level';

/**
 * Maps log levels to their string representation
 */
export const LOG_LEVEL_MAP = LOG_LEVEL_NAMES;

/**
 * Maps string representation to log level
 */
export const STRING_TO_LOG_LEVEL: Record<string, LogLevel> = {
  'TRACE': LogLevel.TRACE,
  'DEBUG': LogLevel.DEBUG,
  'INFO': LogLevel.INFO,
  'WARN': LogLevel.WARN,
  'WARNING': LogLevel.WARN,
  'ERROR': LogLevel.ERROR,
  'CRITICAL': LogLevel.CRITICAL,
  'SUCCESS': LogLevel.SUCCESS
};

/**
 * Get log level from string
 */
export function getLogLevelFromString(levelString: string): LogLevel {
  return STRING_TO_LOG_LEVEL[levelString.toUpperCase()] || LogLevel.INFO;
}
