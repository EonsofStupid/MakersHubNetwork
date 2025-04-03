
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
  MISC = 'MISC'
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  id?: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source?: string;
  category?: string;
  details?: Record<string, any>;
}

export interface LoggerOptions {
  category?: string;
  source?: string;
  useConsole?: boolean;
}
