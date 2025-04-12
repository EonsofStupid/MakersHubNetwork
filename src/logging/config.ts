
import { LogLevel } from '@/shared/types/shared.types';

// Log level configuration
export const LOG_LEVELS: Record<LogLevel, number> = {
  trace: 0,
  debug: 1, 
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5,
  success: 2, // Same level as info but used for successful operations
  critical: 5, // Same level as fatal but used for critical issues
  silent: 999 // Highest level, will disable all logging
};

// Default minimum log level
export const DEFAULT_MIN_LEVEL: LogLevel = 'info';

// Transport configuration
export const DEFAULT_MAX_ENTRIES = 100;
export const PERSIST_LOGS = true;
export const STORAGE_KEY = 'app_logs';

// Log colors for console
export const LOG_COLORS: Record<LogLevel, string> = {
  trace: '#aaaaaa',
  debug: '#6badf6',
  info: '#35c5f3',
  warn: '#eab308',
  error: '#dc2626',
  fatal: '#991b1b',
  success: '#22c55e',
  critical: '#7f1d1d',
  silent: '#000000'
};

// Default log filter
export const DEFAULT_FILTER = '';
