
import { LogLevel } from '@/shared/types/shared.types';

// Export the LogLevel enum directly
export { LogLevel };

// Map of log level values for comparisons
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.TRACE]: 0,
  [LogLevel.DEBUG]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.WARN]: 3,
  [LogLevel.ERROR]: 4,
  [LogLevel.FATAL]: 5,
  [LogLevel.SILENT]: 6
};
