
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  CRITICAL = 5,
  SUCCESS = 6
}

export enum LogCategory {
  AUTH = 'AUTH',
  UI = 'UI',
  API = 'API',
  THEME = 'THEME',
  ROUTER = 'ROUTER',
  STATE = 'STATE',
  STORAGE = 'STORAGE',
  ERROR = 'ERROR',
  PERFORMANCE = 'PERFORMANCE',
  ADMIN = 'ADMIN',
  LIFECYCLE = 'LIFECYCLE',
  NETWORK = 'NETWORK',
  SYSTEM = 'SYSTEM',
  DATA = 'DATA',
  GENERAL = 'GENERAL',
  MISC = 'MISC'
}

export type LoggerOptions = {
  category?: string;
  source?: string;
  useConsole?: boolean;
  details?: Record<string, any>;
  tags?: string[];
};

export interface LogEntry {
  id?: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source?: string;
  category?: string;
  details?: Record<string, any>;
  tags?: string[];
  user_id?: string;
  session_id?: string;
}

export interface Logger {
  trace: (message: string, options?: LoggerOptions) => void;
  debug: (message: string, options?: LoggerOptions) => void;
  info: (message: string, options?: LoggerOptions) => void;
  warn: (message: string, options?: LoggerOptions) => void;
  error: (message: string, options?: LoggerOptions) => void;
  critical: (message: string, options?: LoggerOptions) => void;
  success: (message: string, options?: LoggerOptions) => void;
  performance: (message: string, duration: number, options?: LoggerOptions) => void;
}

export interface LogTransport {
  log: (entry: LogEntry) => void;
  flush?: () => Promise<void>;
  getLogs?: () => LogEntry[];
  clear?: () => void;
}

export interface LoggingConfig {
  minLevel: LogLevel;
  transports: LogTransport[];
  enabledCategories?: string[];
  disabledCategories?: string[];
  bufferSize?: number;
  flushInterval?: number;
  includeSource?: boolean;
  includeUser?: boolean;
  includeSession?: boolean;
}

export interface LogEventCallback {
  (entry: LogEntry): void;
}
