import { LogLevel } from './types';

export const LOG_LEVELS: Record<LogLevel, number> = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5,
};

// Define transport types correctly
export type LogTransport = 'console' | 'memory' | 'api' | 'file' | 'custom';

export interface LoggerConfig {
  transports: LogTransport[];
  minLevel: LogLevel;
  category?: string;
}

export const DEFAULT_CONFIG: LoggerConfig = {
  transports: ['console', 'memory'],
  minLevel: 'info',
};

export const DEV_CONFIG: LoggerConfig = {
  transports: ['memory', 'console'],
  minLevel: 'debug',
};

export const PROD_CONFIG: LoggerConfig = {
  transports: ['api'],
  minLevel: 'warn',
};
