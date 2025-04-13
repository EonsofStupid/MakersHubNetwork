
import { LogLevel, LogCategory } from '@/shared/types/shared.types';
import { loggingBridge } from './bridge';

/**
 * Logger interface for structured logging
 */
export interface LogDetails {
  source?: string;
  details?: Record<string, any>;
  tags?: string[];
}

/**
 * Logger service for application-wide logging
 */
class Logger {
  /**
   * Log a message with a specified level and category
   */
  log(level: LogLevel, category: LogCategory, message: string, options?: LogDetails): void {
    const timestamp = new Date();
    
    const entry = {
      level,
      category,
      message,
      timestamp,
      source: options?.source || 'app',
      details: options?.details || {},
      tags: options?.tags || [],
    };
    
    // For development convenience
    this.consoleLog(entry);
    
    // Send to logging bridge
    loggingBridge.log(entry);
  }
  
  /**
   * Convenience method for debug logs
   */
  debug(category: LogCategory, message: string, options?: LogDetails): void {
    this.log(LogLevel.DEBUG, category, message, options);
  }
  
  /**
   * Convenience method for info logs
   */
  info(category: LogCategory, message: string, options?: LogDetails): void {
    this.log(LogLevel.INFO, category, message, options);
  }
  
  /**
   * Convenience method for warning logs
   */
  warn(category: LogCategory, message: string, options?: LogDetails): void {
    this.log(LogLevel.WARN, category, message, options);
  }
  
  /**
   * Convenience method for error logs
   */
  error(category: LogCategory, message: string, options?: LogDetails): void {
    this.log(LogLevel.ERROR, category, message, options);
  }
  
  /**
   * Output logs to console during development
   */
  private consoleLog(entry: any): void {
    const { level, category, message, source, details } = entry;
    
    const timestamp = new Date().toISOString();
    let style = '';
    
    switch (level) {
      case LogLevel.DEBUG:
        style = 'color: #6c757d';
        break;
      case LogLevel.INFO:
        style = 'color: #0d6efd';
        break;
      case LogLevel.WARN:
        style = 'color: #ffc107; font-weight: bold';
        break;
      case LogLevel.ERROR:
        style = 'color: #dc3545; font-weight: bold';
        break;
      default:
        style = 'color: #6c757d';
    }
    
    console.log(
      `%c[${timestamp}] [${level}] [${category}]${source ? ` [${source}]` : ''}: ${message}`,
      style
    );
    
    if (details && Object.keys(details).length > 0) {
      console.log('%c↳ Details:', 'color: #6c757d', details);
    }
  }
}

export const logger = new Logger();

/**
 * Create a logger with a specific source
 * @param source The source of the log
 */
export function getLogger(source: string) {
  return {
    log: (level: LogLevel, category: LogCategory, message: string, options?: Omit<LogDetails, 'source'>) => {
      logger.log(level, category, message, { ...options, source });
    },
    debug: (category: LogCategory, message: string, options?: Omit<LogDetails, 'source'>) => {
      logger.debug(category, message, { ...options, source });
    },
    info: (category: LogCategory, message: string, options?: Omit<LogDetails, 'source'>) => {
      logger.info(category, message, { ...options, source });
    },
    warn: (category: LogCategory, message: string, options?: Omit<LogDetails, 'source'>) => {
      logger.warn(category, message, { ...options, source });
    },
    error: (category: LogCategory, message: string, options?: Omit<LogDetails, 'source'>) => {
      logger.error(category, message, { ...options, source });
    }
  };
}
