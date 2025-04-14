
import { v4 as uuidv4 } from 'uuid';
import { LogCategory, LogLevel, LogEvent, LogEntry, LogFilter, LogTransport } from '@/shared/types/shared.types';
import { logger } from './logger.service';

/**
 * LogBridge provides a unified interface for application logging
 * It acts as a facade over multiple logging mechanisms
 */
export class LogBridge {
  private static instance: LogBridge;
  private minLevel: LogLevel = LogLevel.INFO;
  private transports: LogTransport[] = [];
  private subscribers: ((event: LogEvent) => void)[] = [];

  private constructor() {
    // Private constructor to enforce singleton
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): LogBridge {
    if (!LogBridge.instance) {
      LogBridge.instance = new LogBridge();
    }
    return LogBridge.instance;
  }

  /**
   * Add a log transport
   */
  public addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  /**
   * Remove a log transport
   */
  public removeTransport(transportToRemove: LogTransport): void {
    this.transports = this.transports.filter(transport => transport !== transportToRemove);
  }

  /**
   * Set minimum log level
   */
  public setMinLevel(level: LogLevel): void {
    this.minLevel = level;
    
    // Also update all transports
    this.transports.forEach(transport => {
      transport.setMinLevel(level);
    });
  }

  /**
   * Get current minimum log level
   */
  public getMinLevel(): LogLevel {
    return this.minLevel;
  }

  /**
   * Subscribe to log events
   */
  public subscribe(callback: (event: LogEvent) => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify subscribers of new log event
   */
  private notify(entry: LogEntry): void {
    const event: LogEvent = { entry };
    this.subscribers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in log subscriber', error);
      }
    });
  }

  /**
   * Log a message
   */
  public log(level: LogLevel, category: LogCategory, message: string, details?: Record<string, unknown>): void {
    // Don't log if level is below minimum
    if (level === LogLevel.SILENT || this.shouldSkipLog(level)) {
      return;
    }
    
    const entry: LogEntry = {
      id: uuidv4(),
      level,
      category,
      message,
      timestamp: Date.now(),
      details: details || {}
    };
    
    // Send to all transports
    this.transports.forEach(transport => {
      try {
        if (transport.log) {
          transport.log(entry);
        }
      } catch (error) {
        console.error('Error in log transport', error);
      }
    });
    
    // Notify subscribers
    this.notify(entry);
  }
  
  /**
   * Determine if a log should be skipped based on level
   */
  private shouldSkipLog(level: LogLevel): boolean {
    const levelValues: Record<LogLevel, number> = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.SUCCESS]: 2,
      [LogLevel.WARN]: 3,
      [LogLevel.ERROR]: 4,
      [LogLevel.CRITICAL]: 5,
      [LogLevel.FATAL]: 6,
      [LogLevel.TRACE]: -1,
      [LogLevel.SILENT]: 100
    };
    
    return levelValues[level] < levelValues[this.minLevel];
  }
  
  /**
   * Convenience method for debug logs
   */
  public debug(category: LogCategory, message: string, details?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, category, message, details);
  }
  
  /**
   * Convenience method for info logs
   */
  public info(category: LogCategory, message: string, details?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, category, message, details);
  }
  
  /**
   * Convenience method for warning logs
   */
  public warn(category: LogCategory, message: string, details?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, category, message, details);
  }
  
  /**
   * Convenience method for error logs
   */
  public error(category: LogCategory, message: string, details?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, category, message, details);
  }
  
  /**
   * Query logs with filter
   */
  public query(filter: LogFilter = {}): LogEntry[] {
    // This is a simplified implementation
    // In a real app, you might query from a database or other storage
    
    // Convert date objects to timestamps if they exist
    if (filter.from instanceof Date) {
      filter.from = filter.from.getTime();
    }
    
    if (filter.to instanceof Date) {
      filter.to = filter.to.getTime();
    }
    
    return logger.getEntries(filter);
  }
  
  /**
   * Clear all logs
   */
  public clearLogs(): void {
    logger.clearLogs();
  }
}

export const logBridge = LogBridge.getInstance();
