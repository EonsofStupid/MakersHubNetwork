
import { v4 as uuidv4 } from 'uuid';
import { loggingBridge } from './bridge';
import { LogCategory, LogLevel, type LogDetails } from '@/shared/types/shared.types';

/**
 * Logger class for consistent logging across the application
 */
export class Logger {
  constructor(
    private readonly source: string,
    private readonly category: LogCategory
  ) {}

  /**
   * Log a message with the specified level
   */
  log(level: LogLevel, message: string, details?: LogDetails): void {
    const entry = {
      id: uuidv4(),
      level,
      category: this.category,
      message,
      details: {
        ...details,
        source: this.source,
      },
      timestamp: new Date().toISOString(),
      source: this.source,
    };

    // Send to logging bridge
    loggingBridge.log(entry);

    // Also log to console
    const logMethod = this.getConsoleMethod(level);
    console[logMethod](`[${level.toUpperCase()}][${this.category}] ${message}`, details);
  }

  /**
   * Log a debug message
   */
  debug(message: string, details?: LogDetails): void {
    this.log(LogLevel.DEBUG, message, details);
  }

  /**
   * Log an info message
   */
  info(message: string, details?: LogDetails): void {
    this.log(LogLevel.INFO, message, details);
  }

  /**
   * Log a warning message
   */
  warn(message: string, details?: LogDetails): void {
    this.log(LogLevel.WARN, message, details);
  }

  /**
   * Log an error message
   */
  error(message: string, details?: LogDetails): void {
    this.log(LogLevel.ERROR, message, details);
  }

  /**
   * Log a critical message
   */
  critical(message: string, details?: LogDetails): void {
    this.log(LogLevel.CRITICAL, message, details);
  }

  /**
   * Map log level to console method
   */
  private getConsoleMethod(level: LogLevel): 'log' | 'info' | 'warn' | 'error' | 'debug' {
    const mapping: Record<LogLevel, 'log' | 'info' | 'warn' | 'error' | 'debug'> = {
      [LogLevel.DEBUG]: 'debug',
      [LogLevel.INFO]: 'info',
      [LogLevel.SUCCESS]: 'info',
      [LogLevel.WARN]: 'warn',
      [LogLevel.ERROR]: 'error',
      [LogLevel.CRITICAL]: 'error',
      [LogLevel.FATAL]: 'error',
      [LogLevel.TRACE]: 'debug',
      [LogLevel.SILENT]: 'log',
    };
    return mapping[level] || 'log';
  }
}

/**
 * Create a new logger instance
 */
export function createLogger(source: string, category: LogCategory): Logger {
  return new Logger(source, category);
}

// Singleton logger for static usage
export const logger = {
  log: (level: LogLevel, category: LogCategory, message: string, details?: LogDetails) => {
    const logger = new Logger('AppLogger', category);
    logger.log(level, message, details);
  },
  debug: (category: LogCategory, message: string, details?: LogDetails) => {
    const logger = new Logger('AppLogger', category);
    logger.debug(message, details);
  },
  info: (category: LogCategory, message: string, details?: LogDetails) => {
    const logger = new Logger('AppLogger', category);
    logger.info(message, details);
  },
  warn: (category: LogCategory, message: string, details?: LogDetails) => {
    const logger = new Logger('AppLogger', category);
    logger.warn(message, details);
  },
  error: (category: LogCategory, message: string, details?: LogDetails) => {
    const logger = new Logger('AppLogger', category);
    logger.error(message, details);
  },
  critical: (category: LogCategory, message: string, details?: LogDetails) => {
    const logger = new Logger('AppLogger', category);
    logger.critical(message, details);
  }
};
