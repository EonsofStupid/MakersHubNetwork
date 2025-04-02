
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
 * Simple timer interface for basic performance measurements
 */
export interface SimpleTimer {
  end(): number;
}

/**
 * Shared options for individual log messages
 */
export interface LoggerOptions {
  category?: LogCategory;
  details?: Record<string, unknown>;
  tags?: string[];
  description?: string; // For semantic labeling of duration logs
  source?: string;      // Source property for identifying the logging source
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
  duration?: number;
  tags?: string[];
}

/**
 * Log payload structure (for structured calls to logger)
 */
export interface LogPayload {
  level: keyof Logger;
  message: string;
  meta?: Record<string, unknown>;
  time?: string;
  category?: LogCategory;
  tags?: string[];
  details?: Record<string, unknown>;
  duration?: number;
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
 * Measurement completion callback interface
 */
export interface MeasurementCompletionData {
  name: string;
  duration: number;
  success: boolean;
  error?: unknown;
  [key: string]: unknown;
}

/**
 * Performance measurement options
 */
export interface PerformanceMeasurementOptions extends LoggerOptions {
  onComplete?: (data: MeasurementCompletionData) => void;
}

/**
 * Performance measurement result
 */
export interface MeasurementResult<T> {
  result: T;
  duration: number;
}

/**
 * Performance measurement interface
 */
export interface PerformanceMeasurement {
  start: (name: string) => void;
  end: (name: string, options?: LoggerOptions) => number;
  measure: <T>(name: string, fn: () => T | Promise<T>, options?: LoggerOptions) => Promise<T>;
}
