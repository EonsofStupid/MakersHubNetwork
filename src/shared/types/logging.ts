
export enum LogCategory {
  APP = 'app',
  AUTH = 'auth',
  API = 'api',
  ADMIN = 'admin',
  UI = 'ui',
  ROUTER = 'router',
  THEME = 'theme',
  DATA = 'data', 
  BRIDGE = 'bridge',
  CHAT = 'chat',
  ERROR = 'error'
}

export interface LogEvent {
  timestamp: string;
  category: LogCategory;
  level: LogLevel;
  message: string;
  source?: string;
  details?: Record<string, any>;
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface LoggerService {
  debug: (message: string, details?: Record<string, any>) => void;
  info: (message: string, details?: Record<string, any>) => void;
  warn: (message: string, details?: Record<string, any>) => void;
  error: (message: string, details?: Record<string, any>) => void;
  critical: (message: string, details?: Record<string, any>) => void;
}
