
import { LoggingConfig, LogCategory, LogLevel } from '../types';
import { consoleTransport } from '../transports/console.transport';
import { memoryTransport } from '../transports/memory.transport';

/**
 * Default logging configuration
 */
export const defaultLoggingConfig: LoggingConfig = {
  // Default minimum log level
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  
  // Which categories are enabled
  enabledCategories: Object.values(LogCategory),
  
  // Transports to use
  transports: [
    consoleTransport,
    memoryTransport,
  ],
  
  // Buffer settings
  bufferSize: 10,
  flushInterval: 5000, // 5 seconds
  
  // Include extra info
  includeSource: true,
  includeUser: true,
  includeSession: true
};
