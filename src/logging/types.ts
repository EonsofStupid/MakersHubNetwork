
import { LogLevel } from './constants/log-level';
import { ReactNode } from 'react';

export enum LogCategory {
  SYSTEM = 'system',
  NETWORK = 'network',
  UI = 'ui',
  AUTH = 'auth',
  ADMIN = 'admin',
  PERFORMANCE = 'performance',
  CHAT = 'chat',
  THEME = 'theme',
  DATABASE = 'database',
  CONTENT = 'content'
}

export interface LogMessage {
  level: LogLevel;
  message: string | ReactNode;
  timestamp: Date;
  category?: LogCategory;
  source?: string;
  details?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  duration?: number;
  tags?: string[];
  error?: boolean;
  success?: boolean;
}

export interface LogEntry extends LogMessage {
  id: string;
}

export interface LogOptions {
  category?: LogCategory;
  source?: string;
  details?: Record<string, unknown>;
  tags?: string[];
  userId?: string;
  sessionId?: string;
  duration?: number;
  error?: boolean;
  success?: boolean;
  // Added additional properties that were being used
  warning?: boolean;
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
  debug: (message: string | ReactNode, options?: LogOptions) => void;
  info: (message: string | ReactNode, options?: LogOptions) => void;
  warn: (message: string | ReactNode, options?: LogOptions) => void;
  error: (message: string | ReactNode, options?: LogOptions) => void;
  critical: (message: string | ReactNode, options?: LogOptions) => void;
}

export interface LogTransport {
  log: (logMessage: LogEntry) => void;
  flush?: () => Promise<void>;
}

// Add LoggingConfig interface needed by logger.service.ts
export interface LoggingConfig {
  minLevel: LogLevel;
  transports: LogTransport[];
  bufferSize?: number;
  flushInterval?: number;
  includeSource?: boolean;
  includeUser?: boolean;
  includeSession?: boolean;
  enabledCategories?: LogCategory[];
}

// Re-export LogLevel to fix missing export error
export { LogLevel } from './constants/log-level';

