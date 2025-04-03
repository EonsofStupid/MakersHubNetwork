
import { LoggingConfig, LogLevel, LogCategory } from '../types';
import { consoleTransport } from '../transports/console.transport';
import { memoryTransport } from '../transports/memory.transport';

/**
 * Default logging configuration
 */
export const defaultLoggingConfig: LoggingConfig = {
  minLevel: LogLevel.INFO,
  transports: [consoleTransport, memoryTransport],
  bufferSize: 10,
  flushInterval: 5000, // 5 seconds
  includeSource: true,
  includeUser: true,
  includeSession: true,
  enabledCategories: [
    LogCategory.SYSTEM as string,
    LogCategory.ERROR as string,
    LogCategory.AUTH as string,
    LogCategory.API as string,
    LogCategory.THEME as string,
    LogCategory.ADMIN as string,
    LogCategory.PERFORMANCE as string
  ]
};
