
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

/**
 * Development logging configuration
 */
export const developmentLoggingConfig: LoggingConfig = {
  ...defaultLoggingConfig,
  minLevel: LogLevel.DEBUG,
  bufferSize: 1, // Flush immediately in development
  flushInterval: 1000, // 1 second
};

/**
 * Production logging configuration
 */
export const productionLoggingConfig: LoggingConfig = {
  ...defaultLoggingConfig,
  minLevel: LogLevel.INFO,
  enabledCategories: [
    LogCategory.SYSTEM,
    LogCategory.AUTH,
    LogCategory.ADMIN,
    LogCategory.DATA,
    LogCategory.NETWORK,
    LogCategory.PERFORMANCE
  ],
  bufferSize: 20,
  flushInterval: 10000, // 10 seconds
};

/**
 * Test logging configuration
 */
export const testLoggingConfig: LoggingConfig = {
  ...defaultLoggingConfig,
  minLevel: LogLevel.ERROR, // Only log errors and above in tests
  transports: [memoryTransport], // Only use memory transport in tests
  bufferSize: 1,
  flushInterval: 0
};
