
import { LogLevelType, LogCategoryType, LogLevel, LogCategory } from '../types';

interface LogOptions {
  category?: LogCategoryType;
  data?: unknown;
  timestamp?: number;
}

/**
 * Logger utility for client-side logging
 */
export class Logger {
  private static instance: Logger;

  private constructor() {
    // Private constructor to enforce singleton
  }

  /**
   * Get the singleton instance of the logger
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Internal log method that handles all logging levels
   */
  private log(level: LogLevelType, message: string, options?: LogOptions): void {
    const timestamp = options?.timestamp || Date.now();
    const category = options?.category || LogCategory.SYSTEM;
    const data = options?.data || {};

    const logEntry = {
      level,
      message,
      timestamp,
      category,
      data
    };

    // In development, output to console with appropriate styling
    if (process.env.NODE_ENV === 'development') {
      const styles = {
        [LogLevel.INFO]: 'color: #5eeaf7',
        [LogLevel.WARN]: 'color: #f6ad55',
        [LogLevel.ERROR]: 'color: #fc8181',
        [LogLevel.DEBUG]: 'color: #9f7aea',
      };

      console.log(`%c[${category}] ${level}:`, styles[level], message, data);
    }

    // In a real app, you might want to send this to a server or analytics service
    // this.sendToAnalyticsService(logEntry);
  }

  /**
   * Log information messages
   */
  public info(message: string, options?: LogOptions): void {
    this.log(LogLevel.INFO, message, options);
  }

  /**
   * Log warning messages
   */
  public warn(message: string, options?: LogOptions): void {
    this.log(LogLevel.WARN, message, options);
  }

  /**
   * Log error messages
   */
  public error(message: string, options?: LogOptions): void {
    this.log(LogLevel.ERROR, message, options);
  }

  /**
   * Log debug messages
   */
  public debug(message: string, options?: LogOptions): void {
    this.log(LogLevel.DEBUG, message, options);
  }

  /**
   * Log chat-specific messages
   */
  public chatEvent(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, { 
      category: LogCategory.CHAT, 
      data 
    });
  }
}

// Export a singleton instance
export const logger = Logger.getInstance();
