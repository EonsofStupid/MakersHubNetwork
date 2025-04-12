
import { LogCategory, LogLevel, LogDetails, LOG_LEVEL_VALUES } from '@/shared/types/shared.types';
import { LogEntry, LogEvent, LogOptions, Transport } from './types';
import { ConsoleTransport } from './transports/console-transport';
import { MemoryTransport } from './transports/memory-transport';
import { UiTransport } from './transports/ui-transport';

export class LoggerService {
  private static instance: LoggerService;
  private transports: Transport[] = [
    new ConsoleTransport(LogLevel.INFO),
    new MemoryTransport({ minLevel: LogLevel.INFO, maxEntries: 1000 }),
    new UiTransport({ minLevel: LogLevel.INFO })
  ];
  
  private listeners: ((event: LogEvent) => void)[] = [];
  private logCounter = 0;
  
  // Private constructor for singleton pattern
  private constructor() {}
  
  // Get the singleton instance
  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }
  
  // Add a transport
  public addTransport(transport: Transport): void {
    this.transports.push(transport);
  }
  
  // Remove a transport
  public removeTransport(transport: Transport): void {
    this.transports = this.transports.filter(t => t !== transport);
  }
  
  // Clear all transports
  public clearTransports(): void {
    this.transports = [];
  }
  
  // Get all transports
  public getTransports(): Transport[] {
    return this.transports;
  }
  
  // Subscribe to log events
  public subscribe(callback: (event: LogEvent) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  // Main log method
  public log(
    level: LogLevel,
    message: string,
    category: LogCategory = LogCategory.DEFAULT,
    options?: LogOptions
  ): void {
    // Create log entry
    const id = `log_${Date.now()}_${this.logCounter++}`;
    const timestamp = options?.timestamp || new Date().toISOString();
    const details = options?.details;
    const source = options?.source;
    
    const entry: LogEntry = {
      id,
      level,
      message,
      category,
      timestamp,
      source,
      details
    };
    
    // Send to all transports
    this.transports.forEach(transport => {
      if (LOG_LEVEL_VALUES[level] >= LOG_LEVEL_VALUES[transport.getMinLevel()]) {
        transport.log(entry);
      }
    });
    
    // Notify all listeners
    const event: LogEvent = {
      type: 'LOG',
      entry
    };
    
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in log listener:', error);
      }
    });
  }
  
  // Convenience methods for different log levels
  public trace(message: string, category: LogCategory = LogCategory.DEFAULT, options?: LogOptions): void {
    this.log(LogLevel.TRACE, message, category, options);
  }
  
  public debug(message: string, category: LogCategory = LogCategory.DEFAULT, options?: LogOptions): void {
    this.log(LogLevel.DEBUG, message, category, options);
  }
  
  public info(message: string, category: LogCategory = LogCategory.DEFAULT, options?: LogOptions): void {
    this.log(LogLevel.INFO, message, category, options);
  }
  
  public warn(message: string, category: LogCategory = LogCategory.DEFAULT, options?: LogOptions): void {
    this.log(LogLevel.WARN, message, category, options);
  }
  
  public error(message: string, category: LogCategory = LogCategory.DEFAULT, options?: LogOptions): void {
    this.log(LogLevel.ERROR, message, category, options);
  }
  
  public fatal(message: string, category: LogCategory = LogCategory.DEFAULT, options?: LogOptions): void {
    this.log(LogLevel.FATAL, message, category, options);
  }
  
  public success(message: string, category: LogCategory = LogCategory.DEFAULT, options?: LogOptions): void {
    this.log(LogLevel.SUCCESS, message, category, options);
  }
  
  public critical(message: string, category: LogCategory = LogCategory.DEFAULT, options?: LogOptions): void {
    this.log(LogLevel.CRITICAL, message, category, options);
  }
  
  // Set log level for all transports
  public setLogLevel(level: LogLevel): void {
    this.transports.forEach(transport => {
      transport.setMinLevel(level);
    });
  }
}

// Create and export a singleton instance
export const logger = LoggerService.getInstance();
