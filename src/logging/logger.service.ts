
import { v4 as uuidv4 } from 'uuid';
import { LogLevel, LogCategory, LogEntry, LogEvent } from '@/shared/types/shared.types';
import { loggingBridge } from '@/logging/bridge';

/**
 * Logger class for centralized application logging
 */
class Logger {
  private source: string;
  private category: LogCategory;

  constructor(source: string, category: LogCategory = LogCategory.APP) {
    this.source = source;
    this.category = category;
  }

  /**
   * Log a message at the specified level
   */
  log(level: LogLevel, category: LogCategory, message: string, details?: Record<string, any>): void {
    const entry: LogEntry = {
      id: uuidv4(),
      level,
      category,
      message,
      details,
      timestamp: new Date().toISOString(),
      source: this.source
    };

    // Send to logging bridge
    loggingBridge.log(entry);

    // Also log to console in development
    this.consoleLog(entry);
  }

  /**
   * Debug level log
   */
  debug(message: string, details?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, this.category, message, details);
  }

  /**
   * Info level log
   */
  info(message: string, details?: Record<string, any>): void {
    this.log(LogLevel.INFO, this.category, message, details);
  }

  /**
   * Warn level log
   */
  warn(message: string, details?: Record<string, any>): void {
    this.log(LogLevel.WARN, this.category, message, details);
  }

  /**
   * Error level log
   */
  error(message: string, details?: Record<string, any>): void {
    this.log(LogLevel.ERROR, this.category, message, details);
  }

  /**
   * Critical level log
   */
  critical(message: string, details?: Record<string, any>): void {
    this.log(LogLevel.CRITICAL, this.category, message, details);
  }

  /**
   * Success level log
   */
  success(message: string, details?: Record<string, any>): void {
    this.log(LogLevel.SUCCESS, this.category, message, details);
  }

  /**
   * Trace level log
   */
  trace(message: string, details?: Record<string, any>): void {
    this.log(LogLevel.TRACE, this.category, message, details);
  }

  /**
   * Fatal level log
   */
  fatal(message: string, details?: Record<string, any>): void {
    this.log(LogLevel.FATAL, this.category, message, details);
  }

  /**
   * Log to console with appropriate styling based on level
   */
  private consoleLog(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const source = entry.source ? `[${entry.source}]` : '';
    const category = `[${entry.category}]`;
    const logPrefix = `${timestamp} ${category} ${source}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(`%c${logPrefix}`, 'color: #666', entry.message, entry.details || '');
        break;
      case LogLevel.INFO:
        console.info(`%c${logPrefix}`, 'color: #0086b3', entry.message, entry.details || '');
        break;
      case LogLevel.WARN:
        console.warn(`%c${logPrefix}`, 'color: #ffa500', entry.message, entry.details || '');
        break;
      case LogLevel.ERROR:
        console.error(`%c${logPrefix}`, 'color: #dc3545', entry.message, entry.details || '');
        break;
      case LogLevel.CRITICAL:
      case LogLevel.FATAL:
        console.error(`%c${logPrefix}`, 'color: #dc3545; font-weight: bold', entry.message, entry.details || '');
        break;
      case LogLevel.SUCCESS:
        console.log(`%c${logPrefix}`, 'color: #28a745', entry.message, entry.details || '');
        break;
      case LogLevel.TRACE:
        console.debug(`%c${logPrefix}`, 'color: #6c757d', entry.message, entry.details || '');
        break;
      default:
        console.log(`%c${logPrefix}`, '', entry.message, entry.details || '');
    }
  }
}

// Singleton logger instance for direct use
export const logger = new Logger('AppLogger');

// Function to create a new logger instance with a specific source
export function getLogger(source: string, category: LogCategory = LogCategory.APP): Logger {
  return new Logger(source, category);
}

export { Logger };
