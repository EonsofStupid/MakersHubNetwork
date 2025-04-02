
import { v4 as uuidv4 } from 'uuid';
import { LogCategory, LogEntry, LogTransport, LoggingConfig } from './types';
import { LogLevel, isLogLevelAtLeast } from './constants/log-level';
import { defaultLoggingConfig } from './config';
import { isRecord } from '@/shared/utils/type-guards';
import { logEventEmitter } from './events/LogEventEmitter';

/**
 * Logger service - main class for logging management
 */
export class LoggerService {
  private static instance: LoggerService;
  private config: LoggingConfig;
  private buffer: LogEntry[] = [];
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  private userId: string | undefined;
  private sessionId: string | undefined;
  
  private constructor(config: LoggingConfig = defaultLoggingConfig) {
    this.config = { ...defaultLoggingConfig, ...config };
    this.sessionId = uuidv4();
    this.setupFlushInterval();
  }
  
  /**
   * Get the singleton instance of the logger
   */
  public static getInstance(config?: LoggingConfig): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService(config);
    }
    return LoggerService.instance;
  }
  
  /**
   * Update the logger configuration
   */
  public updateConfig(config: Partial<LoggingConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Update flush interval if it changed
    if (config.flushInterval && this.config.flushInterval !== config.flushInterval) {
      this.setupFlushInterval();
    }
  }
  
  /**
   * Set the current user ID for logs
   */
  public setUserId(userId: string | undefined): void {
    this.userId = userId;
  }
  
  /**
   * Log a message at TRACE level
   */
  public trace(message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    tags?: string[];
  }): void {
    this.log(LogLevel.TRACE, message, options);
  }
  
  /**
   * Log a message at DEBUG level
   */
  public debug(message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    tags?: string[];
  }): void {
    this.log(LogLevel.DEBUG, message, options);
  }
  
  /**
   * Log a message at INFO level
   */
  public info(message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    tags?: string[];
  }): void {
    this.log(LogLevel.INFO, message, options);
  }
  
  /**
   * Log a message at WARNING level
   */
  public warn(message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    tags?: string[];
  }): void {
    this.log(LogLevel.WARN, message, options);
  }
  
  /**
   * Log a message at ERROR level
   */
  public error(message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    tags?: string[];
  }): void {
    this.log(LogLevel.ERROR, message, options);
  }
  
  /**
   * Log a message at CRITICAL level
   */
  public critical(message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    tags?: string[];
  }): void {
    this.log(LogLevel.CRITICAL, message, options);
  }
  
  /**
   * Log a message at SUCCESS level
   */
  public success(message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    tags?: string[];
  }): void {
    this.log(LogLevel.SUCCESS, message, options);
  }
  
  /**
   * Log a performance measurement
   */
  public performance(message: string, duration: number, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    tags?: string[];
  }): void {
    const category = options?.category || LogCategory.PERFORMANCE;
    const processedDetails = isRecord(options?.details) ? 
      { ...options.details, duration } : 
      { duration };
      
    this.log(
      duration > 1000 ? LogLevel.WARN : LogLevel.INFO,
      message,
      {
        ...options,
        category,
        details: processedDetails
      }
    );
  }
  
  /**
   * The core logging method
   */
  private log(level: LogLevel, message: string, options?: {
    category?: LogCategory;
    details?: unknown;
    source?: string;
    duration?: number;
    tags?: string[];
  }): void {
    // Check if this log should be processed based on level and category
    if (!isLogLevelAtLeast(level, this.config.minLevel)) {
      return;
    }
    
    if (
      options?.category &&
      this.config.enabledCategories &&
      !this.config.enabledCategories.includes(options.category)
    ) {
      return;
    }
    
    // Process details with type safety
    const safeDetails = isRecord(options?.details) ? options.details : undefined;
    
    // Create the log entry
    const entry: LogEntry = {
      id: uuidv4(),
      timestamp: new Date(),
      level,
      category: options?.category || LogCategory.SYSTEM,
      message,
      details: safeDetails,
      duration: options?.duration,
      tags: options?.tags
    };
    
    // Add source if configured
    if (this.config.includeSource && options?.source) {
      entry.source = options.source;
    }
    
    // Add user ID if available and configured
    if (this.config.includeUser && this.userId) {
      entry.userId = this.userId;
    }
    
    // Add session ID if configured
    if (this.config.includeSession && this.sessionId) {
      entry.sessionId = this.sessionId;
    }
    
    // Add to buffer
    this.buffer.push(entry);
    
    // Process immediately or wait for flush
    if (
      this.buffer.length >= (this.config.bufferSize || 1) ||
      isLogLevelAtLeast(level, LogLevel.ERROR)
    ) {
      this.flush();
    }
    
    // Emit event for real-time logging
    try {
      logEventEmitter.emitLogEvent(entry);
    } catch (error) {
      console.error('Error emitting log event:', error);
    }
  }
  
  /**
   * Process all logs in the buffer
   */
  private flush(): void {
    if (this.buffer.length === 0) {
      return;
    }
    
    // Process each log through all transports
    for (const entry of this.buffer) {
      for (const transport of this.config.transports) {
        try {
          transport.log(entry);
        } catch (error) {
          console.error('Error in log transport:', error);
        }
      }
    }
    
    // Clear the buffer
    this.buffer = [];
  }
  
  /**
   * Set up automatic flush interval
   */
  private setupFlushInterval(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    
    if (this.config.flushInterval && this.config.flushInterval > 0) {
      this.flushInterval = setInterval(() => {
        this.flush();
      }, this.config.flushInterval);
    }
  }
  
  /**
   * Clean up resources
   */
  public dispose(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    // Final flush
    this.flush();
  }
}

/**
 * Get the global logger instance
 */
export function getLogger(source: string = 'App'): {
  trace: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => void;
  debug: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => void;
  info: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => void;
  warn: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => void;
  error: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => void;
  critical: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => void;
  success: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => void;
  performance: (message: string, duration: number, options?: { category?: LogCategory; details?: any; tags?: string[] }) => void;
} {
  const logger = LoggerService.getInstance();
  
  return {
    trace: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
      logger.trace(message, { ...options, source });
    },
    debug: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
      logger.debug(message, { ...options, source });
    },
    info: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
      logger.info(message, { ...options, source });
    },
    warn: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
      logger.warn(message, { ...options, source });
    },
    error: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
      logger.error(message, { ...options, source });
    },
    critical: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
      logger.critical(message, { ...options, source });
    },
    success: (message: string, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
      logger.success(message, { ...options, source });
    },
    performance: (message: string, duration: number, options?: { category?: LogCategory; details?: any; tags?: string[] }) => {
      logger.performance(message, duration, { ...options, source });
    }
  };
}
