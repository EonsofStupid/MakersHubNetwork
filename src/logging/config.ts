
import { LoggingConfig, LogCategory, LogTransport } from './types';
import { LogLevel } from './constants/log-level';
import { consoleTransport } from './transports/console-transport';
import { UITransport } from './transports/ui-transport';
import { memoryTransport } from './transports/memory-transport';

// Default logging configuration
export const defaultLoggingConfig: LoggingConfig = {
  minLevel: LogLevel.INFO, // Log info and above by default
  transports: [
    consoleTransport, // Always log to console
    new UITransport(),     // Show UI toasts for logs
    memoryTransport,       // Keep logs in memory for UI components
  ],
  bufferSize: 10,          // Buffer size before flush
  flushInterval: 5000,     // Flush interval in ms
  includeSource: true,     // Include source file/component info
  includeUser: true,       // Include user ID if available
  includeSession: true,    // Include session ID
};

// Get config based on environment
export function getLoggingConfig(): LoggingConfig {
  // In development, debug everything
  if (import.meta.env.DEV) {
    return {
      ...defaultLoggingConfig,
      minLevel: LogLevel.DEBUG,
      enabledCategories: Object.values(LogCategory),
    };
  }
  
  // In production, more selective
  return {
    ...defaultLoggingConfig,
    minLevel: LogLevel.INFO,
    // Exclude DEBUG level from UI transport in production
    transports: [
      consoleTransport,
      // Create a new UI transport with production settings
      new UITransport({
        minLevel: LogLevel.INFO,
        includeDebug: false,
        maxEntries: 50,
        enabled: true
      }),
      memoryTransport,
    ],
  };
}

// Export the memory transport for direct access in components
export { memoryTransport };
