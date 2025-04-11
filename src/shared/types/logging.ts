
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export enum LogCategory {
  APP = 'app',
  AUTH = 'auth',
  ADMIN = 'admin',
  UI = 'ui',
  API = 'api',
  DATA = 'data',
  USER = 'user',
  SYSTEM = 'system'
}

export interface LogEvent {
  id: string;
  timestamp: number;
  level: LogLevel;
  category: LogCategory;
  message: string;
  context?: string;
  details?: Record<string, any>;
  source?: string;
  stackTrace?: string;
}

export interface LoggerOptions {
  minLevel?: LogLevel;
  enabledCategories?: LogCategory[];
  disabledCategories?: LogCategory[];
  metadata?: Record<string, any>;
  console?: boolean;
  remote?: boolean;
}

export interface Logger {
  debug(message: string, options?: Partial<LogEvent>): void;
  info(message: string, options?: Partial<LogEvent>): void;
  warn(message: string, options?: Partial<LogEvent>): void;
  error(message: string, options?: Partial<LogEvent>): void;
  log(level: LogLevel, message: string, options?: Partial<LogEvent>): void;
}
