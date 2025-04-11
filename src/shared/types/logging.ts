
export enum LogCategory {
  AUTH = 'auth',
  UI = 'ui',
  API = 'api',
  DATA = 'data',
  CHAT = 'chat',
  USER = 'user',
  THEME = 'theme',
  SYSTEM = 'system',
  ERROR = 'error'
}

export interface LogDetails {
  [key: string]: any;
}

export interface LogOptions {
  category?: LogCategory;
  details?: LogDetails;
}

export interface Logger {
  debug(message: string, options?: LogOptions): void;
  info(message: string, options?: LogOptions): void;
  warn(message: string, options?: LogOptions): void;
  error(message: string, options?: LogOptions): void;
}
