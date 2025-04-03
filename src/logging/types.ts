
import { ReactNode } from 'react';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

// Standardized log categories
export enum LogCategory {
  SYSTEM = 'system',
  AUTH = 'auth',
  UI = 'ui',
  DATA = 'data',
  API = 'api', 
  THEME = 'theme',
  RENDER = 'render',
  PERF = 'perf',
  DATABASE = 'database',
  ROUTER = 'router',
  NETWORK = 'network',
  USER = 'user',
  CONTENT = 'content'
}

export interface LoggerOptions {
  source?: string;
  category?: LogCategory | string;
  details?: Record<string, unknown>;
  tags?: string[];
  timestamp?: string;
  session_id?: string;
  user_id?: string;
  duration?: number;
}

export interface LogEvent {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: string;
  source: string;
  category: string | LogCategory;
  details?: Record<string, unknown>;
  tags?: string[];
  session_id?: string;
  user_id?: string;
  duration?: number;
}

export type LogTransportFn = (event: LogEvent) => void | Promise<void>;

export interface LoggerInstance {
  debug: (message: string, options?: Partial<LoggerOptions>) => void;
  info: (message: string, options?: Partial<LoggerOptions>) => void;
  warn: (message: string, options?: Partial<LoggerOptions>) => void;
  error: (message: string | Error, options?: Partial<LoggerOptions>) => void;
  fatal: (message: string | Error, options?: Partial<LoggerOptions>) => void;
  withSource: (source: string) => LoggerInstance;
  withCategory: (category: LogCategory | string) => LoggerInstance;
  withTags: (tags: string[]) => LoggerInstance;
  measure: <T>(name: string, fn: () => T, options?: Partial<LoggerOptions>) => T;
  markStart: (name: string, options?: Partial<LoggerOptions>) => void;
  markEnd: (name: string, options?: Partial<LoggerOptions>) => void;
}

export interface PerformanceMeasurement {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

export interface PerformanceMeasurementOptions {
  category?: LogCategory | string;
  details?: Record<string, unknown>;
  tags?: string[];
}

export interface MeasurementResult {
  name: string;
  duration: number;
  success: boolean;
}

export type LogEventCallback = (event: LogEvent) => void;
