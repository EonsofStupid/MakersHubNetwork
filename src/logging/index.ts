
// Import existing exports
import { getLogger, initializeLogger } from './logger';
import { LogLevel } from './constants/log-level';

// Update LogCategory enum to include APP
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
  LogLevel
};

export * from './types';
export * from './context/LoggingContext';
export * from './components/LogConsole';
export * from './components/LogToggleButton';
