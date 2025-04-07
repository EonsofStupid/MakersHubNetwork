
import { LogLevel } from './constants/log-level';

export enum LogCategory {
  SYSTEM = 'system',
  NETWORK = 'network',
  UI = 'ui',
  AUTH = 'auth',
  ADMIN = 'admin',
  PERFORMANCE = 'performance',
  CHAT = 'chat',
  THEME = 'theme'
}

export interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: Date;
  category?: LogCategory;
  source?: string;
  details?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  duration?: number;
  tags?: string[];
}

export interface LogOptions {
  category?: LogCategory;
  source?: string;
  details?: Record<string, unknown>;
  tags?: string[];
  userId?: string;
  sessionId?: string;
  duration?: number;
}

export interface LoggerOptions {
  minLevel?: LogLevel;
  enableConsole?: boolean;
  bufferSize?: number;
  defaultCategory?: LogCategory;
  defaultSource?: string;
}

export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  bufferSize: number;
  defaultCategory: LogCategory;
  defaultSource: string;
}

export interface Logger {
  debug: (message: string, options?: LogOptions) => void;
  info: (message: string, options?: LogOptions) => void;
  warn: (message: string, options?: LogOptions) => void;
  error: (message: string, options?: LogOptions) => void;
  critical: (message: string, options?: LogOptions) => void;
}

export interface LogTransport {
  log: (logMessage: LogMessage) => void;
  flush?: () => Promise<void>;
}
