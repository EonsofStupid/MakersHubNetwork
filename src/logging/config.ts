
import { LoggingConfig } from './types';
import { LogLevel } from './constants/log-level';
import { LogCategory } from './types';
import { ConsoleTransport } from './transports/console-transport';
import { MemoryTransport } from './transports/memory-transport';

// Default configuration for the logging system
const getDefaultLoggingConfig = (): LoggingConfig => ({
  minLevel: LogLevel.INFO,
  enabledCategories: Object.values(LogCategory),
  transports: [ConsoleTransport, MemoryTransport],
  bufferSize: 100,
  flushInterval: 30000, // 30 seconds
  includeSource: true,
  includeUser: true,
  includeSession: true,
});

// Global logging configuration that can be overwritten
let loggingConfig: LoggingConfig = getDefaultLoggingConfig();

// Get the current logging configuration
export const getLoggingConfig = (): LoggingConfig => {
  return loggingConfig;
};

// Update the logging configuration
export const updateLoggingConfig = (config: Partial<LoggingConfig>): LoggingConfig => {
  loggingConfig = { ...loggingConfig, ...config };
  return loggingConfig;
};

// Set minimum log level
export const setMinLogLevel = (level: LogLevel): void => {
  loggingConfig.minLevel = level;
};

// Enable specific log categories
export const enableLogCategories = (categories: LogCategory[]): void => {
  loggingConfig.enabledCategories = categories;
};

// Reset to default configuration
export const resetLoggingConfig = (): LoggingConfig => {
  loggingConfig = getDefaultLoggingConfig();
  return loggingConfig;
};

// For backward compatibility
export const defaultLoggingConfig = getDefaultLoggingConfig();
