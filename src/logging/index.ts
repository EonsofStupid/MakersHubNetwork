
import { v4 as uuidv4 } from 'uuid';
import { LogCategory, LogLevel, LogEntry } from './types';
import { getConfig } from './config';
import { loggingBridge } from './bridge';
import { memoryTransport } from './transports/memory-transport';
import { consoleTransport } from './transports/console-transport';

// Export shared types and components
export { LogCategory, LogLevel } from './types';
export { memoryTransport } from './transports/memory-transport';
export { consoleTransport } from './transports/console-transport';
export { loggingBridge } from './bridge';

/**
 * Logger class for sending logs to all configured transports
 */
class Logger {
  private source: string;
  private category: LogCategory;

  constructor(source: string, category: LogCategory = LogCategory.DEFAULT) {
    this.source = source;
    this.category = category;
  }

  /**
   * Send a log entry to the logging system
   */
  private log(level: LogLevel, message: string, options?: { details?: Record<string, unknown> }): void {
    // Create log entry
    const entry: LogEntry = {
      id: uuidv4(),
      timestamp: Date.now(),
      level,
      category: this.category,
      source: this.source,
      message,
      details: options?.details
    };

    // Send to bridge (which forwards to all transports)
    loggingBridge.log(entry);
    
    // Also log directly to built-in transports
    memoryTransport.log(entry);
    consoleTransport.log(entry);
  }

  /**
   * Log debug information (lowest level)
   */
  public debug(message: string, options?: { details?: Record<string, unknown> }): void {
    this.log(LogLevel.DEBUG, message, options);
  }

  /**
   * Log general information
   */
  public info(message: string, options?: { details?: Record<string, unknown> }): void {
    this.log(LogLevel.INFO, message, options);
  }

  /**
   * Log warnings
   */
  public warn(message: string, options?: { details?: Record<string, unknown> }): void {
    this.log(LogLevel.WARN, message, options);
  }

  /**
   * Log errors
   */
  public error(message: string, options?: { details?: Record<string, unknown> }): void {
    this.log(LogLevel.ERROR, message, options);
  }

  /**
   * Log critical errors (highest level)
   */
  public critical(message: string, options?: { details?: Record<string, unknown> }): void {
    this.log(LogLevel.CRITICAL, message, options);
  }
}

/**
 * Get a logger instance for a specific source and category
 */
export function getLogger(source: string = 'App', category: LogCategory = LogCategory.DEFAULT): Logger {
  return new Logger(source, category);
}
