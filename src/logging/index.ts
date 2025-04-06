
// Import existing exports
import { getLogger, initializeLogger } from './logger';
import { LogLevel } from './constants/log-level';
import { memoryTransport } from './transports/memory-transport';

// Update LogCategory enum to include ALL needed categories
export enum LogCategory {
  SYSTEM = 'system',
  NETWORK = 'network',
  AUTH = 'auth',
  UI = 'ui',
  ADMIN = 'admin',
  APP = 'app',
  THEME = 'theme',
  CHAT = 'chat',
  DATABASE = 'database',
  PERFORMANCE = 'performance',
  CONTENT = 'content'
}

// Re-export everything
export {
  getLogger,
  initializeLogger,
  LogLevel,
  memoryTransport // Export memoryTransport
};

export * from './types';
export * from './context/LoggingContext';
export * from './components/LogConsole';
export * from './components/LogToggleButton';
