
import { LogLevel } from '@/shared/types/shared.types';

// Map of log level values for comparisons
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.TRACE]: 0,
  [LogLevel.DEBUG]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.SUCCESS]: 3,
  [LogLevel.WARN]: 4,
  [LogLevel.ERROR]: 5,
  [LogLevel.FATAL]: 6,
  [LogLevel.CRITICAL]: 7,
  [LogLevel.SILENT]: 8
};

// Map log levels to colors for display
export const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  [LogLevel.TRACE]: '#6d6d6d',  // Dark gray
  [LogLevel.DEBUG]: '#888888',  // Gray
  [LogLevel.INFO]: '#2563eb',   // Blue
  [LogLevel.SUCCESS]: '#10b981', // Green
  [LogLevel.WARN]: '#f59e0b',   // Amber
  [LogLevel.ERROR]: '#ef4444',  // Red
  [LogLevel.FATAL]: '#7e22ce',  // Purple
  [LogLevel.CRITICAL]: '#b91c1c', // Dark red
  [LogLevel.SILENT]: '#000000'  // Black
};
