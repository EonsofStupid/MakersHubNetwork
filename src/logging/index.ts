
// Import existing exports
import { getLogger, initializeLogger } from './logger';
import { LogLevel } from './types';

// Update LogCategory enum to include APP
export enum LogCategory {
  SYSTEM = 'system',
  UI = 'ui',
  ADMIN = 'admin',
  AUTH = 'auth',
  APP = 'app',
  THEME = 'theme',
  CHAT = 'chat',
  API = 'api'
}

// Re-export everything
export {
  getLogger,
  initializeLogger,
  LogLevel
};

export * from './context/LoggingContext';
export * from './components/LogConsole';
export * from './components/LogToggleButton';
