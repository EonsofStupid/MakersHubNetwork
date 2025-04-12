
// Define log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

// Define log categories
export enum LogCategory {
  APP = 'app',
  AUTH = 'auth',
  API = 'api',
  DB = 'db',
  UI = 'ui',
  SYSTEM = 'system',
  ADMIN = 'admin',
  USER = 'user',
}

// Define log event structure
export interface LogEvent {
  level: LogLevel;
  message: string;
  timestamp: Date;
  source: string;
  category: LogCategory;
  details: Record<string, unknown>;
}
