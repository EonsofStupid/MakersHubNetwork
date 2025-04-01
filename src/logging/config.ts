
import { ConsoleTransport } from "./transports/console-transport";
import { MemoryTransport } from "./transports/memory-transport";
import { UITransport } from "./transports/ui-transport";
import { LogCategory, LogLevel, LoggingConfig } from "./types";

// Create shared instances of transports
export const consoleTransport = new ConsoleTransport();
export const memoryTransport = new MemoryTransport({ maxEntries: 1000 });
export const uiTransport = new UITransport({
  showDebug: false,
  showInfo: true,
  showWarning: true,
  showError: true,
  showCritical: true,
  throttleMs: 2000 // Throttle similar messages to avoid UI spam
});

/**
 * Default logging configuration
 */
export const defaultLoggingConfig: LoggingConfig = {
  minLevel: LogLevel.DEBUG,
  enabledCategories: Object.values(LogCategory),
  transports: [
    consoleTransport,
    memoryTransport,
    uiTransport
  ],
  bufferSize: 10,
  flushInterval: 5000,
  includeSource: true,
  includeUser: true,
  includeSession: true
};

/**
 * Development-specific configuration
 */
export const developmentLoggingConfig: LoggingConfig = {
  ...defaultLoggingConfig,
  minLevel: LogLevel.DEBUG
};

/**
 * Production-specific configuration
 */
export const productionLoggingConfig: LoggingConfig = {
  ...defaultLoggingConfig,
  minLevel: LogLevel.INFO,
  includeSource: false
};

/**
 * Get the appropriate config based on environment
 */
export function getLoggingConfig(): LoggingConfig {
  if (process.env.NODE_ENV === 'production') {
    return productionLoggingConfig;
  }
  return developmentLoggingConfig;
}
