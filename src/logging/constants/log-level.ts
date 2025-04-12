
import { LogLevel } from '@/shared/types/shared.types';

export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.TRACE]: 0,
  [LogLevel.DEBUG]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.SUCCESS]: 3,
  [LogLevel.WARN]: 4,
  [LogLevel.ERROR]: 5,
  [LogLevel.CRITICAL]: 6,
  [LogLevel.SILENT]: 7
};

export const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  [LogLevel.TRACE]: 'text-gray-400',
  [LogLevel.DEBUG]: 'text-gray-500',
  [LogLevel.INFO]: 'text-blue-500',
  [LogLevel.SUCCESS]: 'text-green-500',
  [LogLevel.WARN]: 'text-yellow-500',
  [LogLevel.ERROR]: 'text-red-500',
  [LogLevel.CRITICAL]: 'text-red-700',
  [LogLevel.SILENT]: 'text-gray-400'
};
