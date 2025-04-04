
import { LoggingConfig } from '../types';
import { LogCategory, LogLevel } from '@/constants/logLevel';
import { memoryTransport } from '../transports/memory.transport';

/**
 * Default logging configuration
 */
export const defaultLoggingConfig: LoggingConfig = {
  minLevel: LogLevel.INFO,
  enabled: true,
  transports: [memoryTransport],
  bufferSize: 10,
  flushInterval: 5000, // 5 seconds
  includeSource: true,
  includeUser: true,
  includeSession: true,
  enabledCategories: [
    LogCategory.SYSTEM,
    LogCategory.ERROR,
    LogCategory.AUTH,
    LogCategory.API,
    LogCategory.THEME,
    LogCategory.ADMIN,
    LogCategory.PERFORMANCE
  ]
};
