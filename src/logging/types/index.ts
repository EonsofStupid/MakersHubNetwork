
/**
 * Core logging system type definitions
 */

import React from 'react';

/**
 * Log levels in order of severity
 */
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  CRITICAL = 5,
  SUCCESS = 6
}

/**
 * Log categories for grouping and filtering
 */
export enum LogCategory {
  SYSTEM = 'system',
  NETWORK = 'network',
  AUTH = 'auth',
  UI = 'ui',
  ADMIN = 'admin',
  DATA = 'data',
  PERFORMANCE = 'performance',
  CHAT = 'chat',
  DATABASE = 'database',
  CONTENT = 'content',
  GENERAL = 'general'
}

/**
 * Log entry structure
 */
export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  category: LogCategory;
  message: string | number | boolean | React.ReactNode;
  source?: string;
  details?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  duration?: number; // For performance logs
  tags?: string[];
}

/**
 * Transport interface for sending logs to different destinations
 */
export interface LogTransport {
  log(entry: LogEntry): void;
  flush?(): Promise<void>;
  getLogs?(): LogEntry[];
  clear?(): void;
}

/**
 * Configuration options for the logging system
 */
export interface LoggingConfig {
  minLevel: LogLevel;
  enabledCategories?: LogCategory[];
  transports: LogTransport[];
  bufferSize?: number;
  flushInterval?: number;
  includeSource?: boolean;
  includeUser?: boolean;
  includeSession?: boolean;
}

/**
 * Callback type for log events
 */
export type LogEventCallback = (entry: LogEntry) => void;

/**
 * Logger interface
 */
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

/**
 * Options for individual log messages
 */
export interface LoggerOptions {
  category?: LogCategory;
  details?: Record<string, unknown>;
  source?: string;
  tags?: string[];
}

/**
 * Performance measurement options
 */
export interface PerformanceMeasurementOptions {
  category?: LogCategory;
  tags?: string[];
}

/**
 * Performance measurement result
 */
export interface MeasurementResult<T> {
  result: T;
  duration: number;
}
