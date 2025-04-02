
import { LoggingConfig, LogCategory, LogLevel } from './types';
import { memoryTransport } from './transports/memory';

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
    memoryTransport,
    // Console transport will be dynamically added
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

/**
 * Get the appropriate logging configuration for the current environment
 */
export function getLoggingConfig(): LoggingConfig {
  // Create a copy of the config to avoid modifying the original
  let config: LoggingConfig;
  
  if (process.env.NODE_ENV === 'production') {
    config = { ...productionLoggingConfig };
  } else if (process.env.NODE_ENV === 'test') {
    config = { ...testLoggingConfig };
  } else {
    config = { ...developmentLoggingConfig };
  }
  
  // Dynamically add console transport
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
    import('./transports/console').then(({ consoleTransport }) => {
      config.transports.push(consoleTransport);
    }).catch(error => {
      console.error('Failed to load console transport:', error);
    });
  }
  
  return config;
}
