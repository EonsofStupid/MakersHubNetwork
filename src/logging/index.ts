
// Import existing exports
import { getLogger, initializeLogger } from './logger';
import { LogLevel } from './constants/log-level';
import { memoryTransport } from './transports/memory-transport';

// Update LogCategory enum to include ALL needed categories
import { LogCategory, LogEntry } from './types';

// Re-export everything
export {
  getLogger,
  initializeLogger,
  LogLevel,
  LogCategory,
  LogEntry,
  memoryTransport // Export memoryTransport
};

export * from './types';
export * from './context/LoggingContext';
export * from './components/LogConsole';
export * from './components/LogToggleButton';
