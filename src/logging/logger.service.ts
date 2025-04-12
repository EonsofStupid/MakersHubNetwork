
import { nanoid } from "nanoid";
import { LogCategory, LogLevel, LogEntry, LogEvent, LOG_LEVEL_VALUES } from "@/shared/types/shared.types";
import { ConsoleTransport } from "./transports/console-transport";
import { LogTransport } from "./types";

// Default transports
const defaultTransports: LogTransport[] = [
  new ConsoleTransport()
];

/**
 * Logger class for consistent logging throughout the application
 */
export class Logger {
  private source: string;
  private category: LogCategory;
  private static transports: LogTransport[] = [...defaultTransports];
  private static listeners: Array<(event: LogEvent) => void> = [];

  /**
   * Create a new logger instance
   * 
   * @param source The source of the logs (component/module name)
   * @param category The category of logs (default: LogCategory.DEFAULT)
   */
  constructor(source: string, category: LogCategory = LogCategory.DEFAULT) {
    this.source = source;
    this.category = category;
  }

  /**
   * Add a transport to the logger
   */
  static addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  /**
   * Remove a transport from the logger
   */
  static removeTransport(transport: LogTransport): void {
    this.transports = this.transports.filter(t => t !== transport);
  }

  /**
   * Debug level logging
   */
  debug(message: string, meta?: { details?: Record<string, unknown> }): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  /**
   * Info level logging
   */
  info(message: string, meta?: { details?: Record<string, unknown> }): void {
    this.log(LogLevel.INFO, message, meta);
  }

  /**
   * Warning level logging
   */
  warn(message: string, meta?: { details?: Record<string, unknown> }): void {
    this.log(LogLevel.WARN, message, meta);
  }

  /**
   * Error level logging
   */
  error(message: string, meta?: { details?: Record<string, unknown> }): void {
    this.log(LogLevel.ERROR, message, meta);
  }

  /**
   * Critical error logging
   */
  critical(message: string, meta?: { details?: Record<string, unknown> }): void {
    this.log(LogLevel.CRITICAL, message, meta);
  }

  /**
   * Success logging
   */
  success(message: string, meta?: { details?: Record<string, unknown> }): void {
    this.log(LogLevel.SUCCESS, message, meta);
  }

  /**
   * Trace logging
   */
  trace(message: string, meta?: { details?: Record<string, unknown> }): void {
    this.log(LogLevel.TRACE, message, meta);
  }

  /**
   * Subscribe to log events
   */
  static subscribe(listener: (event: LogEvent) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, meta?: { details?: Record<string, unknown> }): void {
    const logEntry: LogEntry = {
      id: nanoid(),
      level,
      message,
      timestamp: Date.now(),
      source: this.source,
      category: this.category,
      details: meta?.details || {}
    };

    const logEvent: LogEvent = { entry: logEntry };

    // Send to all transports
    Logger.transports.forEach(transport => {
      // Check if this transport should handle this log based on level
      const minLevelValue = LOG_LEVEL_VALUES[transport.minLevel as LogLevel] || 0;
      const currentLevelValue = LOG_LEVEL_VALUES[level] || 0;
      
      if (currentLevelValue >= minLevelValue) {
        try {
          if (typeof transport.details === 'object' && transport.details?.excludeCategories?.includes(this.category)) {
            return; // Skip this transport if the category is excluded
          }
          
          transport.log(logEntry);
        } catch (error) {
          console.error(`Transport error:`, error);
        }
      }
    });
    
    // Notify all listeners
    Logger.listeners.forEach(listener => {
      try {
        listener(logEvent);
      } catch (error) {
        console.error('Logger listener error:', error);
      }
    });
  }
}

/**
 * Get a logger instance
 * 
 * @param source The source of the logs (component/module name)
 * @param category The category of logs
 * @returns A Logger instance
 */
export function getLogger(source: string, category: LogCategory = LogCategory.DEFAULT): Logger {
  return new Logger(source, category);
}

// Re-export needed types
export type { LogTransport } from './types';
