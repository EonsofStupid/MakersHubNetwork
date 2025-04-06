
import { v4 as uuidv4 } from 'uuid';
import { LogLevel } from './constants/log-level';
import { LogCategory, LogEntry, LogTransport, LoggingConfig, LogOptions } from './types';
import { defaultLoggingConfig } from './config';

/**
 * Core logger service for application-wide logging
 */
export class LoggerService {
  private static instance: LoggerService;
  private config: LoggingConfig;
  private buffer: LogEntry[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  private constructor(config: LoggingConfig = defaultLoggingConfig) {
    this.config = config;
    this.setupFlushTimer();
  }

  /**
   * Get the singleton instance of LoggerService
   */
  public static getInstance(config?: LoggingConfig): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService(config);
    } else if (config) {
      // Update config if provided
      LoggerService.instance.updateConfig(config);
    }
    return LoggerService.instance;
  }

  /**
   * Update logger configuration
   */
  public updateConfig(config: Partial<LoggingConfig>): void {
    this.config = { ...this.config, ...config };
    this.setupFlushTimer();
  }

  /**
   * Add or remove a transport
   */
  public configureTransport(transport: LogTransport, enable: boolean = true): void {
    if (enable) {
      // Add transport if it doesn't exist
      const exists = this.config.transports.some(t => t.id === transport.id);
      if (!exists) {
        this.config.transports = [...this.config.transports, transport];
      }
    } else {
      // Remove transport
      this.config.transports = this.config.transports.filter(t => t.id !== transport.id);
    }
  }

  /**
   * Check if a log level should be processed
   */
  private shouldLog(level: LogLevel, category?: LogCategory): boolean {
    // Check minimum log level
    const levelValue = Object.values(LogLevel).indexOf(level);
    const minLevelValue = Object.values(LogLevel).indexOf(this.config.minLevel);
    
    if (levelValue < minLevelValue) {
      return false;
    }

    // Check if category is enabled if categories are specified
    if (this.config.enabledCategories && category) {
      return this.config.enabledCategories.includes(category);
    }

    return true;
  }

  /**
   * Log a message to all configured transports
   */
  private logToTransports(entry: LogEntry): void {
    for (const transport of this.config.transports) {
      if (transport.enabled) {
        try {
          transport.log(entry);
        } catch (error) {
          console.error(`Error in transport ${transport.name}:`, error);
        }
      }
    }
  }

  /**
   * Log a debug message
   */
  public debug(message: string, options?: LogOptions): void {
    const category = options?.category || LogCategory.SYSTEM;
    
    if (!this.shouldLog(LogLevel.DEBUG, category)) {
      return;
    }

    const entry: LogEntry = {
      id: uuidv4(),
      level: LogLevel.DEBUG,
      message,
      timestamp: new Date(),
      category,
      source: options?.source || (this.config.includeSource ? this.getCallerInfo() : undefined),
      details: options,
    };

    this.processEntry(entry);
  }

  /**
   * Generic logging method for all levels
   */
  public log(level: LogLevel, message: string, options?: LogOptions): void {
    const category = options?.category || LogCategory.SYSTEM;
    
    if (!this.shouldLog(level, category)) {
      return;
    }

    const entry: LogEntry = {
      id: uuidv4(),
      level,
      message,
      timestamp: new Date(),
      category,
      source: options?.source || (this.config.includeSource ? this.getCallerInfo() : undefined),
      details: options,
    };

    this.processEntry(entry);
  }

  /**
   * Get caller information
   */
  private getCallerInfo(): string {
    try {
      const err = new Error();
      const stackLines = err.stack?.split('\n') || [];
      // Skip first lines which are this method and log methods
      const callerLine = stackLines[3] || 'unknown';
      // Extract just the file path and line number
      const match = callerLine.match(/at\s+(.+?)\s+\((.+?)\)/) || 
                    callerLine.match(/at\s+(.+)/);
      return match ? match[1] : 'unknown';
    } catch (e) {
      return 'unknown';
    }
  }

  /**
   * Process a log entry (buffer or immediate)
   */
  private processEntry(entry: LogEntry): void {
    if (this.config.bufferSize && this.config.bufferSize > 0) {
      this.buffer.push(entry);
      
      if (this.buffer.length >= this.config.bufferSize) {
        this.flush();
      }
    } else {
      // Log immediately if buffering is disabled
      this.logToTransports(entry);
    }
  }

  /**
   * Flush the log buffer
   */
  public flush(): void {
    const entries = [...this.buffer];
    this.buffer = [];
    
    for (const entry of entries) {
      this.logToTransports(entry);
    }
  }

  /**
   * Set up the flush timer
   */
  private setupFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    if (this.config.flushInterval && this.config.flushInterval > 0) {
      this.flushTimer = setInterval(() => {
        if (this.buffer.length > 0) {
          this.flush();
        }
      }, this.config.flushInterval);
    }
  }

  /**
   * Convenience methods for different log levels
   */
  public info(message: string, options?: LogOptions): void {
    this.log(LogLevel.INFO, message, options);
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

  /**
   * Performance logging
   */
  public logCustomTiming(name: string, duration: number, options?: LogOptions): void {
    const category = options?.category || LogCategory.PERFORMANCE;
    const message = `Performance: ${name} took ${duration}ms`;
    this.log(LogLevel.INFO, message, { 
      ...options, 
      category, 
      details: { 
        ...(options?.details || {}), 
        duration,
        performanceName: name
      } 
    });
  }
}

/**
 * Get a logger instance for a specific source
 */
export function getLogger(source?: string, category?: LogCategory): {
  debug: (message: string, options?: LogOptions) => void;
  info: (message: string, options?: LogOptions) => void;
  warn: (message: string, options?: LogOptions) => void;
  error: (message: string, options?: LogOptions) => void;
  critical: (message: string, options?: LogOptions) => void;
  logCustomTiming: (name: string, duration: number, options?: LogOptions) => void;
} {
  const logger = LoggerService.getInstance();
  
  return {
    debug: (message, options) => logger.debug(message, { ...options, source, category }),
    info: (message, options) => logger.info(message, { ...options, source, category }),
    warn: (message, options) => logger.warn(message, { ...options, source, category }),
    error: (message, options) => logger.error(message, { ...options, source, category }),
    critical: (message, options) => logger.critical(message, { ...options, source, category }),
    logCustomTiming: (name, duration, options) => logger.logCustomTiming(name, duration, { ...options, source, category }),
  };
}
