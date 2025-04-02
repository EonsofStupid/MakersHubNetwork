
import { LoggingConfig, LogLevel } from '../types';
import { consoleTransport } from '../transports/console.transport';
import { memoryTransport } from '../transports/memory.transport';

/**
 * Default configuration for the logging system
 */
export const defaultLoggingConfig: LoggingConfig = {
  minLevel: LogLevel.INFO,
  transports: [consoleTransport, memoryTransport],
  bufferSize: 50,
  flushInterval: 10000,
  includeSource: true,
  includeUser: true,
  includeSession: true
};
