
/**
 * Log levels for application logging
 */
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5
}

/**
 * Log categories for better organization and filtering
 */
export enum LogCategory {
  GENERAL = 'general',
  AUTH = 'auth',
  API = 'api',
  DATABASE = 'database',
  NAVIGATION = 'navigation',
  PERFORMANCE = 'performance',
  STATE = 'state',
  THEME = 'theme',
  UI = 'ui',
  USER = 'user',
  SYSTEM = 'system',
  CONTENT = 'content',
  ADMIN = 'admin',
  IMPORT = 'import',
  ANALYTICS = 'analytics',
  NOTIFICATIONS = 'notifications',
  LAYOUT = 'layout',
  COMPONENTS = 'components',
  FORMS = 'forms',
  VALIDATION = 'validation',
  MODELS = 'models',
  TRANSFORM = 'transform',
  SECURITY = 'security',
  ERROR = 'error',
  CACHE = 'cache',
  STORAGE = 'storage',
  TYPES = 'types',
  SESSION = 'session'
}

/**
 * Logger configuration interface
 */
export interface LoggerConfig {
  level?: LogLevel;
  category?: string;
  context?: Record<string, any>;
  enableConsole?: boolean;
  enableRemote?: boolean;
}

/**
 * Log entry structure
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  category: string;
  details?: any;
  context?: Record<string, any>;
  source?: string;
}

/**
 * Logger interface
 */
export interface Logger {
  trace(message: string, metadata?: Record<string, any>): void;
  debug(message: string, metadata?: Record<string, any>): void;
  info(message: string, metadata?: Record<string, any>): void;
  warn(message: string, metadata?: Record<string, any>): void;
  error(message: string, metadata?: Record<string, any>): void;
  fatal(message: string, metadata?: Record<string, any>): void;
  setContext(context: Record<string, any>): void;
  getContext(): Record<string, any>;
  withContext(context: Record<string, any>): Logger;
}
