
import { LoggingConfig } from './types';
import { LogLevel } from './constants/log-level';
import { consoleTransport } from './transports/console.transport';
import { memoryTransport } from './transports/memory.transport';

/**
 * Default configuration for logging
 */
export const defaultLoggingConfig: LoggingConfig = {
  minLevel: LogLevel.DEBUG,
  enabledCategories: undefined, // All categories enabled
  transports: [
    consoleTransport,
    memoryTransport
  ],
  bufferSize: 10,
  flushInterval: 5000,
  includeSource: true,
  includeUser: true,
  includeSession: true
};
