
import { LogEntry, LoggingConfig, LogTransport } from './types';
import { LogLevel, isLogLevelAtLeast } from './constants/log-level';
import { LogCategory } from './types';
import { getLoggingConfig } from './config';

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

  public log(level: LogLevel, message: string, options?: {
    category?: LogCategory;
    details?: Record<string, any>;
    source?: string;
    timestamp?: number;
  }): void {
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

    const timestamp = options?.timestamp || Date.now();
    const source = options?.source || '';
    const details = options?.details;

    // Create log entry
    const entry: LogEntry = {
      timestamp,
      level,
      message,
      category,
      source,
      details,
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
  public debug(message: string, options?: { category?: LogCategory; details?: Record<string, any>; source?: string; }): void {
    this.log(LogLevel.DEBUG, message, options);
  }

  public trace(message: string, options?: { category?: LogCategory; details?: Record<string, any>; source?: string; }): void {
    this.log(LogLevel.TRACE, message, options);
  }

  public info(message: string, options?: { category?: LogCategory; details?: Record<string, any>; source?: string; }): void {
    this.log(LogLevel.INFO, message, options);
  }

  public success(message: string, options?: { category?: LogCategory; details?: Record<string, any>; source?: string; }): void {
    this.log(LogLevel.SUCCESS, message, options);
  }

  public warn(message: string, options?: { category?: LogCategory; details?: Record<string, any>; source?: string; }): void {
    this.log(LogLevel.WARN, message, options);
  }

  public error(message: string, options?: { category?: LogCategory; details?: Record<string, any>; source?: string; }): void {
    this.log(LogLevel.ERROR, message, options);
  }

  public critical(message: string, options?: { category?: LogCategory; details?: Record<string, any>; source?: string; }): void {
    this.log(LogLevel.CRITICAL, message, options);
  }
}

// Factory function to create a logger instance with predefined source and category
export function getLogger(source?: string, category?: LogCategory) {
  const loggerService = LoggerService.getInstance();
  
  return {
    debug: (message: string, options?: { details?: Record<string, any>; category?: LogCategory; source?: string }) => 
      loggerService.debug(message, { source: options?.source || source, category: options?.category || category, details: options?.details }),
    trace: (message: string, options?: { details?: Record<string, any>; category?: LogCategory; source?: string }) => 
      loggerService.trace(message, { source: options?.source || source, category: options?.category || category, details: options?.details }),
    info: (message: string, options?: { details?: Record<string, any>; category?: LogCategory; source?: string }) => 
      loggerService.info(message, { source: options?.source || source, category: options?.category || category, details: options?.details }),
    success: (message: string, options?: { details?: Record<string, any>; category?: LogCategory; source?: string }) => 
      loggerService.success(message, { source: options?.source || source, category: options?.category || category, details: options?.details }),
    warn: (message: string, options?: { details?: Record<string, any>; category?: LogCategory; source?: string }) => 
      loggerService.warn(message, { source: options?.source || source, category: options?.category || category, details: options?.details }),
    error: (message: string, options?: { details?: Record<string, any>; category?: LogCategory; source?: string }) => 
      loggerService.error(message, { source: options?.source || source, category: options?.category || category, details: options?.details }),
    critical: (message: string, options?: { details?: Record<string, any>; category?: LogCategory; source?: string }) => 
      loggerService.critical(message, { source: options?.source || source, category: options?.category || category, details: options?.details }),
    // Add custom timing functionality for performance measurements
    logCustomTiming: (label: string, startTime: number): number => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      loggerService.info(`${label}: ${duration.toFixed(2)}ms`, { 
        source: source, 
        category: category, 
        details: { duration, label, startTime, endTime } 
      });
      return duration;
    }
  };
}
