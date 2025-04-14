
import { LogLevel, LogCategory, LogEntry, LogDetails } from '@/shared/types/shared.types';
import { ConsoleTransport } from './transports/console-transport';
import { MemoryTransport } from './transports/memory-transport';

export interface LoggerOptions {
  defaultLevel?: LogLevel;
  transports?: LogTransport[];
  maxLogEntries?: number;
}

export interface LogTransport {
  log(entry: LogEntry): void;
}

/**
 * Core logger service for the application
 */
class LoggerService {
  private transports: LogTransport[] = [];
  private defaultLevel: LogLevel = LogLevel.INFO;
  
  constructor(options?: LoggerOptions) {
    this.defaultLevel = options?.defaultLevel || LogLevel.INFO;
    
    // Set up default transports if none provided
    if (options?.transports) {
      this.transports = options.transports;
    } else {
      this.transports = [
        new ConsoleTransport(),
        new MemoryTransport({ maxEntries: options?.maxLogEntries || 1000 })
      ];
    }
  }
  
  /**
   * Add a transport to the logger
   */
  public addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }
  
  /**
   * Log a message at the specified level
   */
  public log(level: LogLevel, category: LogCategory, message: string, details?: LogDetails): void {
    const entry: LogEntry = {
      level,
      category,
      message,
      timestamp: new Date(),
      source: details?.source,
      details: details,
      tags: details?.tags
    };
    
    // Send the entry to all transports
    this.transports.forEach(transport => transport.log(entry));
  }
  
  /**
   * Log debug level message
   */
  public debug(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.DEBUG, category, message, details);
  }
  
  /**
   * Log info level message
   */
  public info(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.INFO, category, message, details);
  }
  
  /**
   * Log success level message
   */
  public success(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.SUCCESS, category, message, details);
  }
  
  /**
   * Log warn level message
   */
  public warn(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.WARN, category, message, details);
  }
  
  /**
   * Log error level message
   */
  public error(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.ERROR, category, message, details);
  }
  
  /**
   * Log fatal level message
   */
  public fatal(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.FATAL, category, message, details);
  }
}

// Singleton instance
export const logger = new LoggerService();

// Convenient export for memory transport accessor
export const getMemoryTransport = (): MemoryTransport | undefined => {
  return logger.transports.find(
    transport => transport instanceof MemoryTransport
  ) as MemoryTransport | undefined;
};
