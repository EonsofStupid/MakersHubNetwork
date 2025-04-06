
import { LogEntry, LoggingConfig, LogTransport, LogOptions } from './types';
import { LogLevel, isLogLevelAtLeast } from './constants/log-level';
import { LogCategory } from './types';
import { getLoggingConfig } from './config';
import { v4 as uuidv4 } from 'uuid';

export class LoggerService {
  private static instance: LoggerService;
  private config: LoggingConfig;

  private constructor(config: LoggingConfig) {
    this.config = config;
  }

  public static getInstance(config?: LoggingConfig): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService(config || getLoggingConfig());
    }
    if (config) {
      LoggerService.instance.config = config;
    }
    return LoggerService.instance;
  }

  public log(level: LogLevel, message: string, options?: LogOptions): void {
    const { minLevel, enabledCategories, transports } = this.config;

    // Check if level is enabled
    if (!isLogLevelAtLeast(level, minLevel)) {
      return;
    }

    // Check if category is enabled
    const category = options?.category;
    if (category && enabledCategories && !enabledCategories.includes(category)) {
      return;
    }

    const timestamp = Date.now();
    const source = options?.source || '';
    const details = options?.details;
    const tags = options?.tags;
    const id = uuidv4(); // Generate an ID for each log entry

    // Create log entry
    const entry: LogEntry = {
      id,
      timestamp,
      level,
      message,
      category,
      source,
      details,
      tags
    };

    // Log to all enabled transports
    for (const transport of transports) {
      if (transport.enabled) {
        try {
          transport.log(entry);
        } catch (error) {
          // Don't use console here to avoid potential infinite loops
          // if there's an issue with the console transport itself
        }
      }
    }
  }

  // Logger methods for each level
  public debug(message: string, options?: LogOptions): void {
    this.log(LogLevel.DEBUG, message, options);
  }

  public trace(message: string, options?: LogOptions): void {
    this.log(LogLevel.TRACE, message, options);
  }

  public info(message: string, options?: LogOptions): void {
    this.log(LogLevel.INFO, message, options);
  }

  public success(message: string, options?: LogOptions): void {
    this.log(LogLevel.SUCCESS, message, options);
  }

  public warn(message: string, options?: LogOptions): void {
    this.log(LogLevel.WARN, message, options);
  }

  public error(message: string, options?: LogOptions): void {
    this.log(LogLevel.ERROR, message, options);
  }

  public critical(message: string, options?: LogOptions): void {
    this.log(LogLevel.CRITICAL, message, options);
  }
  
  // Additional method for performance timing
  public logCustomTiming(label: string, startTime: number): number {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    this.info(`${label}: ${duration.toFixed(2)}ms`, {
      details: { 
        duration, 
        label, 
        startTime, 
        endTime 
      },
      category: LogCategory.PERFORMANCE
    });
    
    return duration;
  }
}

// Factory function to create a logger instance with predefined source and category
export function getLogger(source?: string, category?: LogCategory) {
  const loggerService = LoggerService.getInstance();
  
  return {
    debug: (message: string, options?: LogOptions) => 
      loggerService.debug(message, { ...options, source: options?.source || source, category: options?.category || category }),
    trace: (message: string, options?: LogOptions) => 
      loggerService.trace(message, { ...options, source: options?.source || source, category: options?.category || category }),
    info: (message: string, options?: LogOptions) => 
      loggerService.info(message, { ...options, source: options?.source || source, category: options?.category || category }),
    success: (message: string, options?: LogOptions) => 
      loggerService.success(message, { ...options, source: options?.source || source, category: options?.category || category }),
    warn: (message: string, options?: LogOptions) => 
      loggerService.warn(message, { ...options, source: options?.source || source, category: options?.category || category }),
    error: (message: string, options?: LogOptions) => 
      loggerService.error(message, { ...options, source: options?.source || source, category: options?.category || category }),
    critical: (message: string, options?: LogOptions) => 
      loggerService.critical(message, { ...options, source: options?.source || source, category: options?.category || category }),
    // Add custom timing functionality for performance measurements
    logCustomTiming: (label: string, startTime: number): number => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      loggerService.info(`${label}: ${duration.toFixed(2)}ms`, { 
        source: source, 
        category: category || LogCategory.PERFORMANCE, 
        details: { duration, label, startTime, endTime } 
      });
      return duration;
    }
  };
}
