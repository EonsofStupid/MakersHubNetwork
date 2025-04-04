
import { LogLevel, LogCategory } from '../constants/log-level';

/**
 * Options for configuring a logger
 */
export interface LoggerOptions {
  level?: LogLevel;
  category?: LogCategory | string;
  details?: Record<string, any>;
  tags?: string[];
  metadata?: Record<string, any>;
  context?: Record<string, any>;
}

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
  success?: (message: string, options?: LoggerOptions) => void;
  performance?: (message: string, duration: number, options?: LoggerOptions) => void;
}

/**
 * Re-export LogCategory and LogLevel for easier access
 */
export { LogCategory, LogLevel };
