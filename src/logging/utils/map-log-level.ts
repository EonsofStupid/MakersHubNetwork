
import { LogLevel } from '@/shared/types/shared.types';
import { LOG_LEVEL_VALUES } from '../constants/log-level';

// Map log level to string representation for UI
export const LOG_LEVEL_MAP: Record<LogLevel, string> = {
  [LogLevel.TRACE]: 'trace',
  [LogLevel.DEBUG]: 'debug',
  [LogLevel.INFO]: 'info',
  [LogLevel.SUCCESS]: 'success',
  [LogLevel.WARN]: 'warn',
  [LogLevel.ERROR]: 'error',
  [LogLevel.CRITICAL]: 'critical',
  [LogLevel.SILENT]: 'silent'
};

/**
 * Checks if a log level is at least as severe as another log level
 * @param level The level to check
 * @param minLevel The minimum level required
 * @returns boolean indicating if level meets or exceeds minLevel
 */
export function isLogLevelAtLeast(level: LogLevel, minLevel: LogLevel): boolean {
  return LOG_LEVEL_VALUES[level] >= LOG_LEVEL_VALUES[minLevel];
}
