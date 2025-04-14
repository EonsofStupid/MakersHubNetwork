
import { LogLevel, LogCategory, LogDetails, LogEntry } from '@/shared/types';
import { LogTransport } from './types';
import { ConsoleTransport } from './transports/console-transport';
import { MemoryTransport } from './transports/memory-transport';
import { UITransport } from './transports/ui-transport';

/**
 * Logger service for centralized logging
 */
class LoggerService {
  private static instance: LoggerService;
  private transports: LogTransport[] = [];

  private constructor() {
    // Add default transports
    this.transports.push(new ConsoleTransport());
    this.transports.push(new MemoryTransport());
    
    // Set minimum levels
    this.transports.forEach(transport => {
      transport.setMinLevel(LogLevel.DEBUG);
    });
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  /**
   * Add a transport
   */
  public addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  /**
   * Remove a transport
   */
  public removeTransport(transport: LogTransport): void {
    this.transports = this.transports.filter(t => t !== transport);
  }

  /**
   * Get transports of a specific type
   */
  public getTransports<T extends LogTransport>(transportType: new (...args: any[]) => T): T[] {
    return this.transports.filter(t => t instanceof transportType) as T[];
  }

  /**
   * Log a message with a specific level and category
   */
  public log(level: LogLevel, category: LogCategory, message: string, details?: LogDetails): void {
    const entry: LogEntry = {
      id: this.generateId(),
      level,
      category,
      message,
      timestamp: Date.now(),
      details,
      source: details?.source as string
    };

    this.transports.forEach(transport => {
      try {
        transport.log(entry);
      } catch (error) {
        console.error('Error in log transport:', error);
      }
    });
  }

  /**
   * Log a debug message
   */
  public debug(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.DEBUG, category, message, details);
  }

  /**
   * Log an info message
   */
  public info(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.INFO, category, message, details);
  }

  /**
   * Log a success message
   */
  public success(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.SUCCESS, category, message, details);
  }

  /**
   * Log a warning message
   */
  public warn(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.WARN, category, message, details);
  }

  /**
   * Log an error message
   */
  public error(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.ERROR, category, message, details);
  }

  /**
   * Log a critical message
   */
  public critical(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.CRITICAL, category, message, details);
  }

  /**
   * Log a fatal message
   */
  public fatal(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.FATAL, category, message, details);
  }

  /**
   * Log a trace message
   */
  public trace(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.TRACE, category, message, details);
  }

  /**
   * Get memory log entries
   */
  public getEntries() {
    const memoryTransports = this.getTransports(MemoryTransport);
    if (memoryTransports.length > 0) {
      return (memoryTransports[0] as MemoryTransport).getEntries();
    }
    return [];
  }

  /**
   * Clear all memory logs
   */
  public clearLogs() {
    const memoryTransports = this.getTransports(MemoryTransport);
    memoryTransports.forEach(transport => {
      (transport as MemoryTransport).clear();
    });
  }

  /**
   * Generate a unique ID for log entries
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

// Export the singleton instance
export const logger = LoggerService.getInstance();
