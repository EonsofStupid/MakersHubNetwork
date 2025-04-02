
import { LoggingConfig, LogCategory, LogLevel } from './types';
import { consoleTransport } from './transports/console.transport';
import { memoryTransport } from './transports/memory.transport';
import { supabaseTransport } from './transports/supabase.transport';

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
    // Only include Supabase transport in production
    ...(process.env.NODE_ENV === 'production' ? [supabaseTransport] : [])
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
 * Get the appropriate logging configuration for the current environment
 */
export function getLoggingConfig(): LoggingConfig {
  if (process.env.NODE_ENV === 'production') {
    return productionLoggingConfig;
  }
  
  if (process.env.NODE_ENV === 'test') {
    // Could add a test config here if needed
    return defaultLoggingConfig;
  }
  
  return developmentLoggingConfig;
}
