
// Import existing exports
import { getLogger, initializeLogger } from './logger';
import { memoryTransport } from './transports/memory-transport';

// Update LogCategory enum to include ALL needed categories
import { LogCategory, LogLevel } from './types';

// Re-export everything
export {
  getLogger,
  initializeLogger,
  LogLevel,
  LogCategory,
  memoryTransport // Export memoryTransport
};

// Use export type for types when 'isolatedModules' is enabled
export type { LogEntry, LogOptions, Logger, LogMessage, Transport } from './types';
export * from './context/LoggingContext';
export * from './components/LogConsole';
export * from './components/LogToggleButton';
