
import { LoggingConfig, LogCategory, LogLevel } from '../types';
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
    LogCategory.AUTHENTICATION,
    LogCategory.API,
    LogCategory.THEME,
    LogCategory.ADMIN,
    LogCategory.PERFORMANCE
  ]
};
